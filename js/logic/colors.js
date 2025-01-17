const shadowColors = ["#ff0000", "#ffa500", "#ffff00", "#008000", "#0000ff", "#800080", "#000000", "#ffffff"].map(makeShadowColor);
const strokedColors = [{fill:"#ffffff", stroke:"#000000", strokeWidth: 10}];
export let colors = strokedColors.concat(shadowColors);
export let drawColors = ["#000000", "#ffffff", "#ff0000", "#ffa500", "#ffff00", "#008000", "#0000ff", "#800080"].map(makeDrawColor);

export function makeShadowColor(color) {
		const shadow = color=="#000000" ? "#ffffff" : "#000000";
		return {fill: color, shadow, shadowBlur: 3};
}

export function makeDrawColor(color) {
		return {fill: color, strokeWidth: 10};
}

export function cloneColor(color) {
		return {...color};
}
