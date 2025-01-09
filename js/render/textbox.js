import {BoxDragHandler} from "./boxdraghandler.js";
import {drawControls} from "./controlbox.js";
import {Point} from "../math/point.js";
import {Box} from "../math/box.js";

export class TextBox {
    constructor(ctx, text, x, y, lineWidth, fontSize, fontFamily, fg = "black", bg = "white"){
				this.fontSize = fontSize;
				this.fontFamily = fontFamily;
				this.x = x;
				this.y = y;
				this.lineWidth = lineWidth;
				this.fg = fg;
				this.bg = bg;
				this.selected = true;
				this.retext(ctx, text);
    }

		moveTo(point) {
				this.x = point.x;
				this.y = point.y;
				this.box.x = point.x;
				this.box.y = point.y;
		}

		point() {
				return new Point(this.box.x, this.box.y);
		}

		toBox() {
				return new Box(this.box.x, this.box.y, this.box.width, this.box.height);
		}

		retext(ctx, text) {
				this.text = text;
				this.box = this.calculateSize(ctx, this.text, this.x, this.y, this.lineWidth);
		}

		rebox(canvas, box) {
				this.x = Math.floor(box.x);
				this.y = Math.floor(box.y);
				const thisTrueWidth = this.box.width - this.lineWidth;
				const nextTrueWidth = box.width - this.lineWidth;
				this.fontSize = this.fontSize * nextTrueWidth / thisTrueWidth;
				this.box = this.calculateSize(canvas.ctx, this.text, this.x, this.y, this.lineWidth);
		}
		
		points() {
				return [new Point(this.box.x, this.box.y),
								new Point(this.box.x + this.box.width, this.box.y),
								new Point(this.box.x + this.box.width,
													this.box.y + this.box.height),
								new Point(this.box.x, this.box.y + this.box.height)];
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
				ctx.font = this.font;
				ctx.lineWidth=this.lineWidth;
				ctx.fillStyle=this.fg;
				ctx.strokeStyle=this.bg;
				ctx.strokeText(this.text, box.x + box.offsetX, box.y + box.offsetY);
				ctx.fillText(this.text, box.x + box.offsetX, box.y + box.offsetY);
		}

		getListenerForPoint (canvas, point, clickRadius) {
				const pointMap = this.points().map((p, i)=>({index: i, point: p, dist:p.dist(point)}));
				pointMap[0].top = true;
				pointMap[1].top = true;
				pointMap[2].top = false;
				pointMap[3].top = false;
				pointMap[0].left = true;
				pointMap[1].left = false;
				pointMap[2].left = false;
				pointMap[3].left = true;
				const originalPoints = pointMap.slice();
				pointMap.sort(Point.sortDistsMinFirst);
				var closest = pointMap[0];
				if (closest.dist > clickRadius) {
						return null;
				}
				const furthest = originalPoints[(closest.index + 2) % 4];
				return new BoxDragHandler(canvas, this, closest, furthest);
		}
}
