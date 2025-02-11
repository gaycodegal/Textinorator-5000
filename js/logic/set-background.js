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
