// Array of tools
var setTool = new Array();
// Last position of the mouse
var prev_pos;

/* PENCIL FUNCTION */
setTool.pencil = function()
{
	// Initialize the position of the mouse and the flag when the mouse is down the canvas
    this.mousedown = function (event) 
    {
        paint.started = true;
        prev_pos = getMousePos(paint.getFrontCanvas(), event);
    };
	
	// Draw lines when the mouse is in motion
    this.mousemove = function (event) 
	{
       
		// Get the current position of the mouse
        var cur_pos = getMousePos(paint.getFrontCanvas(), event);

        // Draw lines
        if (paint.started) 
		{
            // Declare a path
			paint.getCtx().beginPath();
			// Move to the last positions of the cursor
            paint.getCtx().moveTo(prev_pos.x, prev_pos.y);
			// Draw a line to the current positions of the mouse
            paint.getCtx().lineTo(cur_pos.x, cur_pos.y);
			// Draw every primitive declared
            paint.getCtx().stroke();   
        }
		prev_pos = cur_pos;
    };
	
	// Stop drawing when the mouse is up
    this.mouseup = function (event) 
	{
        paint.started = false;
    }
};

/* LINE FUNCTION */
setTool.line = function()
{
	// Initialize the position of the mouse and the flag when the mouse is down the canvas
    this.mousedown = function (event) 
    {
        paint.started = true;
        prev_pos = getMousePos(paint.getFrontCanvas(), event);
    };
	
	// Draw a line when the mouse is in motion
    this.mousemove = function (event) 
	{
       
		// Get the current position of the mouse
        var cur_pos = getMousePos(paint.getFrontCanvas(), event);

        // Draw lines
        if (paint.started) 
		{
           
			// Clear the canvas
			paint.getFrontCtx().clearRect(0, 0, paint.getFrontCanvas().width, paint.getFrontCanvas().height);
			// Declare a path
			paint.getFrontCtx().beginPath();
			// Move to the last positions of the cursor
            paint.getFrontCtx().moveTo(prev_pos.x, prev_pos.y);
			// Draw a line to the current positions of the mouse
            paint.getFrontCtx().lineTo(cur_pos.x, cur_pos.y);
			// Draw every primitive declared
            paint.getFrontCtx().stroke();   
			
        }
		
    };
	
	// Stop drawing when the mouse is up
    this.mouseup = function (event) 
	{
        paint.started = false;
		paint.drawOnMainCanvas();
    }
};

/* RECTANGLE FUNCTION */
setTool.rect = function()
{
	var cur_pos, x, y, width, height;
	
	// Initialize the position of the mouse and the flag when the mouse is down the canvas
    this.mousedown = function (event) 
    {
        prev_pos = getMousePos(paint.getFrontCanvas(), event);
		paint.started = true; 
    }
	
	// Draw a line when the mouse is in motion
    this.mousemove = function (event) 
	{
       
		// Get the current position of the mouse
        var cur_pos = getMousePos(paint.getFrontCanvas(), event);

        // Draw lines
        if (paint.started) 
		{
            // Clear the canvas
			paint.getFrontCtx().clearRect(0, 0, paint.getFrontCanvas().width, paint.getFrontCanvas().height);
			width = Math.abs(prev_pos.x - cur_pos.x);
            height = Math.abs(prev_pos.y - cur_pos.y);
            x = Math.min(prev_pos.x, cur_pos.x);
            y = Math.min(prev_pos.y, cur_pos.y);
            paint.getFrontCtx().strokeRect(x, y, width, height);
			// Draw every primitive declared
            paint.getFrontCtx().stroke();   
        }
    }
	
	// Stop drawing when the mouse is up
    this.mouseup = function (event) 
	{
        paint.started = false;
		paint.drawOnMainCanvas();
    }
};

