// as of python time {write-time}
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

// creates a referene to the object store
// good for 1 transaction
function openStateObjectStore(db) {
		return new Promise((success, reject) => {
				const stateObjectStore = db
							.transaction(STATE_DB_STORE_NAME, "readwrite")
							.objectStore(STATE_DB_STORE_NAME);
				success(stateObjectStore);
		});
}


// open the state database, where we store the service worker's
// internal state
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

// set a value in the service worker's persisted state
function stateObjectSet(stateObjectStore, key, value) {
		return new Promise((success, reject)=>{
				const request = stateObjectStore.put({key, value});
				request.onsuccess = (event) => {
						success(event);
				};
				request.onerror = (event) => reject(event);
		});
}

// get data from the service worker's persisted state
function stateObjectGet(stateObjectStore, key) {
		return new Promise((success, reject)=>{
				const request = stateObjectStore.get(key);
				request.onsuccess = (event) => {
						success(event.target.result?.value);
				};
				request.onerror = (event) => success(null);
		});
}

// converts a time-stamped list of paths to a map
function stampedListToMap(stamped) {
		const map = {};
		for (let item of stamped) {
				map[item.path] = item.time;
		}
		return map;
}

// check for stamped paths not in the path map
function itemsNotInMap(toCheck, map) {
		const notFound = [];
		for (let item of toCheck) {
				if (map[item.path] == null) {
						notFound.push(item);
				}
		}
		return notFound;
}

// determines which stamped paths need to be rerequested
// because their timestamp is different
// time does not flow only in one direction; only check diff
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


// compute itemsInNeedOfUpdate different in old vs new stamped paths
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
		// convert the failed urls into a map
		// so that we can check if a url is present
		// in its set more efficiently
		const failedUrlsMap = {};
		for (let url of failedUrls) {
				if (url != null) {
						failedUrlsMap[url] = true;
				}
		}
		// return only the time-stamped paths that aren't in the
		// failed url map
		return stampedPaths.filter(item=>!(item.path in failedUrlsMap));
}

/**
	 add resources to the cache (on install/update)

	 only adds resources that either failed to update last install
	 or were changed in the latest release

	 the current state of files, and when they were last changed
	 is stored in the service worker's indexedDB state store
 */
async function addResourcesToCache () {
		// find the new set of paths needed to run the app
		// stamped with when they were last modified
		const stampedPaths = await fetch('js/service-worker/files.json', NO_CACHE)
					.then(response=>response.json());

		// this is where we save the files associated with request paths
		let cache = caches.open(CACHE_NAME);

		// resources to be loaded (that need refreshing)
		let resources = null;
		// our service worker's persisted state
		const database = await openDB();

		// the current request paths that have been cached
		const oldStampedFiles =
					await stateObjectGet(
							await openStateObjectStore(database),
							STAMPED_FILES_KEY);
		if (oldStampedFiles == null) {
				// fresh install, we need to cache all request paths
				resources = stampedPaths;
		} else {
				// not fresh, figure out what changed
				resources = diffStampedLists(oldStampedFiles, stampedPaths);
		}

		// resources is now just a list of paths we should cache
		// timestamps only needed for freshness test
		resources = resources.map(stamped => stamped.path);
		if (resources.length == 0) {
				// nothing needs updating! we're all good

				// we must have made non-resource based changes to the
				// service worker, use the new version immediately
				await self.skipWaiting();

				return;
		}
		// wait for the cache to finish opening
		cache = await cache;

		// add all resource request paths to the cache
		// and figure out if any fail to load
		const failedUrls = await addAll(cache, resources);

		// save only the successful paths as being up to date
		const updatedStampedPaths = removeFailedUrlsFromStampedFiles(
				failedUrls, stampedPaths
		);
		
		console.log("updated cache");

		// persist the record of our work to our state
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
				await addToCache(url, fetched);
				return fetched;
		}
		return val;
}

// try to respond from our offline cache
// if necessary, request the resource form the server
// and cache the result if it's a resource
// we have ownership over
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    url.hash = "";
    url.search = "";
    event.respondWith(resolveUrl(url));
});
