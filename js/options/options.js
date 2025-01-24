let swModule = import("../service-worker/register-sw.js");


async function setUpOptions() {
		swModule = await swModule;
		const optionsContainer = document.getElementById("options-container");
		setUpOfflneEvent(optionsContainer);
}


function setUpOfflneEvent(optionsContainer) {
		const runOfflineInput = optionsContainer.getElementsByClassName("run-offline")[0];

		if (swModule.isInstalledDetect()) {
				const runOfflineContainer = optionsContainer.getElementsByClassName("run-offline-container")[0];
				runOfflineContainer.style.display = "none";
				return;
		}

		
		runOfflineInput.checked = swModule.getShouldInstallPref();
		function doSetRunOffline() {
				let value = runOfflineInput.checked;
				swModule.setShouldInstallPref(value, "../");
		}
		runOfflineInput.addEventListener("change", doSetRunOffline);
}

if (document.readyState === "complete") {
		setUpOptions();
} else {
		window.addEventListener("load", setUpOptions);
}
