const shadowColors = [
		{color: "#ff0000", name: "red"},
		{color: "#ffa500", name: "orange"},
		{color: "#ffff00", name: "yellow"},
		{color: "#008000", name: "green"},
		{color: "#0000ff", name: "blue"},
		{color: "#800080", name: "purple"},
		{color: "#000000", name: "black"},
		{color: "#ffffff", name: "white"},
].map(makeShadowColor);
const strokedColors = [{name: "white with stroke", fill:"#ffffff", stroke:"#000000", strokeWidth: 10}];
export let colors = strokedColors.concat(shadowColors);
export let drawColors = [
		{color: "#000000", name: "black"},
		{color: "#ffffff", name: "white"},
		{color: "#ff0000", name: "red"},
		{color: "#ffa500", name: "orange"},
		{color: "#ffff00", name: "yellow"},
		{color: "#008000", name: "green"},
		{color: "#0000ff", name: "blue"},
		{color: "#800080", name: "purple"},
].map(makeDrawColor);

export function makeShadowColor(color) {
		const shadow = color.color=="#000000" ? "#ffffff" : "#000000";
		return {fill: color.color, shadow, shadowBlur: 3, name: color.name};
}

export function makeDrawColor(color) {
		return {fill: color.color, strokeWidth: 10, name: color.name};
}

export function cloneColor(color) {
		return {...color};
}
