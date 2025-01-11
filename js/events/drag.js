import {Point} from "../math/point.js";

export class DragListener {
		constructor(target, scale, deadzone, listener) {
				this.target = target;
				this.scale = scale;
				this.deadzone = deadzone;
				this.listener = listener;
				this.prev = null;
				this.ondown = this.ondown.bind(this);
				this.onmove = this.onmove.bind(this);
				this.onup = this.onup.bind(this);
				this.dragging = false;
		}

		bind() {
				const target = this.target;
				target.addEventListener("touchstart", this.ondown);
				target.addEventListener("mousedown", this.ondown);
				target.addEventListener("touchmove", this.onmove);
				target.addEventListener("mousemove", this.onmove);
				target.addEventListener("touchend", this.onup);
				target.addEventListener("mouseup", this.onup);
		}

		unbind() {
				const target = this.target;
				target.removeEventListener("touchstart", this.ondown);
				target.removeEventListener("mousedown", this.ondown);
				target.removeEventListener("touchmove", this.onmove);
				target.removeEventListener("mousemove", this.onmove);
				target.removeEventListener("touchend", this.onup);
				target.removeEventListener("mouseup", this.onup);
		}

		pointFromEvent(event, downpoint = null) {
				const rect = this.target.getBoundingClientRect();
				const offset = new Point(rect.left,rect.top);
				const pt = Point.fromEvent(event, this.prev).subtract(offset).scale(this.scale);
				if (downpoint && pt.manhatten(downpoint) < this.deadzone * this.scale) {
						return downpoint;
				}
				return pt;
		}

		verifyEvent (event) {
				return event.target == this.target;
		}

		ondown (event) {
				if (!this.verifyEvent(event) || (event.button != null && event.button != 0)) {
						this.dragging = false;
						this.downpoint = null;
						return;
				}
				const pt = this.pointFromEvent(event);
				this.prev = pt;
				this.downpoint = pt;
				this.dragging = this.listener.ondown(pt);
				if (this.dragging) {
						event.preventDefault();
						event.stopPropagation();
				}
		}

		onmove (event) {
				if (this.downpoint == null) {
						return;
				}
				const pt = this.pointFromEvent(event, this.downpoint);
				const diff = pt.subtract(this.downpoint);
				// TODO calculate if we're dragging or tapping
				// to focus / unfocus on elements
				if (!this.dragging) {
						return;
				}
				event.preventDefault();
				event.stopPropagation();
				this.prev = pt;
				this.listener.onmove(pt, diff);
		}

		onup (event) {
				if (!this.dragging || this.prev == null || this.downpoint == null) {
						return;
				}
				this.dragging = false;
				event.preventDefault();
				event.stopPropagation();
				const pt = this.prev;
				const diff = pt.subtract(this.downpoint);
				this.listener.onup(pt, diff, !pt.equals(this.downpoint));
				this.downpoint = null;
				this.prev = null;
		}

}
