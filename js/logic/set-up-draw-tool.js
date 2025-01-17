import {setUpColorChooser} from "./color-chooser.js";
import {drawColors, cloneColor} from "./colors.js";


export function setUpDrawLineSizeEvents(colorAtom, controls) {
		const drawSizeSetter = controls.getElementsByClassName("draw-stroke-width")[0];
		function doSetDrawSize() {
				let value = Number.parseFloat(drawSizeSetter.value);
				if (value < 3) {
						value = 3;
				}
				const nextColor = cloneColor(colorAtom.get());
				nextColor.strokeWidth = value;
				colorAtom.set(nextColor);
		}
		colorAtom.bindListener((color)=>{
				const size = color.strokeWidth;
				const isFocused = document.activeElement == drawSizeSetter;
				if (drawSizeSetter.value != size) {
						drawSizeSetter.value = size;
						if (!isFocused) {
								drawSizeSetter.blur();
						}
				}
		}, true);
		drawSizeSetter.addEventListener("change", doSetDrawSize);
		drawSizeSetter.addEventListener("keyup", doSetDrawSize);
}

export function setUpDrawToolEvents(drawTool, toolControlsElement) {
		const drawControlsElement = toolControlsElement
					.getElementsByClassName("draw-tool-settings")[0];

		setUpColorChooser(drawTool.state.color,
											drawControlsElement,
											drawColors);
		setUpDrawLineSizeEvents(drawTool.state.color,
														drawControlsElement);
}
