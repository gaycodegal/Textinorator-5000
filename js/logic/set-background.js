

export function setUpDeleteTextEvent(screen, controls) {
		const deleteTextButton = controls.getElementsByClassName("delete-text")[0];
		deleteTextButton.addEventListener('click', screen.deleteFocusedText.bind(screen));
}


function setAsBackground(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
						screen.canvas.setBackground(img);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}
export function setUpBackgroundSetter(screen, controls) {
		const picker = controls.getElementsByClassName("image-picker")[0];
		picker.addEventListener('change', setAsBackground.bind({screen}), false);

}
