const CACHE_NAME = "v1";
const STATE_DB_NAME = "ServiceWorkerDB";
const STATE_DB_VERSION = 1;
const STATE_DB_STORE_NAME = 1;
const STAMPED_FILES_KEY = "stamped-files";

function openObjectStore(db, success, reject) {
		const stateObjectStore = db
					.transaction(STATE_DB_STORE_NAME, "readwrite")
					.objectStore(STATE_DB_STORE_NAME);
		success(stateObjectStore);
}

function openDB() {
		return new Promise((success, reject)=>{
				const request = window.indexedDB.open(STATE_DB_NAME, STATE_DB_VERSION);
				request.onupgradeneeded = (event) => {
						const db = event.target.result;
						const objectStore = db.createObjectStore(STATE_DB_STORE_NAME, { keyPath: "key" });
						objectStore.transaction.oncomplete = (event) => {
								openObjectStore(db, success, reject);
						};
				};
				request.onsuccess = (event) => {
						const db = event.target.result;
						openObjectStore(db, success, reject);
				};
				request.onerror = reject;
		});
}

function stateObjectGet(stateObjectStore, key) {
		return new Promise((success, reject)=>{
				const request = stateObjectStore.get(key);
				request.onsuccess = (event) => {
						success(event.target.result.value);
				};
				request.onerror = (event) => success(null);
}

const addResourcesToCache = async () => {
		const stampedPaths = await fetch('js/service-worker/files.json')
					.then(response=>response.json());
		
		let cache = caches.open(CACHE_NAME);
		let stateCache = caches.open(STATE_CACHE_NAME);
		const resources = stampedPaths.map(stamped => stamped.path);
		stateCache = await stateCache;
		const stateObjectStore = await openDB();
		const oldStampedFiles =
					stateObjectGet(stateObjectStore, STAMPED_FILES_KEY);
		
		cache = await cache;
		await cache.addAll(resources);
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
