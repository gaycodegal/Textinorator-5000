export class Point {
		constructor(x, y){
				this.x = x;
				this.y = y;
		}

		static fromEvent (e) {
				e.touches && (e = e.touches[0]);
				var x = e.clientX || e.pageX;
				var y = e.clientY || e.pageY;
				return new Point(x, y);
		}

		scale(scale) {
				return new Point(this.x * scale, this.y * scale);
		}

		add(p2) {
				return new Point(this.x + p2.x, this.y + p2.y);
		}

		subtract(p2) {
				return new Point(this.x - p2.x, this.y - p2.y);
		}

		manhatten(p2) {
				return Math.abs(this.x - p2.x) + Math.abs(this.y - p2.y);
		}

		equals(p2) {
				return p2 && this.x == p2.x && this.y == p2.y;
		}

		inside(box) {
				return box.isInside(this.x,this.y);
		}
}
