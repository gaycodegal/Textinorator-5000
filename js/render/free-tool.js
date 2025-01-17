import {Point} from "../math/point.js";
import {Stack} from "../math/stack.js";
import {atom} from "../state/atom.js";
import {drawColors} from "../logic/colors.js";


/////////////////////
//  Draws squiggles
/////////////////////

export class FreeTool {
		constructor(canvas) {
				this.state = {};
				this.state.color = atom(drawColors[0]);
				this.stack = new Stack(512);
				this.last = null;
				this.temp = null;
				this.moved = false;

				this.cancelled = false;
				this.delay = 0;
				this.setContext(canvas);
		}

		drawControls() {

		}

		shouldPreventDrag() {
				return true;
		}

		cancel (code, isDown) {
				if (!isDown) return;
				this.stack.wipe();
				this.cancelled = true;
				this.context.clearTemp();
		}

		setContext (context) {
				this.stack.wipe();
				this.context = context;
				this.tctx = context.tctx;
				this.bg_ctx = context.bg_ctx;
		}

		onselected () {
				this.stack.wipe();
		}

		setStyle (ctx) {
				let color = {fill: "black", strokeWidth: 5};
				if (this.state.color) {
						const atomicColor = this.state.color.get();
						color.fill = atomicColor.fill;
						color.strokeWidth = atomicColor.strokeWidth || color.strokeWidth;
				}
				ctx.lineWidth = color.strokeWidth;
				ctx.strokeStyle = color.fill;
		}

		ondown (point) {
				this.setStyle(this.tctx);
				
				this.stack.wipe();
				this.cancelled = false;
				this.stack.push(point);
				return true;
		}

		onmove (sc) {
				if (this.cancelled) return;
				this.setStyle(this.tctx);
				var sb = this.stack.peek(),
						sa = this.stack.peek(2);
				this.stack.push(sc);
				if (!sa) return;
				drawQuad(
						this.tctx,
						sa.midPoint(sb), sb, sb.midPoint(sc),
						this.context.origin);
 				this.context.repaint();
		}

		onup (point) {
				if (this.cancelled) return;
				this.setStyle(this.bg_ctx);
				this.context.clearTemp();
				drawFree(
						this.bg_ctx,
						this.stack.data,
						this.stack.fill,
						this.context.origin);
 				this.context.repaint();
		}
}

function drawQuad(ctx, a, b, c, o) {
  var x = o.x,
    y = o.y;
  ctx.beginPath();
  ctx.moveTo(a.x + x, a.y + y);
  ctx.quadraticCurveTo(b.x + x, b.y + y, c.x + x, c.y + y);
  ctx.stroke();
}

function drawFree(ctx, data, len, o) {
  var x = o.x,
    y = o.y;
  var i = 1;
  var pA = data[i];
  var pB = data[i - 1];
  if (len < 3) {
    if (len == 2)
      drawLine(ctx, pA, pB, o);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(pA.x + x, pA.y + y);
  while (i < len) {
    var m = pA.midPoint(pB);
    ctx.quadraticCurveTo(pA.x + x, pA.y + y, m.x + x, m.y + y);
    pA = data[i];
    pB = data[++i];
  }
  ctx.stroke();
}

function drawLine(ctx, a, b, o) {
  var x = o.x,
    y = o.y;
  ctx.beginPath();
  ctx.moveTo(a.x + x, a.y + y);
  ctx.lineTo(b.x + x, b.y + y);
  ctx.stroke();
}
