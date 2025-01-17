function drawRectPoint(canvas, scale, x, y) {
		const scaled = Math.max(scale * 2, 4);
		canvas.ctx.fillRect(x-scaled, y-scaled, scaled*2,scaled*2);
}

export function drawControls(canvas, box) {
		const ctx = canvas.ctx;
		const scale = Math.round(canvas.state.scale.get());
		ctx.strokeStyle="blue";
		const lineSize = 1 * scale;
		ctx.lineWidth=lineSize;
		const offset = (lineSize % 2) / 2;
		ctx.strokeRect(box.x - offset, box.y - offset, box.width, box.height);
		ctx.strokeStyle="white";
		ctx.strokeRect(box.x - lineSize - offset, box.y - lineSize - offset, box.width + 2*lineSize, box.height + 2*lineSize);
		ctx.fillStyle="red";
		drawRectPoint(canvas, scale, box.x, box.y);
		drawRectPoint(canvas, scale, box.x + box.width, box.y);
		drawRectPoint(canvas, scale, box.x + box.width, box.y + box.height);
		drawRectPoint(canvas, scale, box.x, box.y + box.height);
}
