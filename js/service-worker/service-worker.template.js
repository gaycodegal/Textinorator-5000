const addResourcesToCache = async (resources) => {
		const cache = await caches.open("v1");
		await cache.addAll(resources);
};

self.addEventListener("install", event => {
    event.waitUntil(
				addResourcesToCache([
						".",
						"manifest.json",
						"favicon.ico",
						//{extra_sources_here}
				])
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    url.hash = "";
    url.search = "";
    event.respondWith(caches.match(url.toString()));
});
