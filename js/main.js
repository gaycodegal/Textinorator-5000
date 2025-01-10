import * as DrawingCanvas from "./render/canvas.js";
import {Screen} from "./render/screen.js";
import {setUpBackgroundSetter, setUpDeleteTextEvent, setUpDownloadButton} from "./logic/set-background.js";

export function main() {
		const canvas = DrawingCanvas.createMainCanvas(document.getElementById("container"));
		window.canvas = canvas;
		//const listen = new Listener(canvas);
		canvas.clear();
		canvas.strokeText("text here 😊", 0,0,10, 100, "sans-serif", "white", "black");
		const generalControlsElement = document.getElementById("general-controls");		
		const toolControlsElement = document.getElementById("tool-controls");		
		const textSetter = toolControlsElement.getElementsByClassName("text-setter")[0];
		const screen = new Screen(canvas, 30, 30, textSetter);
		window.screen = screen;
		setUpDeleteTextEvent(screen, toolControlsElement);
		setUpBackgroundSetter(screen, generalControlsElement);
		setUpDownloadButton(screen, generalControlsElement);
		/*const dragListen = new DragListener(canvas.canvas, canvas.scale, 30, listen);
			dragListen.bind();*/

		//scroll to expose image controls
		window.scroll(0, 100);
}
