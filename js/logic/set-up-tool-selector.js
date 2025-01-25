
function show(controls, toShowSelector) {
		const toShow = controls.getElementsByClassName(toShowSelector);
		for(let i = 0; i < toShow.length; ++i) {
				toShow[i].style.display = "";
		}
}

function hide(controls, toHideSelector) {
		const toHide = controls.getElementsByClassName(toHideSelector);
		for(let i = 0; i < toHide.length; ++i) {
				toHide[i].style.display = "none";
		}
}

function unselectButton(controls, toHideSelector) {
		const toHideButton = controls.getElementsByClassName("tool-button-selected");
		if (toHideButton.length >= 1) {
				toHideButton[0].classList.remove("tool-button-selected");
		}
}


export function setUpToolSelectors(screen, controls) {
		const tools = [{name: "text"}, {name: "draw"}, {name: "undo", noSelect: true}];

		tools.forEach(toolOptions=>{
				const tool = toolOptions.name;
				const button = controls.getElementsByClassName(`select-${tool}-tool-button`)[0];
				
				button.addEventListener('click', function download() {
						const toShow = controls.getElementsByClassName(`${tool}-tool-settings`)[0];

						if (!toolOptions.noSelect) {
								hide(controls, "tool-settings-instance");
								unselectButton(controls, "tool-button-selected");
								button.classList.add("tool-button-selected");
								show(controls, `${tool}-tool-settings`);
						}

						if (tool == "draw") {
								show(controls, "select-undo-tool-button");
						} else if (tool == "text") {
								hide(controls, "select-undo-tool-button");
						}
						screen.setActiveTool(tool);
				});
		});
}
