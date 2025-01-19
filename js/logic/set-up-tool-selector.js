export function setUpToolSelectors(screen, controls) {
		const tools = ["text", "draw"];

		tools.forEach(tool=>{
				const button = controls.getElementsByClassName(`select-${tool}-tool-button`)[0];
				
				button.addEventListener('click', function download() {
						const toHide = controls.getElementsByClassName("tool-settings-instance");
						const toHideButton = controls.getElementsByClassName("tool-button-selected");
						const toShow = controls.getElementsByClassName(`${tool}-tool-settings`)[0];
						for(let i = 0; i < toHide.length; ++i) {
								toHide[i].style.display = "none";
						}
						if (toHideButton.length >= 1) {
								toHideButton[0].classList.remove("tool-button-selected");
						}
						button.classList.add("tool-button-selected");
						toShow.style.display = "";
						
						screen.setActiveTool(tool);
				});
		});
}
