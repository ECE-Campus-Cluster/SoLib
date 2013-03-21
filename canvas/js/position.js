// Borrowed from HTML5CanvasTutorials.com

// Function that returns the coordinates of the mouse
function getMousePos(object, ev) {

    // Get canvas position
    var top = 0;
    var left = 0;
	
    while (object && object.tagName != 'BODY') {
        top += object.offsetTop;
        left += object.offsetLeft;
        object = object.offsetParent;
    }
	
    // Return positions
    var mouseX = ev.clientX - left + window.pageXOffset-10;
    var mouseY = ev.clientY - top + window.pageYOffset-10;
	
    return {
        x:mouseX,
        y:mouseY
    };
}