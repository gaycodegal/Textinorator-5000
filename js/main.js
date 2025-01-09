import * as DrawingCanvas from "./render/canvas.js";

export function main() {
		window.canvas = DrawingCanvas.createMainCanvas(document.body);
		console.log("hi");
		canvas.clear();
		canvas.strokeText("fish flakes 😊 물고기 사료", 0,0,10, 100, "sans-serif", "yellow", "green");
}
