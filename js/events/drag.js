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
				this.isTrueDrag = false;
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
				const scale = this.scale.get();
				const pt = Point.fromEvent(event, this.prev).subtract(offset).scale(scale);
				if (downpoint && pt.manhatten(downpoint) < this.deadzone * scale) {
						return downpoint;
				}
				return pt;
		}

		checkTrueDrag(pt, downpoint) {
				const scale = this.scale.get();
				return downpoint && pt.manhatten(downpoint) < this.deadzone * scale;
		}

		verifyEvent (event) {
				return event.target == this.target;
		}

		ondown (event) {
				this.isTrueDrag = false;
				if (!this.verifyEvent(event) || (event.button != null && event.button != 0)) {
						this.dragging = false;
						this.downpoint = null;
						return;
				}
				const pt = this.pointFromEvent(event);
				this.prev = pt;
				this.downpoint = pt;

				if (this.listener.shouldPreventDrag() == false) {
						this.dragging = false;
						return;
				}
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
				const pt = this.pointFromEvent(event);
				const diff = pt.subtract(this.downpoint);
				const pointEqualsDown = this.checkTrueDrag(pt);
				if (!pointEqualsDown) {
						this.isTrueDrag = true;
				}

				if (!this.dragging) {
						if (!pointEqualsDown) {
								this.isTrueDrag = true;
						}
						return;
				}
				event.preventDefault();
				event.stopPropagation();
				this.prev = pt;
				this.listener.onmove(pt, diff);
		}

		onup (event) {
				if (this.prev == null || this.downpoint == null) {
						return;
				}
				const pt = this.prev;
				const diff = pt.subtract(this.downpoint);
				if (!this.dragging) {
						if (!this.isTrueDrag) {
								event.preventDefault();
								event.stopPropagation();
								this.listener.ondown(this.downpoint);
								this.listener.onmove(pt, diff);
								this.listener.onup(pt, diff, this.isTrueDrag);
						}
						this.downpoint = null;
						this.prev = null;
						this.dragging = false;
						this.isTrueDrag = false;
						return;
				}

				event.preventDefault();
				event.stopPropagation();
				this.listener.onup(pt, diff, this.isTrueDrag);
				this.downpoint = null;
				this.dragging = false;
				this.prev = null;
		}

}
