import * as DrawingCanvas from "./render/canvas.js";
import {Screen} from "./render/screen.js";
import {setUpBackgroundSetter} from "./logic/set-background.js";

export function main() {
		const canvas = DrawingCanvas.createMainCanvas(document.getElementById("container"));
		window.canvas = canvas;
		//const listen = new Listener(canvas);
		console.log("hi");
		canvas.clear();
		canvas.strokeText("fish flakes 😊 물고기 사료", 0,0,10, 100, "sans-serif", "white", "black");
		canvas.strokeText("😊🐟", 100,200,10, 100, "sans-serif", "white", "black");
		const screen = new Screen(canvas, 30, 30);
		window.screen = screen;

		setUpBackgroundSetter(screen, document.getElementById("controls"));
		/*const dragListen = new DragListener(canvas.canvas, canvas.scale, 30, listen);
		dragListen.bind();*/
}
