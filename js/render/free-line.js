export class FreeLine {
		constructor(data, color) {
				this.data = data;
				this.color = color;
		}

		setStyle (ctx) {
				let color = {fill: "black", strokeWidth: 5};
				if (this.color) {
						const atomicColor = this.color;
						color.fill = atomicColor.fill;
						color.strokeWidth = atomicColor.strokeWidth || color.strokeWidth;
				}
				ctx.lineWidth = color.strokeWidth;
				ctx.strokeStyle = color.fill;
		}


		draw(canvas, ctx) {
				this.setStyle(ctx, this.color);
				drawFree(ctx, this.data, this.data.length, canvas.origin);
		}
}



export function drawQuad(ctx, a, b, c, o) {
  var x = o.x,
    y = o.y;
  ctx.beginPath();
  ctx.moveTo(a.x + x, a.y + y);
  ctx.quadraticCurveTo(b.x + x, b.y + y, c.x + x, c.y + y);
  ctx.stroke();
}

export function drawFree(ctx, data, len, o) {
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

export function drawLine(ctx, a, b, o) {
  var x = o.x,
    y = o.y;
  ctx.beginPath();
  ctx.moveTo(a.x + x, a.y + y);
  ctx.lineTo(b.x + x, b.y + y);
  ctx.stroke();
}
