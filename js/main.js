import * as DrawingCanvas from "./render/canvas.js";

export function main() {
		window.canvas = DrawingCanvas.createMainCanvas(document.body);
		console.log("hi");
}
