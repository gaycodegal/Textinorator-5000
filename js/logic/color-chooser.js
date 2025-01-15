import {colors} from "./colors.js";

function selectColor(screen, parent, color, button, selected) {
		screen.state.focusedColor.set(color);
		if (selected.selected != null) {
				selected.selected.classList.remove("selected");
		}
		selected.selected = button;
		selected.selected.classList.add("selected");
}

function makeColorButton(screen, parent, color, selected) {
		const button = document.createElement("button");
		const bubble = document.createElement("div");
		button.appendChild(bubble);
		button.classList.add("color-option");
		bubble.style.background = color.fill;
		button.addEventListener('click', (e)=>selectColor(screen, parent, color, e.target, selected));
		parent.appendChild(button);
		return button;
}


export function setUpColorChooser(screen, controls) {
		const selected = {selected: null};
		const parent = controls.getElementsByClassName("color-choice")[0];
		colors.map(color=>makeColorButton(screen, parent, color, selected));
}


export function setUpFontColorEvents(screen, controls) {
		const fontColorFillInput = controls.getElementsByClassName("font-color-fill")[0];
		const fontColorStrokeInput = controls.getElementsByClassName("font-color-stroke")[0];
		const fontStrokeStyleInputs = [
				controls.getElementsByClassName("font-stroke-none")[0]
				];
		function doSetFontColor() {
				let color = {fill: fontColorFillInput.value};
				
		}
		screen.state.focusedFontName.bindListener((name)=>{
				const isFocused = document.activeElement == fontNameSetter;
				if (!isFocused && fontNameSetter.value != name) {
						fontNameSetter.value = name;
						fontNameSetter.blur();
				}
		});
		fontNameSetter.addEventListener("change", doSetFontName);
}
