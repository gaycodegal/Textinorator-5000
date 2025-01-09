import {Point} from "../math/point.js";

export class DragListener {
		constructor(offset, scale, deadzone, listener) {
				this.scale = scale;
				this.offset = offset;
				this.deadzone = deadzone;
				this.listener = listener;
		}

		pointFromEvent(event, downpoint = null) {
				const pt = Point.fromEvent(event).add(this.offset).scale(this.scale);
				if (downpoint && pt.manhatten(downpoint) < this.deadzone) {
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
				this.listener.onmove(pt);
		}

		onup (event) {
				event.preventDefault();
				event.stopPropagation();
				const pt = this.pointFromEvent(event, this.downpoint);
				this.listener.onup(pt, pt.equals(this.downpoint));
				this.downpoint = null;
		}

}
