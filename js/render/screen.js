import {DragListener} from "../events/drag.js";
import {Point} from "../math/point.js";
import {TextBox} from "./textbox.js";
import {atom} from "../state/atom.js";

export class Screen {
		constructor(canvas, snapRadius, clickRadius){
				// live state
				const state = {};
				this.state = state;
				state.focusedText = atom("");
				state.focusedText.bindListener(this.setFocusedText.bind(this));
				state.focusedColor = atom({fill:"white", stroke:"black", strokeWidth: 10});
				state.focusedColor.bindListener(this.setFocusedColor.bind(this));

				
				this.canvas = canvas;
				this.snapRadius = snapRadius;
				this.clickRadius = clickRadius;
				this.dragListen = new DragListener(canvas.canvas, canvas.state.scale, this.snapRadius, this);
				this.dragListen.bind();
				this.downpoint = null;
				this.dragForwardListener = null;
				this.startedWithFocus = false;
				this.lastPoint = null;
		}

		setFocusedColor(color) {
				if (this.focus != null) {
						this.focus.color = color;
				}
				this.repaint();
		}

		strokeText(text, x, y, lineWidth, fontSize, fontFamily, color = null) {
				if (color == null) {
						color = this.state.focusedColor.get();
				}
				const textbox = new TextBox(this.canvas.ctx, text, x, y, lineWidth, fontSize, fontFamily, color);
				textbox.draw(this.canvas);
				this.canvas.textBoxes.push(textbox);
				return textbox;
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
				this.repaint();
		}

		repaint() {
				this.canvas.repaint();
				if (this.focus != null) {
						this.focus.drawControls(this.canvas);
				}
		}

		setFocusedText(text) {
				if (this.focus != null) {
						if (this.focus.text == text) {
								return;
						}
						this.focus.retext(this.canvas.ctx, text);
						this.repaint();
				} else if (this.lastPoint != null && text != "") {
						this.focus = this.strokeText(
								text,
								Math.floor(this.lastPoint.x),
								Math.floor(this.lastPoint.y),
								10, 100,
								"sans-serif");
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
						this.dragForwardListener = this.focus.getListenerForPoint(this.canvas, pt, this.clickRadius * canvas.state.scale.get());
				}
				if (this.dragForwardListener != null) {
						this.dragForwardListener.ondown(pt);
						return true; // we're doing work; not an idle drag
				}
				
				const box = this.findClickedTextbox(pt) || this.focus;
				this.startedWithFocus = this.focus == box;
				if (box) {
						this.downpoint = box.point();
						this.focus = box;
						this.repaint();
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
						this.repaint();
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
				this.repaint();

				const focusedTextValue = this.getFocusedText();
				this.state.focusedText.set(focusedTextValue);
		}

}
