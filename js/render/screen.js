import {DragListener} from "../events/drag.js";
import {Point} from "../math/point.js";
import {TextTool} from "./text-tool.js";
import {FreeTool} from "./free-tool.js";
import {atom} from "../state/atom.js";
import {colors, cloneColor} from "../logic/colors.js";

export class Screen {
		constructor(canvas, snapRadius, clickRadius){
				// live state
				const state = {};
				this.state = state;				
				this.canvas = canvas;
				this.tools = {
						text: new TextTool(canvas, snapRadius, clickRadius),
						draw: new FreeTool(canvas),
				};
				this.activeTool = this.tools.text;
				this.dragListen = new DragListener(canvas.canvas, canvas.state.scale, this.snapRadius, this);
				this.dragListen.bind();
				this.canvas.state.scale.bindListener(this.repaint.bind(this));
		}

		setActiveTool(tool) {
				if (this.tools[tool] == null) {
						return;
				}
				this.activeTool = this.tools[tool];
				this.activeTool.onselected(tool);
		}

		repaint() {
				this.canvas.repaint();
				if (this.activeTool != null) {
						this.activeTool.drawControls();
				}
		}

		shouldPreventDrag() {
				if (this.activeTool == null || this.activeTool.shouldPreventDrag == null) {
						return false;
				}
				return this.activeTool.shouldPreventDrag();
		}

		ondown(pt) {
				if (this.activeTool == null || this.activeTool.ondown == null) {
						return false;
				}
				return this.activeTool.ondown(pt);
		}

		onmove(pt, moveOffset) {
				if (this.activeTool == null || this.activeTool.onmove == null) {
						return;
				}

				return this.activeTool.onmove(pt, moveOffset);
		}

		onup(pt, moveOffset, moved) {
				if (this.activeTool == null || this.activeTool.onup == null) {
						return;
				}

				return this.activeTool.onup(pt, moveOffset, moved);

		}

}
