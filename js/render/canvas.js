import {TextBox} from "./textbox.js";
import {atom} from "../state/atom.js";
import {shouldWorkaroundChromium} from "./should-workaround-chromium.js";


window.IS_HIGH_DEF = ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));

export class DrawingCanvas {
    constructor(){
				// live state
				const state = {};
				this.state = state;
				this.shouldWorkAroundChromium = shouldWorkaroundChromium();
				state.scale = atom(1);
				state.scale.bindListener(this.changeScale.bind(this));
				state.size = atom({width: 1, height: 1});
				state.size.bindListener(this.changeSize.bind(this));
				state.shouldExpandImageToScreenWidth = atom(true);
				
				this.canvas = document.createElement("canvas");
				this.canvas.classList.add("render-canvas");
				this.ctx = this.canvas.getContext("2d");
				this.textBoxes = [];
				this.background = null;
    }

		setModeVertical(vertical = true) {
				if (vertical) {
						this.canvas.style["writing-mode"] = "vertical-rl";
						this.canvas.style["text-orientation"] = "upright";
				} else {
						this.canvas.style["writing-mode"] = "";
						this.canvas.style["text-orientation"] = "";
				}
		}

		changeScale(scale){
				const {width, height} = this.state.size.get();
				this.canvas.style.width = `${width/scale}px`;
				this.canvas.style.height = `${height/scale}px`;
		}

		changeSize({width, height}) {
				this.canvas.width = width;
				this.canvas.height = height;
				this.state.scale.notifyListeners();
				this.smoothIt(true);
				this.ctx.lineCap = "round";
				this.ctx.lineJoin = "round";
				this.repaint();
		} 

		resizeToScreen() {
				this.state.scale.set(window.IS_HIGH_DEF ? 2: 1, false);
				const scale = this.state.scale.get();
				this.resize(Math.floor(window.innerWidth * scale),
										Math.floor(window.innerHeight * scale - 1));
		}

		resizeToElement(element) {
				this.state.scale.set(window.IS_HIGH_DEF ? 2: 1, false);
				const scale = this.state.scale.get();
				this.resize(Math.floor(element.clientWidth * scale),
										Math.floor(element.clientHeight * scale - 1));
		}

		resize(width, height) {
				this.state.scale.set(window.IS_HIGH_DEF ? 2: 1, false);
				this.state.size.set({width, height});
		}

		calculateTextbox(text, x, y, lineWidth, fontSize, fontFamily, fg, bg) {
				return new TextBox(this, text, x, y, lineWidth, fontSize, fontFamily, fg, bg);
		}

		clear() {
				const {width, height} = this.state.size.get();
				this.ctx.clearRect(0,0, width, height);
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
				if (this.state.shouldExpandImageToScreenWidth.get()) {
						this.state.scale.set(determineScale(img.width, window.innerWidth));
				}
		}
}


function determineScale(width, maxWidth) {
		return width / maxWidth;
}



export function createMainCanvas(targetElement) {
		const canvas = new DrawingCanvas();
		const canvasParent = targetElement.getElementsByClassName("canvas-parent")[0];
		const canvasReplacementSpot = canvasParent.getElementsByClassName("canvas-spot")[0];
		canvasParent.replaceChild(canvas.canvas, canvasReplacementSpot);
		canvas.resizeToElement(targetElement);
		return canvas;
}
