const shadowColors = ["red", "orange", "yellow", "green", "blue", "purple", "black", "white"].map(makeShadowColor);
const strokedColors = [{fill:"white", stroke:"black", strokeWidth: 10}];
export let colors = strokedColors.concat(shadowColors);

export function makeShadowColor(color) {
		const shadow = color=="black" ? "white" : "black";
		return {fill: color, shadow, shadowBlur: 3};
}

export function cloneColor(color) {
		return {...color};
}
