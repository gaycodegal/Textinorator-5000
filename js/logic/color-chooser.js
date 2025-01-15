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

function getFontStrokeElement(controls, type) {
		return {type, control: controls.getElementsByClassName(`font-stroke-${type}`)[0]};
}

function getChecked(controls){
		for (let control of controls) {
				if (control.control.checked) {
						return control.type;
				}
		}
		return "none";
}

function colorChooserClosure(
		fontStrokeStyleInputsMap,
		fontStrokeWidthInput,
		fontColorStrokeInput,
		fontColorFillInput,
		controlsOfInterest) {
		return (color)=>{
				const activeElement = document.activeElement;
				let strokeStyle = "none";
				let strokeColor = null;
				let strokeWidth = 0;
				if (color.shadow) {
						strokeStyle = "shadow";
						strokeColor = color.shadow;
						strokeWidth = color.shadowBlur;
						fontStrokeStyleInputsMap.shadow.control.checked = true;
				} else if (color.stroke) {
						strokeStyle = "stroke";
						strokeColor = color.stroke;
						strokeWidth = color.strokeWidth;
						fontStrokeStyleInputsMap.stroke.control.checked = true;
				} else {
						fontStrokeStyleInputsMap.none.control.checked = true;
				}

				if (strokeStyle != "none") {
						fontStrokeWidthInput.value = strokeWidth;
				}

				if (strokeColor != null) {
						fontColorStrokeInput.value = strokeColor;
				}
				fontColorFillInput.value = color.fill;

				controlsOfInterest.forEach(control=> {
						if(control != activeElement) {
								control.blur();
						}
				});
		}
}

function doSetFontColorClosure(
		fontStrokeStyleInputs,
		fontColorFillInput,
		fontStrokeWidthInput,
		fontColorStrokeInput,
		focusedColorAtom) {
		return () => {
				const strokeStyle = getChecked(fontStrokeStyleInputs);
				let color = {fill: fontColorFillInput.value};
				const width = Number.parseFloat(fontStrokeWidthInput.value);
				if (strokeStyle == "stroke") {
						color.strokeWidth = width;
				} else if (strokeStyle == "shadow") {
						color.shadowBlur = width;
				}

				if (strokeStyle == "shadow") {
						color.shadow = fontColorStrokeInput.value;
				} else if (strokeStyle == "stroke") {
						color.stroke = fontColorStrokeInput.value;
				}
				focusedColorAtom.set(color);
		};
}

export function setUpFontColorEvents(focusedColorAtom, controls) {
		const fontColorFillInput = controls.getElementsByClassName("font-color-fill")[0];
		const fontColorStrokeInput = controls.getElementsByClassName("font-color-stroke")[0];
		const fontStrokeWidthInput = controls.getElementsByClassName("font-stroke-width")[0];
		const fontStrokeStyleInputs = [
				getFontStrokeElement(controls, "none"),
				getFontStrokeElement(controls, "stroke"),
				getFontStrokeElement(controls, "shadow"),
		];
		const fontStrokeStyleInputsMap = {};
		fontStrokeStyleInputs.forEach(control=>{
				fontStrokeStyleInputsMap[control.type] = control;
		});

		const doSetFontColor = doSetFontColorClosure(
				fontStrokeStyleInputs,
				fontColorFillInput,
				fontStrokeWidthInput,
				fontColorStrokeInput,
				focusedColorAtom);
		
		const controlsOfInterest =
					[fontColorFillInput, fontColorStrokeInput, fontStrokeWidthInput,
					 ...fontStrokeStyleInputs.map(x=>x.control)];
		
		focusedColorAtom.bindListener(
				colorChooserClosure(
						fontStrokeStyleInputsMap,
						fontStrokeWidthInput,
						fontColorStrokeInput,
						fontColorFillInput,
						controlsOfInterest), true);
		
		controlsOfInterest.forEach(control=>{
				control.addEventListener("change", doSetFontColor);
		});
}
