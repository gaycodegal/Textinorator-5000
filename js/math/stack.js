/**
	 Basic stack taken from the DrawingBook
	 project to support the FreeTool
 */
export class Stack {
		constructor (size) {
				this.size = size;
				this.fill = 0;
				this.data = new Array(this.size);
		}

		peek (i) {
				i = this.fill - (i || 1);
				if(i < 0)
						return null;
				return this.data[i];
		}

		get (i) {
				return this.data[i];
		}

		pop () {
				return this.data[--this.fill];
		}

		push (d) {
				if (this.fill == this.size)
						this.grow(this.size << 1);
				this.data[this.fill++] = d;
		}

		grow (newSize) {
				var oldSize = this.fill,
						oldData = this.data;
				this.size = newSize;
				this.data = new Array(this.size);
				for (var i = 0; i < oldSize; ++i) {
						this.data[i] = oldData[i];
				}
				oldData = null;
		}

		shrink () {
				this.grow(this.fill);
		}

		wipe () {
				this.fill = 0;
		}
}
