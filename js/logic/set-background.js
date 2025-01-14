export function setUpFontSizeEvents(screen, controls) {
		const fontSizeSetter = controls.getElementsByClassName("font-size-setter")[0];
		function doSetFontSize() {
				let value = fontSizeSetter.value;
				if (value < 3) {
						value = 3;
				}
				screen.state.focusedTextSize.set(value);
		}
		screen.state.focusedTextSize.bindListener((fontSize)=>{
				const isFocused = document.activeElement == fontSizeSetter;
				if (fontSizeSetter.value != fontSize) {
						fontSizeSetter.value = fontSize;
						if (!isFocused) {
								fontSizeSetter.blur();
						}
				}
		});
		fontSizeSetter.addEventListener("change", doSetFontSize);
		//textSetter.addEventListener("keyup", setFocusedTextFromSetter);
}


export function setUpFontNameEvents(screen, controls) {
		const fontNameSetter = controls.getElementsByClassName("font-name-setter")[0];
		function doSetFontName() {
				let value = fontNameSetter.value;
				screen.state.focusedFontName.set(value);
		}
		screen.state.focusedFontName.bindListener((name)=>{
				const isFocused = document.activeElement == fontNameSetter;
				if (!isFocused && fontNameSetter.value != name) {
						fontNameSetter.value = name;
						fontNameSetter.blur();
				}
		});
		fontNameSetter.addEventListener("change", doSetFontName);
}


export function setUpTextChangeEvents(screen, controls) {
		const textSetter = controls.getElementsByClassName("text-setter")[0];
		function setFocusedTextFromSetter() {
				screen.state.focusedText.set(textSetter.value);
		}
		screen.state.focusedText.bindListener((text)=>{
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

function sanitizeDownloadName(downloadName) {
		return downloadName.split(".")[0];
}

export function setUpDownloadButton(screen, controls) {
		const downloadName = controls.getElementsByClassName("image-name")[0];
		const downloadButton = controls.getElementsByClassName("download-image")[0];
		
		downloadButton.addEventListener('click', function download() {
				var link = document.createElement('a');
				const fileName = sanitizeDownloadName(downloadName.value);
				link.download = `${fileName}.png`;
				screen.canvas.repaint();
				link.href = screen.canvas.canvas.toDataURL();
				link.click();
		});
}


function setAsBackground(e){
		const self = this;
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
						self.screen.canvas.setBackground(img);
						window.scrollTo(0,0);
        }
        img.src = event.target.result;
    }
		const file = e.target.files[0];
    reader.readAsDataURL(file);
		this.downloadName.value = file.name;
}
export function setUpBackgroundSetter(screen, controls) {
		const picker = controls.getElementsByClassName("image-picker")[0];
		const downloadName = controls.getElementsByClassName("image-name")[0];
		picker.addEventListener('change', setAsBackground.bind({screen, downloadName}), false);

}
