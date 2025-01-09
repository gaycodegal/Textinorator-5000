import {drawControls} from "./controlbox.js";

export class TextBox {
    constructor(ctx, text, x, y, lineWidth, fontSize, fontFamily, fg = "black", bg = "white"){
				this.fontSize = fontSize;
				this.fontFamily = fontFamily;
				this.text = text;
				this.x = x;
				this.y = y;
				this.lineWidth = lineWidth;
				this.fg = fg;
				this.bg = bg;
				this.selected = true;
				this.box = this.calculateSize(ctx, text, x, y, lineWidth);
    }

		select() {
				this.selected = true;
		}

		deselect() {
				this.selected = false;
		}

		isInside(x,y) {
				const box = this.box;
				return x >= box.x && x <= box.x + box.width
						&& y >= box.y && y <= box.y + box.height;
		}

		get font() {
				return `${this.fontSize}px ${this.fontFamily}`;
		}

		calculateSize(ctx, text, x, y, lineWidth) {
				ctx.font = this.font;
				const m = ctx.measureText(text);
				const width = m.actualBoundingBoxRight - m.actualBoundingBoxLeft;
				const height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent*2;
				const halfLineWidth = Math.ceil(lineWidth/2);
				// amount we want to overflow the normal text bounds to the left
				const offsetX = -m.actualBoundingBoxLeft + halfLineWidth;
				// amount we want to overflow the normal text bounds to the top
				const offsetY = -m.actualBoundingBoxDescent + height  + halfLineWidth;
				// normal width
				const boundWidth = Math.ceil(width + lineWidth);
				const boundHeight = Math.ceil(height + lineWidth);
				return {
						x,y,
						offsetX,
						offsetY,
						width: boundWidth,
						height: boundHeight,
				};
		}

		drawControls(canvas) {
				drawControls(canvas, this.box);
		}

		draw(canvas) {
				const ctx = canvas.ctx;
				const box = this.box;
				ctx.lineWidth=this.lineWidth;
				ctx.fillStyle=this.fg;
				ctx.strokeStyle=this.bg;
				ctx.strokeText(this.text, box.x + box.offsetX, box.y + box.offsetY);
				ctx.fillText(this.text, box.x + box.offsetX, box.y + box.offsetY);
		}

}
