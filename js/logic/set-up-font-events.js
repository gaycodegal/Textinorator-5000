export function setUpFontSizeEvents(focusedTextSizeAtom, controls) {
		const fontSizeSetter = controls.getElementsByClassName("font-size-setter")[0];
		function doSetFontSize() {
				let value = Number.parseFloat(fontSizeSetter.value);
				if (value < 3) {
						value = 3;
				}
				focusedTextSizeAtom.set(value);
		}
		focusedTextSizeAtom.bindListener((fontSize)=>{
				const isFocused = document.activeElement == fontSizeSetter;
				if (fontSizeSetter.value != fontSize) {
						fontSizeSetter.value = fontSize;
						if (!isFocused) {
								fontSizeSetter.blur();
						}
				}
		}, true);
		fontSizeSetter.addEventListener("change", doSetFontSize);
		//textSetter.addEventListener("keyup", setFocusedTextFromSetter);
}


export function setUpFontNameEvents(focusedFontNameAtom, controls) {
		const fontNameSetter = controls.getElementsByClassName("font-name-setter")[0];
		function doSetFontName() {
				let value = fontNameSetter.value;
				focusedFontNameAtom.set(value);
		}
		focusedFontNameAtom.bindListener((name)=>{
				const isFocused = document.activeElement == fontNameSetter;
				if (!isFocused && fontNameSetter.value != name) {
						fontNameSetter.value = name;
						fontNameSetter.blur();
				}
		}, true);
		fontNameSetter.addEventListener("change", doSetFontName);
}


export function setUpTextChangeEvents(focusedTextAtom, controls) {
		const textSetter = controls.getElementsByClassName("text-setter")[0];
		function setFocusedTextFromSetter() {
				focusedTextAtom.set(textSetter.value);
		}
		focusedTextAtom.bindListener((text)=>{
				if (textSetter.value != text) {
						textSetter.value = text;
						textSetter.blur();
				}
		});
		textSetter.addEventListener("change", setFocusedTextFromSetter);
		textSetter.addEventListener("keyup", setFocusedTextFromSetter);
}

export function setUpDeleteTextEvent(screen, controls) {
		const deleteTextButton = controls.getElementsByClassName("delete-text")[0];
		deleteTextButton.addEventListener('click', screen.deleteFocusedText.bind(screen));
}
