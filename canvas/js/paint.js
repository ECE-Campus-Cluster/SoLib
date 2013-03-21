// Default tool: pencil
var DEFAULT = 'pencil';
// Object 
var paint;

//background of the canvas
var myBackground = new Image();
myBackground.src = 'http://www.zepoze.com/wp-content/gallery/signes-et-caracteres/symboles-ecritures-11.jpg';

function PaintObject(o) {

    this.started = false;

    var canvas = $("#"+o).get(0); // Reference on the canvas element

    // Verify if the canvas exists
    if (!canvas)
	{
		alert("Not supported");
	}
    if (!canvas.getContext)
	{
		alert("Error");
	}

    // Get the context for drawing
    var ctx = canvas.getContext('2d');
	
	// Verify if there is a context
    if (!ctx)
	{
		alert("No context");
	}

	myBackground.onload = function(){
      ctx.drawImage(myBackground, 0, 0);
    }
	
	/* CREATE A LAYER */
	var front = document.createElement('canvas');
	front.id = 'front_canvas';
	
	// Add the temporary canvas to the main canvas (#the_canvas)
	canvas.parentNode.appendChild(front);
	
	// Verify if the front canvas exits
	if(!front)
	{
		alert("No front canvas");
	}
	
	// Verify if the front canvas has a context
	if(!front.getContext)
	{
		alert("The front canvas has no context");
	}
	
	var front_ctx = front.getContext('2d');
	if(!front_ctx)
	{
		alert("ERROR");
	}
	
	/* GETTERS */
	this.getCanvas = function ()
	{
		return canvas;
	}
	
	this.getCtx = function ()
	{
		return ctx;
	}
	
	this.getFrontCanvas = function ()
	{
		return front;
	}
	
	this.getFrontCtx = function ()
	{
		return front_ctx;
	}
	
	// Set the size of the canvas
    front.height = canvas.height = $("#container")[0].clientHeight;
    front.width = canvas.width = $("#container")[0].clientWidth;
	
	// Create a Tools object and set it with the default value
	var draw_tool = new setTool[DEFAULT]();
	
    // Add the listeners to the canvas
	this.multipleToolsListener = function()
	{
		$("#front_canvas").mousedown(this.multipleTools);
		$("#front_canvas").mousemove(this.multipleTools);
		$("#front_canvas").mouseup(this.multipleTools);
	}
	
	// Call the current tool mouse listener method
	// Example : current tool = pencil and event.type = mousemove, then pencil.mousemove(event) will be called
	this.multipleTools = function(event)
	{
		console.log("hello"+draw_tool[event.type](event));
		//if(draw_tool == "pencil" || draw_tool == "line" || draw_tool == "rect" || draw_tool == "circle")
			draw_tool[event.type](event);
	}
	
	// Set the tool regarding the chosen option
	this.changeTool = function()
	{
		draw_tool = new setTool[this.id]();
	}
	
	// Function onClick
    $("#toolbar").find("button").bind('click', this.changeTool);
	
	// Draw what is on the front canvas on the main canvas
	this.drawOnMainCanvas = function ()
	{
		ctx.drawImage(front,0,0);
		front_ctx.clearRect(0,0,front.width,front.height);
	}
	
	// Change the value of the stroke and the fill style when a user clik on a color
	$("#couleurs a").each(function() {
	
		// A background color is associated with the color name
		$(this).css("background", $(this).attr("data-couleur"));
		
		$(this).click(function() 
		{
		
			// Set the color of the strokeStyle
			front_ctx.strokeStyle = ctx.strokeStyle = $(this).attr("data-couleur");
			// Set the color of the fillStyle
			front_ctx.fillStyle = ctx.fillStyle = $(this).attr("data-couleur");
				
			// Remove the color chosen in the class
			$("#couleurs a").removeAttr("class", "");
			// 
			$(this).attr("class", "actif");
				
			return false;
		});
	});
	

	// Set the width of the brush 
	front_ctx.lineWidth = ctx.lineWidth = $("#pencil_width").val();
	$("#pencil_width").change(function() {
		if (!isNaN($(this).val())) {
			front_ctx.lineWidth = ctx.lineWidth = $("#pencil_width").val();
			$("#output").html($(this).val() + " pixels");
		}
	});
	
	front_ctx.lineJoin = ctx.lineJoin = 'round';
	front_ctx.lineCap = ctx.lineCap = 'round';
	
}

