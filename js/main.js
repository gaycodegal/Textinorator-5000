import * as DrawingCanvas from "./render/canvas.js";
import {Screen} from "./render/screen.js";
import {setUpTextChangeEvents, setUpBackgroundSetter, setUpDeleteTextEvent, setUpDownloadButton} from "./logic/set-background.js";
import {setUpColorChooser} from "./logic/color-chooser.js";

export function main() {
		const canvas = DrawingCanvas.createMainCanvas(document.getElementById("container"));
		window.canvas = canvas;
		//const listen = new Listener(canvas);
		canvas.clear();

		const generalControlsElement = document.getElementById("general-controls");		
		const toolControlsElement = document.getElementById("tool-controls");		
		const screen = new Screen(
				canvas,
				/* snap deadzone */ 5,
				/* handle drag click zone */ 30);
		window.screen = screen;
		setUpTextChangeEvents(screen, toolControlsElement);
		setUpDeleteTextEvent(screen, toolControlsElement);
		setUpColorChooser(screen, toolControlsElement);
		setUpBackgroundSetter(screen, generalControlsElement);
		setUpDownloadButton(screen, generalControlsElement);
		/*const dragListen = new DragListener(canvas.canvas, canvas.scale, 30, listen);
			dragListen.bind();*/

		screen.strokeText("text here 😊", 0,0,10, 100, "sans-serif");
		//scroll to expose image controls
		window.scroll(0, 100);
}