/* CIRCLE FUNCTION */
setTool.circle = function()
{
	var cur_pos, x, y, radius;
	
	// Initialize the position of the mouse and the flag when the mouse is down the canvas
    this.mousedown = function (event) 
    {
        prev_pos = getMousePos(paint.getFrontCanvas(), event);
		paint.started = true; 
    }
	
	// Draw a line when the mouse is in motion
    this.mousemove = function (event) 
	{
       
		// Get the current position of the mouse
        var cur_pos = getMousePos(paint.getFrontCanvas(), event);

        // Draw lines
        if (paint.started) 
		{
            // Clear the canvas
			paint.getFrontCtx().clearRect(0, 0, paint.getFrontCanvas().width, paint.getFrontCanvas().height);
            x = prev_pos.x;
            y = prev_pos.y;
			
			radius = Math.sqrt(Math.pow(prev_pos.x - cur_pos.x, 2) + Math.pow(prev_pos.y - cur_pos.y, 2));
            paint.getFrontCtx().beginPath();
            paint.getFrontCtx().arc(x, y, radius, 0, 2 * Math.PI, false);
			// Draw every primitive declared
            paint.getFrontCtx().stroke();   
        }
    }
	
	// Stop drawing when the mouse is up
    this.mouseup = function (event) 
	{
        paint.started = false;
		paint.drawOnMainCanvas();
    }
};

/* TEXT FUNCTION */
setTool.text = function()
{
	
	// Create a textarea at the mouse position
    this.mousedown = function (event) 
    {
		// If the div is empty
		if($('#popup').length == 0)
		{
			// Get the mouse positions
			prev_pos = getMousePos(paint.getFrontCanvas(), event);
			
			// Create a textarea and a submit button
			var textArea = "<div id='popup' style='position:absolute;top:"+prev_pos.y+"px;left:"+prev_pos.x+"px;z-index:30;'><textarea id='comment' style='width:100px;height:50px;'></textarea>";
			var submit_button = "<input type='button' value='save' id='submit' onClick='displayText("+prev_pos.y+","+prev_pos.x+");'></div>";
		    var appendString = textArea + submit_button ;
					 
			// Append a textarea to the canvas where the user clicked
			$("#div_canvas").append(appendString);
		}
		else
		{
			// If the div is not empty, remove all
			$('#comment').remove();
            $('#submit').remove();
            $('#popup').remove();
			
			// Create again the textarea and the submit button
			// Get the mouse positions
			prev_pos = getMousePos(paint.getFrontCanvas(), event);
			
			// Create a textarea and a submit button
			var textArea = "<div id='popup' style='position:absolute;top:"+prev_pos.y+"px;left:"+prev_pos.x+"px;z-index:30;'><textarea id='comment' style='width:100px;height:50px;'></textarea>";
			var submit_button = "<input type='button' value='save' id='submit' onClick='displayText("+prev_pos.y+","+prev_pos.x+");'></div>";
		    var appendString = textArea + submit_button;
					 
			// Append a textarea to the canvas where the user clicked
			$("#div_canvas").append(appendString);
		}

    }
	
	
};

// Add text on the canvas
function displayText(y,x) 
{
	// Get the value of the textarea
	
	var tmptext = document.getElementById('comment').value; 
	var sizeAnnot = tmptext.length;
	var text = "";
	for(var i=0; i<sizeAnnot;i = i+10)
	{
		text = text+tmptext.slice(i,i*10)+"<br/>";
	}

	sizeAnnot = text.length;
	var add_div = "<div id='addiv' style='position:absolute;top:"+y+"px;left:"+x+"px;z-index:30; background-color:cyan;width:"+(sizeAnnot*3)+"'>"+text+"</div>";

	
	// Destroy the textarea, the button and the container
	$('#comment').remove();
    $('#submit').remove();
    $('#popup').remove();
	
	$("#div_canvas").append(add_div);
	
	//paint.getFrontCtx().fillText(text,x,y);
};

// Clear all the canvas 
setTool.clear = function ()
{
	$('#addiv').remove();
	paint.getCtx().clearRect(0, 0, paint.getCanvas().width, paint.getCanvas().height);

};

// Download the image
setTool.download = function ()
{
	var source = paint.getCanvas().toDataURL();
	Canvas2Image.saveAsPNG(paint.getCanvas());
}

