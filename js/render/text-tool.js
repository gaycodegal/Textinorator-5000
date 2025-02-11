import {Point} from "../math/point.js";
import {TextBox} from "./textbox.js";
import {atom} from "../state/atom.js";
import {colors, cloneColor} from "../logic/colors.js";

export class TextTool {
		constructor(canvas, snapRadius, clickRadius){
				// live state
				const state = {};
				this.state = state;

				state.focusedTextVertical = atom(false);
				state.focusedTextVertical.bindListener(
						this.setFocusedTextVertical.bind(this));

				state.focusedTextItalic = atom(false);
				state.focusedTextItalic.bindListener(
						this.setFocusedTextItalic.bind(this));

				state.focusedTextBold = atom(false);
				state.focusedTextBold.bindListener(
						this.setFocusedTextBold.bind(this));

				state.focusedText = atom("");
				state.focusedText.bindListener(
						this.setFocusedText.bind(this));
				
				state.focusedTextSize = atom(100);
				state.focusedTextSize.bindListener(
						this.setFocusedTextSize.bind(this));
				
				state.focusedFontName = atom("sans-serif");
				state.focusedFontName.bindListener(
						this.setFocusedFontName.bind(this));
				
				state.focusedColor = atom(colors[0]);
				state.focusedColor.bindListener(
						this.setFocusedColor.bind(this));

				this.textBoxes = [];
				
				this.canvas = canvas;
				this.snapRadius = snapRadius;
				this.clickRadius = clickRadius;
				
				this.downpoint = null;
				this.dragForwardListener = null;
				this.startedWithFocus = false;
				this.lastPoint = null;
		}

		onselected() {
				this.focus = null;
				this.repaint();
		}

		setFocusedTextVertical(vertical) {
				if (this.focus != null && vertical != this.focus.vertical) {
						this.focus.setVertical(this.canvas, vertical);
						this.repaint();
				}
		}

		setFocusedTextItalic(italic) {
				if (this.focus != null && italic != this.focus.italic) {
						this.focus.setItalic(this.canvas, italic);
						this.repaint();
				}
		}

		setFocusedTextBold(bold) {
				if (this.focus != null && bold != this.focus.bold) {
						this.focus.setBold(this.canvas, bold);
						this.repaint();
				}
		}

		setFocusedTextSize(size) {
				if (this.focus != null && size != this.focus.fontSize) {
						this.focus.setFontSize(this.canvas, size);
						this.repaint();
				}
		}

		setFocusedFontName(name) {
				if (this.focus != null && name != this.focus.fontFamily) {
						this.focus.setFontName(this.canvas, name);
						this.repaint();
				}
		}

		setFocusedColor(color) {
				if (this.focus != null && this.focus.color != color) {
						this.focus.setColor(this.canvas, cloneColor(color));
						this.repaint();
				}
		}

		strokeText(text, x, y, fontSize = null, fontFamily = null, color = null, vertical = null) {
				if (color == null) {
						color = this.state.focusedColor.get();
				}
				if (fontSize == null) {
						fontSize = this.state.focusedTextSize.get();
				}
				if (fontFamily == null) {
						fontFamily = this.state.focusedFontName.get();
				}
				if (vertical == null) {
						vertical = this.state.focusedTextVertical.get();
				}
				const textbox = new TextBox(
						this.canvas, text, x, y, fontSize, fontFamily, color, vertical);
				textbox.draw(this.canvas);
				this.canvas.drawables.push(textbox);
				this.textBoxes.push(textbox);
				return textbox;
		}

		deleteFocusedText() {
				this.deleteTextBox(this.focus);
		}
		
		deleteTextBox(box) {
				const indexToRemoveDrawable = this.canvas.drawables.indexOf(box);
				if (indexToRemoveDrawable != -1) {
						this.canvas.drawables.splice(indexToRemoveDrawable, 1);
				}
				const indexToRemoveBox = this.textBoxes.indexOf(box);
				if (indexToRemoveBox != -1) {
						this.textBoxes.splice(indexToRemoveBox, 1);
				}
				
				if (this.focus == box) {
						this.setFocus(null);
				}
				this.repaint();
		}

		repaint() {
				this.canvas.repaint();
				this.drawControls();
		}

		setFocusedText(text) {
				if (this.focus != null) {
						if (this.focus.text == text) {
								return;
						}
						this.focus.retext(this.canvas, text);
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
						const focusColor = this.getFocusedColor(this.focus);
						this.state.focusedColor.set(focusColor);
						const isVertical = this.getFocusedTextVertical(this.focus);
						this.state.focusedTextVertical.set(isVertical);
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


		getFocusedTextVertical(focus) {
				if (focus != null) {
						return focus.vertical;
				} else {
						return false;
				}
		}

		getFocusedColor(focus) {
				if (focus != null) {
						return focus.color;
				} else {
						return {};
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
				this.textBoxes.reverse();
				for(let textbox of this.textBoxes) {
						if (point.inside(textbox)) {
								match = textbox;
								break;
						}
				}
				this.textBoxes.reverse();
				return match;
		}
		
		ondown(pt) {
				this.startedWithFocus = false;
				if (this.focus != null && this.focus.text.trim() == "") {
						this.deleteFocusedText();
						return true; // we're doing work; not an idle drag
				}

				if (this.focus != null) {
						const scaledClickRadius
									= this.clickRadius * canvas.state.scale.get();
						this.dragForwardListener = this.focus
								.getListenerForPoint(this.canvas, pt, scaledClickRadius);
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

		drawControls() {
				if (this.focus != null) {
						this.focus.drawControls(this.canvas);
				}
		}

		shouldPreventDrag() {
				return this.focus != null;
		}
		
		onmove(pt, moveOffset, isTrueDrag) {
				if (this.dragForwardListener != null) {
						this.dragForwardListener.onmove(pt, moveOffset, isTrueDrag);
						return;
				}

				if (!isTrueDrag) {
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
