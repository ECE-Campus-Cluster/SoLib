// Array of tools
var setTool = new Array();

// Last position of the mouse
var prev_pos;

//Annotations, for each annotation we attribute an id, the number of likes and the number of dislikes
var nbAnnotations = 0;
var numberLikes = 0;
var numberDisikes = 0;

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
	var numberLines=0;
	var j=0;
	for(var i=0; i<sizeAnnot;i=i)
	{
		j=i+30;
		//we check that we don't cut the world in two
		while(tmptext.charAt(j)!=" " && j>=i-29 && j<sizeAnnot)
			j=j-1;
		text = text+tmptext.slice(i,j)+"<br/>";
		numberLines++;
		i=j;
	}

	sizeAnnot = text.length;

	//we increase the number of annotations on the slide
	nbAnnotations++;
	//item that the user will use to display an annotation
	//var add_but = "<button type='button' id='myButton' onClick='showAnnot(this,"+nbAnnotations+");' style='top:"+y+"px;left:"+x+"px;'>n°"+nbAnnotations+"</button>";
	var add_but = "<button type='button' id='myButton' onClick='showAnnot(this,"+nbAnnotations+");' style='top:"+y+"px;left:"+x+"px;'>n°"+nbAnnotations+"</button>";
	
	//the annotation where we will change display to block to display and none to hide
	var add_div = "<div id='numb"+nbAnnotations+"'><div id='addiv' style='top:"+(y+10)+"px;left:"+x+"px;'><div id='authorName'>John Smith:</div><div id='annotationText'>"+text+"</div><div id='txtLikeDislike'>Dislikes</div><button type='button' id='likeButton' onClick='addDislike("+nbAnnotations+",this);'>"+numberDisikes+"</button><div id='txtLikeDislike'>Likes</div><button type='button' id='dislikeButton' onClick='addLike("+nbAnnotations+",this);'>"+numberLikes+"</button></div></div>";


	// Destroy the textarea, the button and the container
	$('#comment').remove();
    $('#submit').remove();
    $('#popup').remove();
	
	$("#div_canvas").append(add_but);
	$("#div_canvas").append(add_div);
	

  	var div = document.getElementById("numb"+nbAnnotations);
    div.style.display = "none"; // we hide the new annotation...
};


//found on http://www.siteduzero.com/forum/sujet/affichermasquer-div-78927
function showAnnot(bouton,id) 
{ 
	var tmp = "numb"+id;
  	var div = document.getElementById(tmp);
  	if(div.style.display=="none") { // Si le div est masqué...
    div.style.display = "block"; // ... on l'affiche...
    bouton.innerHTML = "-"+id; // ... et on change le contenu du bouton.
  } else { // S'il est visible...
    div.style.display = "none"; // ... on le masque...
    bouton.innerHTML = "n°"+id; // ... et on change le contenu du bouton.
  }
}

//LIKE AND DISLIKE ANNOTATION
function addDislike(id,bouton)
{
	numberDisikes++;
	bouton.innerHTML = numberDisikes;

}

function addLike(id,bouton)
{
	numberLikes++;
	bouton.innerHTML = numberLikes;

}

// Clear all the canvas 
setTool.clear = function ()
{
	for(var i=0; i<=nbAnnotations ; i++)
	{
		$('#numb'+i).remove();
		$('#myButton').remove();
	}
	nbAnnotations=0;
	paint.getCtx().clearRect(0, 0, paint.getCanvas().width, paint.getCanvas().height);

};

// Download the image
setTool.download = function ()
{
	window.location = paint.getCanvas().toDataURL("image/png");
}

