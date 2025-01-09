import {Point} from "./point.js";

export class Box {
		constructor(x, y, w, h){
				this.x = x;
				this.y = y;
				this.width = w;
				this.height = h;
		}

		clone() {
				return new Box(this.x, this.y, this.width, this.height);
		}

		center() {
				return new Point(
						Math.floor(this.x + this.width / 2),
						Math.floor(this.y + this.height / 2));
		}

		ratioX() {
				return this.width / (this.height + this.width);
		}
		ratioY() {
				return this.height / (this.height + this.width);
		}
}

