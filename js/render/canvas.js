import {TextBox} from "./textbox.js";

window.IS_HIGH_DEF = ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));

export class DrawingCanvas {
    constructor(){
				this.canvas = document.createElement("canvas");
				this.ctx = this.canvas.getContext("2d");
				this.textBoxes = [];
    }

		resizeToScreen() {
				this.resize(window.innerWidth, window.innerHeight);
		}

		resizeToElement(element) {
				this.resize(element.clientWidth, element.clientHeight - 1);
		}

		resize(w, h) {
				if (window.IS_HIGH_DEF) {
						this.canvas.width = w * 2;
						this.canvas.height = h * 2;
				} else {
						this.canvas.width = w;
						this.canvas.height = h;
				}
				this.canvas.style.width = `${w}px`;
				this.canvas.style.height = `${h}px`;
				this.width = w;
				this.height = h;
				this.smoothIt();
				this.ctx.lineCap = "round";
				this.ctx.lineJoin = "round";
				if (window.IS_HIGH_DEF) {
						this.scale = 2;
						// can't use ctx.scale and have emoji work :(
						//this.ctx.scale(2,2);
				}
		}

		calculateTextbox(text, x, y, lineWidth, fontSize, fontFamily, fg, bg) {
				return new TextBox(this.ctx, text, x, y, lineWidth, fontSize, fontFamily, fg, bg);
		}

		strokeText(text, x, y, lineWidth, fontSize, fontFamily, fg, bg) {
				const textbox = new TextBox(this.ctx, text, x, y, lineWidth, fontSize, fontFamily, fg, bg);
				textbox.draw(this);
				textbox.drawControls(this);
				this.textBoxes.push(textbox);
		}

		clear() {
				this.textBoxes = [];
				this.ctx.clearRect(0,0, this.width*this.scale, this.height*this.scale);
		}

		smoothIt() {
				const ctx = this.ctx;
				const smooth = true;
				ctx.imageSmoothingEnabled = smooth;
				ctx.mozImageSmoothingEnabled = smooth;
				ctx.webkitImageSmoothingEnabled = smooth;
    }
}





export function createMainCanvas(targetElement) {
		const canvas = new DrawingCanvas();
		targetElement.appendChild(canvas.canvas);
		canvas.resizeToElement(targetElement);
		return canvas;
}
