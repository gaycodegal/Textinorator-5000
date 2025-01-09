import {Point} from "../math/point.js";

export class DragListener {
		constructor(target, scale, deadzone, listener) {
				this.target = target;
				this.scale = scale;
				this.deadzone = deadzone;
				this.listener = listener;

				this.ondown = this.ondown.bind(this);
				this.onmove = this.onmove.bind(this);
				this.onup = this.onup.bind(this);
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

		pointFromEvent(event, downpoint = null) {
				const offset = new Point(0,0);
				const pt = Point.fromEvent(event).add(offset).scale(this.scale);
				if (downpoint && pt.manhatten(downpoint) < this.deadzone * this.scale) {
						return downpoint;
				}
				return pt;
		}

		ondown (event) {
				event.preventDefault();
				event.stopPropagation();
				const pt = this.pointFromEvent(event);
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
				const diff = pt.subtract(this.downpoint);
				this.listener.onmove(pt, diff);
		}

		onup (event) {
				event.preventDefault();
				event.stopPropagation();
				const pt = this.pointFromEvent(event, this.downpoint);
				const diff = pt.subtract(this.downpoint);
				this.listener.onup(pt, diff, !pt.equals(this.downpoint));
				this.downpoint = null;
		}

}
