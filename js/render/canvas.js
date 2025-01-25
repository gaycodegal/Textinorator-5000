import {TextBox} from "./textbox.js";
import {Point} from "../math/point.js";
import {atom} from "../state/atom.js";
import {shouldWorkaroundChromium} from "./should-workaround-chromium.js";


window.IS_HIGH_DEF = ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));

export class DrawingCanvas {
    constructor(history){
				// live state
				const state = {};
				this.state = state;
				this.shouldWorkAroundChromium = shouldWorkaroundChromium();
				state.scale = atom(1);
				state.scale.bindListener(this.changeScale.bind(this));
				state.size = atom({width: 1, height: 1});
				state.size.bindListener(this.changeSize.bind(this));
				state.shouldExpandImageToScreenWidth = atom(true);


				this.history = history;
				this.origin = new Point(0,0);
				
				this.canvas = document.createElement("canvas");
				this.canvas.classList.add("render-canvas");
				this.ctx = this.canvas.getContext("2d");
				
				this.tcanvas = document.createElement("canvas");
				this.tcanvas.classList.add("render-canvas");
				this.tctx = this.tcanvas.getContext("2d");

				this.bg_canvas = document.createElement("canvas");
				this.bg_canvas.classList.add("render-canvas");
				this.bg_ctx = this.bg_canvas.getContext("2d");

				this.drawables = [];
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
				this.tcanvas.width = width;
				this.tcanvas.height = height;
				this.bg_canvas.width = width;
				this.bg_canvas.height = height;
				this.smoothIt(true);
				this.ctx.lineCap = "round";
				this.ctx.lineJoin = "round";
				this.bg_ctx.lineCap = "round";
				this.bg_ctx.lineJoin = "round";
				this.tctx.lineCap = "round";
				this.tctx.lineJoin = "round";
				this.state.scale.notifyListeners();
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

		clearTemp() {
				const {width, height} = this.state.size.get();
				this.tctx.clearRect(0,0, width, height);
		}

		clear() {
				const {width, height} = this.state.size.get();
				this.ctx.clearRect(0,0, width, height);
				this.ctx.drawImage(this.bg_canvas, 0, 0);
		}

		repaint() {
				this.clear();
				this.ctx.drawImage(this.tcanvas, 0, 0);
				this.drawables.forEach(drawable=>drawable.draw(this));
		}

		wipe() {
				this.drawables = [];
				this.clear();
		}

		smoothIt(smooth) {
				const ctx = this.ctx;
				ctx.imageSmoothingEnabled = smooth;
				ctx.mozImageSmoothingEnabled = smooth;
				ctx.webkitImageSmoothingEnabled = smooth;
				const tctx = this.tctx;
				tctx.imageSmoothingEnabled = smooth;
				tctx.mozImageSmoothingEnabled = smooth;
				tctx.webkitImageSmoothingEnabled = smooth;
				const bg_ctx = this.bg_ctx;
				bg_ctx.imageSmoothingEnabled = smooth;
				bg_ctx.mozImageSmoothingEnabled = smooth;
				bg_ctx.webkitImageSmoothingEnabled = smooth;
    }

		setBackground(img) {
				this.history.wipe();
				this.background = img;
				this.resize(img.width, img.height);
				console.log(img.width, img.height)
				this.bg_ctx.drawImage(img, 0, 0);
				if (this.state.shouldExpandImageToScreenWidth.get()) {
						this.state.scale.set(determineScale(img.width, window.innerWidth));
				} else {
						this.state.scale.notifyListeners();
				}
		}

		restrokeBackground() {
				const {width, height} = this.state.size.get();
				this.bg_ctx.clearRect(0,0, width, height);
				if (this.background) {
						this.bg_ctx.drawImage(this.background, 0, 0);
				}
				this.history.forEach(drawable=>drawable.draw(this, this.bg_ctx));
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
