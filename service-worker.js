// as of python time 1737784014.7258961
const CACHE_NAME = "v1";
const STATE_DB_NAME = "ServiceWorkerDB";
const STATE_DB_VERSION = 1;
const STATE_DB_STORE_NAME = 1;
const STAMPED_FILES_KEY = "stamped-files";
const NO_CACHE = {
		headers: {
				'Cache-Control': 'no-cache'
		}
};

function openStateObjectStore(db) {
		return new Promise((success, reject) => {
				const stateObjectStore = db
							.transaction(STATE_DB_STORE_NAME, "readwrite")
							.objectStore(STATE_DB_STORE_NAME);
				success(stateObjectStore);
		});
}

function openDB() {
		return new Promise((success, reject)=>{
				const request = indexedDB.open(STATE_DB_NAME, STATE_DB_VERSION);
				request.onupgradeneeded = (event) => {
						const db = event.target.result;
						const objectStore = db.createObjectStore(STATE_DB_STORE_NAME, { keyPath: "key" });
						objectStore.transaction.oncomplete = (event) => {
								success(db);
						};
				};
				request.onsuccess = (event) => {
						const db = event.target.result;
						success(db);
				};
				request.onerror = reject;
		});
}

function stateObjectSet(stateObjectStore, key, value) {
		return new Promise((success, reject)=>{
				const request = stateObjectStore.put({key, value});
				request.onsuccess = (event) => {
						success(event);
				};
				request.onerror = (event) => reject(event);
		});
}

function stateObjectGet(stateObjectStore, key) {
		return new Promise((success, reject)=>{
				const request = stateObjectStore.get(key);
				request.onsuccess = (event) => {
						success(event.target.result?.value);
				};
				request.onerror = (event) => success(null);
		});
}

function stampedListToMap(stamped) {
		const map = {};
		for (let item of stamped) {
				map[item.path] = item.time;
		}
		return map;
}

function itemsNotInMap(toCheck, map) {
		const notFound = [];
		for (let item of toCheck) {
				if (map[item.path] == null) {
						notFound.push(item);
				}
		}
		return notFound;
}

function itemsInNeedOfUpdate(toCheck, map) {
		const shouldUpdate = [];
		for (let item of toCheck) {
				const compare = map[item.path];
				if (item.time != compare) {
						shouldUpdate.push(item);
				}
		}
		return shouldUpdate;
}


function diffStampedLists(oldStamped, newStamped) {
		const oldMap = stampedListToMap(oldStamped);
		//const nextMap = stampedListToMap(nextStamped);
		//const toDelete = itemsNotInMap(oldStamped, nextMap);
		return itemsInNeedOfUpdate(newStamped, oldMap);
}


/**
	 add all resources to the cache. returns
	 a promise with a list of all resource urls
	 that failed to load properly
 */
function addAll(cache, resources) {
		return Promise.all(
				resources.map(async (url) => {
						try {
								const response = await fetch(url, NO_CACHE);
								if (!response.ok) {
										// we've failed to get the resource
										// so it will be repopulated
										// next time it is requested
										// or when the service worker is reinstalled
										await cache.delete(url);
										return url;
								}
								await cache.put(url, response);
								return null;
						} catch(e) {
								return url;
						}
				})
		);
}

function removeFailedUrlsFromStampedFiles(failedUrls, stampedPaths) {
		const urls = {};
		for (let url of failedUrls) {
				if (url != null) {
						urls[url] = true;
				}
		}
		return stampedPaths.filter(item=>!(item.path in urls));
}

async function addResourcesToCache () {
		const stampedPaths = await fetch('js/service-worker/files.json', NO_CACHE)
					.then(response=>response.json());
		let cache = caches.open(CACHE_NAME);
		let resources = null;
		const database = await openDB();
		const oldStampedFiles =
					await stateObjectGet(
							await openStateObjectStore(database),
							STAMPED_FILES_KEY);
		if (oldStampedFiles == null) {
				resources = stampedPaths;
		} else {
				resources = diffStampedLists(oldStampedFiles, stampedPaths);
		}
		
		resources = resources.map(stamped => stamped.path);
		if (resources.length == 0) {
				return;
		}
		cache = await cache;
		const failedUrls = await addAll(cache, resources);
		const updatedStampedPaths = removeFailedUrlsFromStampedFiles(
				failedUrls, stampedPaths
		);
		
		console.log("updated cache");
		
		await stateObjectSet(
			await openStateObjectStore(database),
			STAMPED_FILES_KEY,
				updatedStampedPaths);

		// use new cache immediately
		await self.skipWaiting();
};

self.addEventListener("install", event => {
		event.waitUntil(addResourcesToCache());
});

async function addToCacheAsync(url, response) {
		// if we experienced an error, don't add it to the cache
		if (!response.ok) {
				return null;
		}
		let cache = await caches.open(CACHE_NAME);
		await cache.put(url.pathname, response);
}

function addToCache(url, response) {
		// add a copy of this resource to the cache
		const cloned = response.clone();
		return addToCacheAsync(url, cloned);
}

async function resolveUrl(url) {
		const val = await caches.match(url.toString());

		// we did not find that url in our cache
		// possibly because of a server issue at install time
		if (!val) {
				const baseUrl = new URL(location.href);
				if (baseUrl.origin != url.origin) {
						// it's an external url, shouldn't be in our cache
						// direct the user to the real resource
						return await fetch(url);
				}

				// It is part of our app, request the latest version
				// of the resource and add it to our cache
				const fetched = await fetch(url, NO_CACHE);
				addToCache(url, fetched);
				return fetched;
		}
		return val;
}

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    url.hash = "";
    url.search = "";
    event.respondWith(resolveUrl(url));
});
