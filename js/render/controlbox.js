function drawRectPoint(canvas, x, y) {
		const scaled = Math.max(canvas.scale.get() * 2, 4);
		canvas.ctx.fillRect(x-scaled, y-scaled, scaled*2,scaled*2);
}

export function drawControls(canvas, box) {
		const ctx = canvas.ctx;
		ctx.strokeStyle="blue";
		ctx.lineWidth=4.0;
		ctx.strokeRect(box.x, box.y, box.width, box.height);
		ctx.strokeStyle="white";
		ctx.lineWidth=2.0;
		ctx.strokeRect(box.x, box.y, box.width, box.height);
		ctx.fillStyle="red";
		drawRectPoint(canvas, box.x, box.y);
		drawRectPoint(canvas, box.x + box.width, box.y);
		drawRectPoint(canvas, box.x + box.width, box.y + box.height);
		drawRectPoint(canvas, box.x, box.y + box.height);
}
