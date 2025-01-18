export function setUpFocusEvents(focusAtom) {
		focusAtom.bindListener((screen)=>{
				if (document.activeElement.tagName.toLowerCase() == "input") {
						document.activeElement.blur();
				}
		});
}
