import {colors} from "./colors.js";

function selectColor(focusedColorAtom, color, button, selected, processColor) {
		if (processColor) {
				color = processColor(color)
		}
		focusedColorAtom.set(color);
		if (selected.selected != null) {
				selected.selected.classList.remove("selected");
		}
		selected.selected = button;
		selected.selected.classList.add("selected");
}

function makeColorButton(focusedColorAtom, parent, color, selected, processColor) {
		const button = document.createElement("button");
		const bubble = document.createElement("div");
		button.appendChild(bubble);
		button.classList.add("color-option");
		bubble.style.background = color.fill;
		button.addEventListener('click', (e)=>selectColor(focusedColorAtom, color, e.target, selected, processColor));
		parent.appendChild(button);
		return button;
}


export function setUpColorChooser(focusedColorAtom, controls, palette = null, processColor = null) {
		const selected = {selected: null};
		if (palette == null) {
				palette = colors;
		}
		const parent = controls.getElementsByClassName("color-choice")[0];
		palette.map(color=>makeColorButton(focusedColorAtom, parent, color, selected, processColor));
}
