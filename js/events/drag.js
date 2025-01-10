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
		}

		bind() {
				const target = this.target;
				window.addEventListener("touchstart", this.ondown);
				window.addEventListener("mousedown", this.ondown);
				window.addEventListener("touchmove", this.onmove);
				window.addEventListener("mousemove", this.onmove);
				window.addEventListener("touchend", this.onup);
				window.addEventListener("mouseup", this.onup);
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
						this.downpoint = null;
						return;
				}
				event.preventDefault();
				event.stopPropagation();
				const pt = this.pointFromEvent(event);
				this.prev = pt;
				this.downpoint = pt;
				this.listener.ondown(pt);
		}

		onmove (event) {
				if (this.downpoint == null) {
						return;
				}
				event.preventDefault();
				event.stopPropagation();
				const pt = this.pointFromEvent(event, this.downpoint);
				this.prev = pt;
				const diff = pt.subtract(this.downpoint);
				this.listener.onmove(pt, diff);
		}

		onup (event) {
				if (this.prev == null || this.downpoint == null) {
						return;
				}
				event.preventDefault();
				event.stopPropagation();
				const pt = this.prev;
				const diff = pt.subtract(this.downpoint);
				this.listener.onup(pt, diff, !pt.equals(this.downpoint));
				this.downpoint = null;
				this.prev = null;
		}

}
