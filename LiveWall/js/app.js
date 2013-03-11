/*
To create a new class that inherit from a class "Parent":
	var MyClass = Parent.extend(
	{
		//constructor :
		initialize : function(param1, param2) {
			//each properties defined with "this." is global to the class
			this.x = param1;
		},

		myMethod : function(x) {
		}
	}
	);

Then, to instanciate it:
	var instance = new MyClass(23, 54);
*/
var App = CGSGScene.extend(
	{
		// 'initialize' is the constructor. It takes here 1 parameter : a handler to the canvas HTMLElement
		initialize : function (canvas) {
			//call constructor of the parent : CGSGScene
			this._super(canvas);

			//Fill the graph with your nodes
			this.createSolibScene();

			//start to play !
			//this method is from the framework
			this.startPlaying();
		},

		/**
		 * Just create a single node (a square node)
		 * @method createScene
		 */
		createScene : function () {
			//create a square node : x, y, width, height
			var squareNode = new CGSGNodeSquare(60, 20, 200, 200);
			//add some nice properties
			squareNode.isResizable = true;
			squareNode.isDraggable = true;

		// !!! never use squareNode.position.x = n;
		// use squareNode.translateTo(n, m) method instead (or .translateWith(x, y) or .translateBy(x, y)
		//
		// In the same way, do not use node.rotation.angle = x, node.scale.x = x neither node.dimension?width=w
		// always use the rotateBy, rotateWith, rotateTo, scaleBy, scaleWith, scaleTo, resizeWith, resizeBy, resizeTo methods.

			//add the square node as the root of the graph
			this.sceneGraph.addNode(squareNode, null);
		},
		
		createSolibScene : function () {
			var textNode = new CGSGNodeText(60, 20, "Drag me");
			
			textNode.isDraggable = true;
			textNode.onDblClick = function(event) {
				textInput = document.createElement("input");		
				textInput.style.position = "absolute";
				textInput.style.left     = textNode.getAbsoluteLeft() + "px";
				textInput.style.top      = textNode.getAbsoluteTop() + "px";
				textInput.style.width    = textNode.getAbsoluteWidth() + "px";
				textInput.style.height   = textNode.getAbsoluteHeight() + "px";
							
				document.body.appendChild(textInput);
			}
			
			this.sceneGraph.addNode(textNode, null)
		}

	}
);