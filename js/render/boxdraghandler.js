import {drawControls} from "./controlbox.js";

export class BoxDragHandler {
		constructor(canvas, box, handle, antihandle) {
				this.handle = handle;
				this.point = handle.point;
				this.minDist = 10;
				this.canvas = canvas;
				this.box = box;
				this.originBox = this.box.toBox();
				this.antipoint = antihandle.point;
				this.originalDist = Math.max(this.antipoint.dist(this.point), this.minDist);
		}

		rebox(nextDist) {
				nextDist = Math.max(nextDist, this.minDist);
				const amountToAdd = nextDist - this.originalDist;
				const nextBox = this.originBox.clone();
				const ratioX = this.originBox.ratioX();
				const ratioY = this.originBox.ratioY();
				if (this.handle.top) {
						nextBox.y -= amountToAdd * ratioY;
						nextBox.height += amountToAdd * ratioY;
				} else {
						nextBox.height += amountToAdd * ratioY;
				}
				if (this.handle.left) {
						nextBox.x -= amountToAdd * ratioX;
						nextBox.width += amountToAdd * ratioX;
				} else {
						nextBox.width += amountToAdd * ratioX;
				}
				return nextBox;
		}
		
		ondown(pt) {
				// pass
		}
		onmove(pt, moveOffset) {
				const nextDist = this.antipoint.dist(pt);
				this.canvas.repaint();
				const nextBox = this.rebox(nextDist);
				drawControls(this.canvas, nextBox);
		}
		
		onup(pt, moveOffset, moved) {
				if (moved) {
						const nextDist = this.antipoint.dist(pt);
						const nextBox = this.rebox(nextDist);
						this.box.rebox(this.canvas, nextBox);
						this.canvas.repaint();						
						this.box.drawControls(this.canvas);
				} else {
						this.canvas.repaint();
						this.box.drawControls(this.canvas);
				}
				
		}

}
