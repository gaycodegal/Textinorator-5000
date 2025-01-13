import {DragListener} from "../events/drag.js";
import {Point} from "../math/point.js";
import {atom} from "../state/atom.js";

export class Screen {
		constructor(canvas, snapRadius, clickRadius){
				// live state
				this.focusedText = atom("");
				this.focusedText.bindListener(this.setFocusedText.bind(this));

				
				this.canvas = canvas;
				this.snapRadius = snapRadius;
				this.clickRadius = clickRadius;
				this.dragListen = new DragListener(canvas.canvas, canvas.scale, this.snapRadius, this);
				this.dragListen.bind();
				this.downpoint = null;
				this.dragForwardListener = null;
				this.startedWithFocus = false;
				this.lastPoint = null;
		}

		deleteFocusedText() {
				this.deleteTextBox(this.focus);
		}
		
		deleteTextBox(box) {
				const indexToRemove = this.canvas.textBoxes.indexOf(box);
				if (indexToRemove == -1) {
						return;
				}
				this.canvas.textBoxes.splice(indexToRemove, 1);
				if (this.focus == box) {
						this.focus = null;
				}
				this.canvas.repaint();
				if (this.focus != null) {
						this.focus.drawControls(this.canvas);
				}
		}

		setFocusedTextFromSetter() {
				this.setFocusedText(this.textSetter.value);
		}

		setFocusedText(text) {
				if (this.focus != null) {
						if (this.focus.text == text) {
								return;
						}
						this.focus.retext(this.canvas.ctx, text);
						this.canvas.repaint();
						this.focus.drawControls(this.canvas);
				} else if (this.lastPoint != null && text != "") {
						this.focus = canvas.strokeText(
								text,
								this.lastPoint.x, this.lastPoint.y,
								10, 100,
								"sans-serif", "white", "black");
				}
		}

		getFocusedText() {
				if (this.focus != null) {
						return this.focus.text;
				} else {
						return "";
				}
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
				if (this.focus != null && this.focus.text.trim() == "") {
						this.deleteFocusedText();
						return true; // we're doing work; not an idle drag
				}

				if (this.focus != null) {
						this.dragForwardListener = this.focus.getListenerForPoint(this.canvas, pt, this.clickRadius * canvas.scale.get());
				}
				if (this.dragForwardListener != null) {
						this.dragForwardListener.ondown(pt);
						return true; // we're doing work; not an idle drag
				}
				
				const box = this.findClickedTextbox(pt) || this.focus;
				this.startedWithFocus = this.focus == box;
				if (box) {
						this.canvas.repaint();
						box.drawControls(this.canvas);
						this.downpoint = box.point();
						this.focus = box;
						return true; // we're doing work; not an idle drag
				}

				return false; // we didn't click on anything
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

		onup(pt, moveOffset, moved) {
				const lastFocus = this.focus;
				this.lastPoint = pt;
				if (this.dragForwardListener != null) {
						this.dragForwardListener.onup(pt, moveOffset, moved);
						this.dragForwardListener = null;
						return;
				}
				if (lastFocus != null && lastFocus.text.trim() == "") {
						this.deleteTextBox(lastFocus);
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
				const focusedTextValue = this.getFocusedText();
				this.focusedText.set(focusedTextValue);
		}

}
