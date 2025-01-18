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
						"html/icons/icon-192.webp",
						//
"LICENSE.txt",
"README.md",
"css/apply-colors.css",
"css/colors.css",
"css/tool.css",
"html/license.html",
"index.html",
"js/dark-mode.js",
"js/events/drag.js",
"js/init-module.js",
"js/logic/color-chooser.js",
"js/logic/colors.js",
"js/logic/set-background.js",
"js/logic/set-up-color-controls.js",
"js/logic/set-up-draw-tool.js",
"js/logic/set-up-focus-events.js",
"js/logic/set-up-font-events.js",
"js/logic/set-up-tool-selector.js",
"js/logic/text-tool-set-up.js",
"js/main.js",
"js/math/box.js",
"js/math/point.js",
"js/math/stack.js",
"js/render/boxdraghandler.js",
"js/render/canvas.js",
"js/render/controlbox.js",
"js/render/free-tool.js",
"js/render/screen.js",
"js/render/should-workaround-chromium.js",
"js/render/text-tool.js",
"js/render/textbox.js",
"js/state/atom.js",
"main.css",
"manifest.json",
"service-worker.js",
				])
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    url.hash = "";
    url.search = "";
    event.respondWith(caches.match(url.toString()));
});
