const SHOULD_RUN_OFFLINE_KEY = "shouldRunOffline";
const IS_INSTALLED_KEY = "isInstalled";
const TRUE_VAL = "true";

function isInstalled() {
		const wasInstalled = localStorage.getItem(IS_INSTALLED_KEY) == TRUE_VAL;
		if (wasInstalled) {
				return true;
		}

		
		const detectedInstalled =
					window.matchMedia('(display-mode: minimal-ui)').matches
					|| window.matchMedia('(display-mode: standalone)').matches
					|| document.referrer.startsWith('android-app://')
					|| navigator.standalone;

		if (detectedInstalled) {
				localStorage.setItem(IS_INSTALLED_KEY, TRUE_VAL);
		}

		return detectedInstalled;
}

function shouldInstall() {
		const prefersOffline = localStorage.getItem(SHOULD_RUN_OFFLINE_KEY) == "offline";
		if (prefersOffline) {
				return true;
		}
		if (isInstalled()) {
				return true;
		}
		if (navigator.doNotTrack) {
				console.log("do not track detected; offline mode not installed");
				return false;
		}
		return true;
}

async function installServiceWorker() {
		if (!shouldInstall()) {
				console.log("did not install");
				return;
		}
		try {
				const registration = await navigator.serviceWorker.register("service-worker.js", {
						scope: "/",
				});

				if (registration.installing) {
						console.log("Service worker installing");
				} else if (registration.waiting) {
						console.log("Service worker installed");
				} else if (registration.active) {
						console.log("Service worker active");
				}
		} catch (error) {
				console.error(`Registration failed with ${error}`);
		}
}

async function removeServiceWorker() {
		const readyPromise = navigator.serviceWorker.ready;
		if (readyPromise == null) {
				return;
		}
		const serviceWorker = await readyPromise;
		if (serviceWorker == null) {
				return;
		}
		serviceWorker.unregister();
}

export async function registerServiceWorker() {
		const urlParams = new URLSearchParams(window.location.search);
		
		if ("serviceWorker" in navigator) {
				if (urlParams.get('no-sw') == null) {
						await installServiceWorker();
				} else {
						await removeServiceWorker();
				}
		}
}
