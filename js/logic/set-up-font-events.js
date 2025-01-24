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

export function setUpFontVerticalEvent(focusedFontVerticalAtom, controls) {
		const fontVerticalInput = controls.getElementsByClassName("font-vertical")[0];
		function doSetFontVertical() {
				let value = fontVerticalInput.checked;
				focusedFontVerticalAtom.set(value);
		}
		focusedFontVerticalAtom.bindListener((isVertical)=>{
				const isFocused = document.activeElement == fontVerticalInput;
				if (!isFocused && fontVerticalInput.checked != isVertical) {
						fontVerticalInput.checked = isVertical;
						fontVerticalInput.blur();
				}
		}, true);
		fontVerticalInput.addEventListener("change", doSetFontVertical);
}

export function setUpFontBoldEvent(focusedFontBoldAtom, controls) {
		const fontBoldInput = controls.getElementsByClassName("font-bold")[0];
		function doSetFontBold() {
				let value = fontBoldInput.checked;
				focusedFontBoldAtom.set(value);
		}
		focusedFontBoldAtom.bindListener((isBold)=>{
				const isFocused = document.activeElement == fontBoldInput;
				if (!isFocused && fontBoldInput.checked != isBold) {
						fontBoldInput.checked = isBold;
						fontBoldInput.blur();
				}
		}, true);
		fontBoldInput.addEventListener("change", doSetFontBold);
}


export function setUpFontItalicEvent(focusedFontItalicAtom, controls) {
		const fontItalicInput = controls.getElementsByClassName("font-italic")[0];
		function doSetFontItalic() {
				let value = fontItalicInput.checked;
				focusedFontItalicAtom.set(value);
		}
		focusedFontItalicAtom.bindListener((isItalic)=>{
				const isFocused = document.activeElement == fontItalicInput;
				if (!isFocused && fontItalicInput.checked != isItalic) {
						fontItalicInput.checked = isItalic;
						fontItalicInput.blur();
				}
		}, true);
		fontItalicInput.addEventListener("change", doSetFontItalic);
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
