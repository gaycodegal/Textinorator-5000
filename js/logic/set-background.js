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

export function setUpImageSaveOnCopy(screen, controls) {
	document.addEventListener("copy", (event) => {
		if (event.target.tagName.toLowerCase() == "input") {
			return;
		}
		screen.canvas.repaint();
		screen.canvas.canvas.toBlob((blob) => {
			navigator.clipboard.write([
				new ClipboardItem({
					'image/png': blob
				})
			]);
		});
	});
}

export function setUpImageCaptureOnPaste(screen, controls) {
	document.addEventListener("paste", (event) => {
		if (event.target.tagName.toLowerCase() == "input") {
			return;
		}
		const clipboardData = event.clipboardData || window.clipboardData;
		const file = clipboardData.files[0];

		const picker = controls.getElementsByClassName("image-picker")[0];
		const downloadName = controls.getElementsByClassName("image-name")[0];
		setAsBackground({screen, downloadName}, {target:{
			files: [file]
		}});
	});
}

function setAsBackground(self, e) {
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
	self.downloadName.value = file.name;
}

function setAsBackgroundWrapper(e){
	setAsBackground(this, e);
}

export function setUpBackgroundSetter(screen, controls) {
		const picker = controls.getElementsByClassName("image-picker")[0];
		const downloadName = controls.getElementsByClassName("image-name")[0];
		picker.addEventListener('change', setAsBackgroundWrapper.bind({screen, downloadName}), false);
}
