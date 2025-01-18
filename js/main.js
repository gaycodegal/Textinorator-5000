import * as DrawingCanvas from "./render/canvas.js";
import {Screen} from "./render/screen.js";
import {setUpBackgroundSetter, setUpDownloadButton} from "./logic/set-background.js";
import {setUpTextToolEvents} from "./logic/text-tool-set-up.js";
import {setUpDrawToolEvents} from "./logic/set-up-draw-tool.js";
import {setUpToolSelectors} from "./logic/set-up-tool-selector.js";
import {setUpFocusEvents} from "./logic/set-up-focus-events.js";

export function main() {
		const canvas = DrawingCanvas.createMainCanvas(document.getElementById("container"));
		window.canvas = canvas;

		canvas.clear();


		const screen = new Screen(
				canvas,
				/* snap deadzone */ 5,
				/* handle drag click zone */ 30);
		window.screen = screen;

		const toolControlsElement = document.getElementById("tool-controls");		
		const textTool = screen.tools.text;
		setUpFocusEvents(screen.events.focus);
		setUpDrawToolEvents(screen.tools.draw, toolControlsElement);
		setUpTextToolEvents(textTool, toolControlsElement);
		setUpToolSelectors(screen, toolControlsElement);
		const generalControlsElement = document.getElementById("general-controls");
		setUpBackgroundSetter(screen, generalControlsElement);
		setUpDownloadButton(screen, generalControlsElement);

		screen.tools.text.strokeText("text here 😊", 0,0);

		//scroll to expose image controls
		window.scroll(0, 100);
}
