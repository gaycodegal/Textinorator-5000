

async function installServiceWorker() {
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
