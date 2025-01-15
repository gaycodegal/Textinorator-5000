import {colors} from "./colors.js";

function selectColor(focusedColorAtom, color, button, selected) {
		focusedColorAtom.set(color);
		if (selected.selected != null) {
				selected.selected.classList.remove("selected");
		}
		selected.selected = button;
		selected.selected.classList.add("selected");
}

function makeColorButton(focusedColorAtom, parent, color, selected) {
		const button = document.createElement("button");
		const bubble = document.createElement("div");
		button.appendChild(bubble);
		button.classList.add("color-option");
		bubble.style.background = color.fill;
		button.addEventListener('click', (e)=>selectColor(focusedColorAtom, color, e.target, selected));
		parent.appendChild(button);
		return button;
}


export function setUpColorChooser(focusedColorAtom, controls) {
		const selected = {selected: null};
		const parent = controls.getElementsByClassName("color-choice")[0];
		colors.map(color=>makeColorButton(focusedColorAtom, parent, color, selected));
}
