import {DragListener} from "../events/drag.js";
import {Point} from "../math/point.js";

export class Screen {
		constructor(canvas, snapRadius, clickRadius){
				this.snapRadius = snapRadius;
				this.clickRadius = clickRadius;
				this.canvas = canvas;
				this.dragListen = new DragListener(canvas.canvas, canvas.scale, this.snapRadius, this);
				this.dragListen.bind();
				this.downpoint = null;
				this.dragForwardListener = null;
				this.startedWithFocus = false;
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
				this.startedWithFocus = false;
				if (this.focus != null) {
						this.dragForwardListener = this.focus.getListenerForPoint(this.canvas, pt, this.clickRadius * canvas.scale);
				}
				if (this.dragForwardListener != null) {
						this.dragForwardListener.ondown(pt);
						return;
				}
				
				const box = this.findClickedTextbox(pt) || this.focus;
				this.startedWithFocus = this.focus == box;
				if (box) {
						this.canvas.repaint();
						box.drawControls(this.canvas);
						this.downpoint = box.point();
						this.focus = box;
				}
		}
		onmove(pt, moveOffset) {
				if (this.dragForwardListener != null) {
						this.dragForwardListener.onmove(pt, moveOffset);
						return;
				}

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
				if (this.dragForwardListener != null) {
						this.dragForwardListener.onup(pt, moveOffset, moved);
						this.dragForwardListener = null;
						return;
				}

				if(moved){
						if(this.focus) {
								this.focus.moveTo(this.downpoint.add(moveOffset));
						}
				} else {
						if (this.focus != null && this.startedWithFocus) {
								this.focus = null;
								this.startedWithFocus = false;
						}
				}
				this.canvas.repaint();

				
				if (this.focus != null) {
						this.focus.drawControls(this.canvas);
				}
		}

}
