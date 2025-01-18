const CACHE_NAME = "v1";
const STATE_CACHE_NAME = "state";

const addResourcesToCache = async () => {
		const stampedPaths = await fetch('js/service-worker/files.json')
					.then(response=>response.json());
		
		let cache = caches.open(CACHE_NAME);
		let stateCache = caches.open(STATE_CACHE_NAME);
		const resources = stampedPaths.map(stamped => stamped.path);
		stateCache = await stateCache;
		
		
		
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
