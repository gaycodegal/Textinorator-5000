
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
export function setUpBackgroundSetter(screen, controlContainer) {
		const picker = controls.getElementsByClassName("image-picker")[0];
		picker.addEventListener('change', setAsBackground.bind({screen}), false);

}
