import {TextBox} from "./textbox.js";

window.IS_HIGH_DEF = ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));

export class DrawingCanvas {
    constructor(){
				this.canvas = document.createElement("canvas");
				this.ctx = this.canvas.getContext("2d");
				this.textBoxes = [];
				this.background = null;
    }

		resizeToScreen() {
				if (window.IS_HIGH_DEF) {
						this.scale = 2;
						// can't use ctx.scale and have emoji work :(
						//this.ctx.scale(2,2);
				}
				this.resize(window.innerWidth * this.scale, window.innerHeight * this.scale);
		}

		resizeToElement(element) {
				if (window.IS_HIGH_DEF) {
						this.scale = 2;
						// can't use ctx.scale and have emoji work :(
						//this.ctx.scale(2,2);
				}

				this.resize(element.clientWidth * this.scale, (element.clientHeight - 1) * this.scale);
		}

		resize(w, h) {
				if (window.IS_HIGH_DEF) {
						this.scale = 2;
						// can't use ctx.scale and have emoji work :(
						//this.ctx.scale(2,2);
				}
				if (window.IS_HIGH_DEF) {
						this.canvas.width = w;
						this.canvas.height = h;
				} else {
						this.canvas.width = w;
						this.canvas.height = h;
				}
				this.canvas.style.width = `${w/this.scale}px`;
				this.canvas.style.height = `${h/this.scale}px`;
				this.width = w;
				this.height = h;
				this.smoothIt(true);
				this.ctx.lineCap = "round";
				this.ctx.lineJoin = "round";
				this.repaint();
		}

		calculateTextbox(text, x, y, lineWidth, fontSize, fontFamily, fg, bg) {
				return new TextBox(this.ctx, text, x, y, lineWidth, fontSize, fontFamily, fg, bg);
		}

		strokeText(text, x, y, lineWidth, fontSize, fontFamily, fg, bg) {
				const textbox = new TextBox(this.ctx, text, x, y, lineWidth, fontSize, fontFamily, fg, bg);
				textbox.draw(this);
				this.textBoxes.push(textbox);
		}

		clear() {
				this.ctx.clearRect(0,0, this.width, this.height);
				if(this.background != null) {
						this.ctx.drawImage(this.background, 0, 0)
				}
		}

		repaint() {
				this.clear();
				this.textBoxes.forEach(box=>box.draw(this));
		}

		wipe() {
				this.textBoxes = [];
				this.clear();
		}

		smoothIt(smooth) {
				const ctx = this.ctx;
				ctx.imageSmoothingEnabled = smooth;
				ctx.mozImageSmoothingEnabled = smooth;
				ctx.webkitImageSmoothingEnabled = smooth;
    }

		setBackground(img) {
				this.background = img;
				this.resize(img.width, img.height);
		}
}





export function createMainCanvas(targetElement) {
		const canvas = new DrawingCanvas();
		targetElement.appendChild(canvas.canvas);
		canvas.resizeToElement(targetElement);
		return canvas;
}
