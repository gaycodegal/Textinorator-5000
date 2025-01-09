import * as DrawingCanvas from "./render/canvas.js";
import {Screen} from "./render/screen.js";
function drawRectPoint(canvas, x, y) {
		const scaled = canvas.scale * 2;
		canvas.ctx.fillRect(x-scaled, y-scaled, scaled*2,scaled*2);
}

class Listener{
		constructor(canvas){
				this.canvas = canvas;
		}
		ondown(pt) {
				this.canvas.ctx.fillStyle = "red";
				drawRectPoint(this.canvas, pt.x, pt.y);
		}
		onmove(pt) {
				this.canvas.ctx.fillStyle = "yellow";
				drawRectPoint(this.canvas, pt.x, pt.y);
		}
		onup(pt, moved) {
				if(moved){
						this.canvas.ctx.fillStyle = "blue";
						drawRectPoint(this.canvas, pt.x, pt.y);
				} else {
						this.canvas.ctx.fillStyle = "green";
						drawRectPoint(this.canvas, pt.x, pt.y);
				}
		}
}

export function main() {
		const canvas = DrawingCanvas.createMainCanvas(document.body);
		window.canvas = canvas;
		//const listen = new Listener(canvas);
		console.log("hi");
		canvas.clear();
		canvas.strokeText("fish flakes 😊 물고기 사료", 0,0,10, 100, "sans-serif", "yellow", "green");
		canvas.strokeText("😊🐟", 100,200,10, 100, "sans-serif", "yellow", "green");
		const screen = new Screen(canvas, 30);
		window.screen = screen;
		
		/*const dragListen = new DragListener(canvas.canvas, canvas.scale, 30, listen);
		dragListen.bind();*/
}
