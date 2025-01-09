import {DragListener} from "../events/drag.js";
import {Point} from "../math/point.js";

export class Screen {
		constructor(canvas, snapRadius){
				this.snapRadius = snapRadius;
				this.canvas = canvas;
				this.dragListen = new DragListener(canvas.canvas, canvas.scale, this.snapRadius, this);
				this.dragListen.bind();
				this.downpoint = null;
		}

		findClickedTextbox(point) {
				let match = null;
				this.canvas.textBoxes.reverse();
				for(let textbox of this.canvas.textBoxes) {
						if (point.inside(textbox)) {
								match = textbox;
								break;
						}
				}
				this.canvas.textBoxes.reverse();
				return match;
		}
		
		ondown(pt) {
				this.canvas.ctx.fillStyle = "red";
				const box = this.findClickedTextbox(pt);
				if (box) {
						box.drawControls(this.canvas);
						this.downpoint = box.point();
						this.focus = box;
				}
		}
		onmove(pt, moveOffset) {
				this.canvas.ctx.fillStyle = "yellow";
				if(this.focus) {
						this.focus.moveTo(this.downpoint.add(moveOffset));
						this.canvas.repaint();
						this.focus.drawControls(this.canvas);
				}
		}

		resetFocus() {
				if(this.focus) {
						this.focus.moveTo(this.downpoint);
				}
				this.focus = null;
		}
		onup(pt, moveOffset, moved) {
				if(moved){
						if(this.focus) {
								this.focus.moveTo(this.downpoint.add(moveOffset));
						}
				} else {
						this.resetFocus();
				}
				this.canvas.repaint();
				this.focus = null;
		}

}
