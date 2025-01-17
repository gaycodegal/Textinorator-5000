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
						//
"css/colors.css",
"css/tool.css",
"css/apply-colors.css",
"service-worker.js",
"html/license.html",
"js/math/box.js",
"js/math/point.js",
"js/state/atom.js",
"js/main.js",
"js/events/drag.js",
"js/logic/colors.js",
"js/logic/set-background.js",
"js/logic/text-tool-set-up.js",
"js/logic/set-up-color-controls.js",
"js/logic/set-up-font-events.js",
"js/logic/color-chooser.js",
"js/dark-mode.js",
"js/init-module.js",
"js/render/textbox.js",
"js/render/text-tool.js",
"js/render/canvas.js",
"js/render/controlbox.js",
"js/render/should-workaround-chromium.js",
"js/render/boxdraghandler.js",
"js/render/screen.js",
"index.html",
"README.md",
"LICENSE.txt",
"main.css",
"css/colors.css",
"css/tool.css",
"css/apply-colors.css",
"html/license.html",
"js/math/box.js",
"js/math/point.js",
"js/state/atom.js",
"js/main.js",
"js/events/drag.js",
"js/logic/colors.js",
"js/logic/set-background.js",
"js/logic/text-tool-set-up.js",
"js/logic/set-up-color-controls.js",
"js/logic/set-up-font-events.js",
"js/logic/color-chooser.js",
"js/dark-mode.js",
"js/init-module.js",
"js/render/textbox.js",
"js/render/text-tool.js",
"js/render/canvas.js",
"js/render/controlbox.js",
"js/render/should-workaround-chromium.js",
"js/render/boxdraghandler.js",
"js/render/screen.js",
"js/math/box.js",
"js/math/point.js",
"js/state/atom.js",
"js/events/drag.js",
"js/logic/colors.js",
"js/logic/set-background.js",
"js/logic/text-tool-set-up.js",
"js/logic/set-up-color-controls.js",
"js/logic/set-up-font-events.js",
"js/logic/color-chooser.js",
"js/render/textbox.js",
"js/render/text-tool.js",
"js/render/canvas.js",
"js/render/controlbox.js",
"js/render/should-workaround-chromium.js",
"js/render/boxdraghandler.js",
"js/render/screen.js",
				])
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    url.hash = "";
    url.search = "";
    event.respondWith(caches.match(url.toString()));
});
