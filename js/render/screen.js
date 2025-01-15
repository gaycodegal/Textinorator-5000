import {DragListener} from "../events/drag.js";
import {Point} from "../math/point.js";
import {TextBox} from "./textbox.js";
import {atom} from "../state/atom.js";
import {colors, cloneColor} from "../logic/colors.js";

export class Screen {
		constructor(canvas, snapRadius, clickRadius){
				// live state
				const state = {};
				this.state = state;
				state.focusedText = atom("");
				state.focusedText.bindListener(this.setFocusedText.bind(this));
				state.focusedTextSize = atom(100);
				state.focusedTextSize.bindListener(this.setFocusedTextSize.bind(this));
				state.focusedFontName = atom("sans-serif");
				state.focusedFontName.bindListener(this.setFocusedFontName.bind(this));
				state.focusedColor = atom(colors[0]);
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

		setFocusedTextSize(size) {
				if (this.focus != null && size != this.focus.fontSize) {
						this.focus.setFontSize(this.canvas.ctx, size);
						this.repaint();
				}
		}

		setFocusedFontName(name) {
				if (this.focus != null && name != this.focus.fontFamily) {
						this.focus.setFontName(this.canvas.ctx, name);
						this.repaint();
				}
		}

		setFocusedColor(color) {
				if (this.focus != null) {
						this.focus.setColor(this.canvas.ctx, cloneColor(color));
				}
				this.repaint();
		}

		strokeText(text, x, y, fontSize = null, fontFamily = null, color = null) {
				if (color == null) {
						color = this.state.focusedColor.get();
				}
				if (fontSize == null) {
						fontSize = this.state.focusedTextSize.get();
				}
				if (fontFamily == null) {
						fontFamily = this.state.focusedFontName.get();
				}
				const textbox = new TextBox(this.canvas.ctx, text, x, y, fontSize, fontFamily, color);
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
						this.setFocus(null);
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
						const fontSize = this.state.focusedTextSize.get();
						const fontName = this.state.focusedFontName.get();
						this.setFocus(this.strokeText(
								text,
								Math.floor(this.lastPoint.x),
								Math.floor(this.lastPoint.y)));
				}
		}

		setFocus(focus, repaint = true) {
				this.focus = focus;
				const focusedTextValue = this.getFocusedText(focus);
				this.state.focusedText.set(focusedTextValue);
				this.refreshFontSize();
				if (this.focus != null) {
						const fontName = this.getFocusedFontName(this.focus);
						this.state.focusedFontName.set(fontName);
				}
				if (repaint) {
						this.repaint();
				}
		}

		refreshFontSize() {
				if (this.focus != null) {
						const textSize = this.getFocusedTextSize(this.focus);
						this.state.focusedTextSize.set(textSize);
				}
		}

		getFocusedText(focus) {
				if (focus != null) {
						return focus.text;
				} else {
						return "";
				}
		}

		getFocusedTextSize(focus) {
				if (focus != null) {
						return focus.fontSize;
				} else {
						return 100;
				}
		}

		getFocusedFontName(focus) {
				if (focus != null) {
						return focus.fontFamily;
				} else {
						return "sans-serif";
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
						this.setFocus(box);
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
						this.refreshFontSize();
						return;
				}
				if (lastFocus != null && lastFocus.text.trim() == "") {
						this.deleteTextBox(lastFocus);
						this.refreshFontSize();
						return;
				}


				if(moved){
						if(this.focus) {
								this.focus.moveTo(this.downpoint.add(moveOffset));
						}
				} else {
						if (this.focus != null && this.startedWithFocus) {
								this.setFocus(null, false);
								this.startedWithFocus = false;
						}
				}
				this.refreshFontSize();
				this.repaint();

		}

}
