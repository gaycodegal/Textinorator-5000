// as of python time 1737330832.8461514
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

function addAll(cache, resources) {
		return Promise.all(
				resources.map(async (url) => {
						const response = await fetch(url, NO_CACHE);
						await cache.put(url, response);
				})
		);
}

const addResourcesToCache = async () => {
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
		addAll(cache, resources);
		console.log("updated cache");
		
		await stateObjectSet(
			await openStateObjectStore(database),
			STAMPED_FILES_KEY,
				stampedPaths);

		// use new cache immediately
		await self.skipWaiting();
};

self.addEventListener("install", event => {
		event.waitUntil(addResourcesToCache());
});


self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    url.hash = "";
    url.search = "";
    event.respondWith(caches.match(url.toString()));
});
