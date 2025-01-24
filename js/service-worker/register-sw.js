const SHOULD_RUN_OFFLINE_KEY = "shouldRunOffline";
const IS_INSTALLED_KEY = "isInstalled";
const TRUE_VAL = "true";
const FALSE_VAL = "false";

export function isInstalledDetect() {
		return window.matchMedia('(display-mode: minimal-ui)').matches
					|| window.matchMedia('(display-mode: standalone)').matches
					|| document.referrer.startsWith('android-app://')
					|| navigator.standalone;
}

function boolOf(val) {
		return val ? TRUE_VAL : FALSE_VAL;
}

export function getShouldInstallPref() {
		return localStorage.getItem(SHOULD_RUN_OFFLINE_KEY) == TRUE_VAL
				|| localStorage.getItem(IS_INSTALLED_KEY) == TRUE_VAL;
}

export function setShouldInstallPref(offline, path = "") {
		localStorage.setItem(SHOULD_RUN_OFFLINE_KEY, boolOf(offline));
		if (offline) {
				installServiceWorker(path);
		} else {
				removeServiceWorker();
		}
}

function isInstalled() {
		const wasInstalled = localStorage.getItem(IS_INSTALLED_KEY) == TRUE_VAL;
		if (wasInstalled) {
				return true;
		}

		
		const detectedInstalled = isInstalledDetect();
					

		if (detectedInstalled) {
				localStorage.setItem(IS_INSTALLED_KEY, boolOf(true));
		}

		return detectedInstalled;
}



function shouldInstall() {
		const prefersOffline = localStorage.getItem(SHOULD_RUN_OFFLINE_KEY) == TRUE_VAL;
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

async function installServiceWorker(path = "") {
		if (!shouldInstall()) {
				return;
		}
		try {
				const registration = await navigator.serviceWorker.register(path + "service-worker.js", {
						scope: "/",
				});

				if (registration.installing) {
						console.log("Service worker installing");
						localStorage.setItem(IS_INSTALLED_KEY, boolOf(true));
				} else if (registration.waiting) {
						console.log("Service worker installed");
						localStorage.setItem(IS_INSTALLED_KEY, boolOf(true));
				} else if (registration.active) {
						console.log("Service worker active");
						localStorage.setItem(IS_INSTALLED_KEY, boolOf(true));
				}
		} catch (error) {
				console.error(`Registration failed with ${error}`);
		}
}

async function removeServiceWorker() {
		localStorage.setItem(IS_INSTALLED_KEY, boolOf(false));
		
		const readyPromise = navigator.serviceWorker.ready;
		if (readyPromise == null) {
				return;
		}
		const serviceWorker = await readyPromise;
		if (serviceWorker == null) {
				return;
		}
		console.log("removed service worker");
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
