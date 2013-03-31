var SolibSlide = CGSGScene.extend({

        // Attributes
        self : '',
        _rootNode : '',

        /**
        *
        *
        */
        initialize : function (canvas) {
            // Call constructor of the parent : CGSGScene
            this._super(canvas)
            
            // TO have a ref to the object in callbacks.
            self = this

            // Fill the graph with your nodes
            this.createSolibCanvas()

            // Start to refresh the canvas
            // this method is from the framework
            this.startPlaying()
        },

        /**
        *
        *
        */
        createSolibSlide : function () {
            this.createRootNode()
            this.createTextNode(10, 10, "Text 1")
            this.createTextNode(20, 20, "Text 2")
            this.createTextNode(30, 30, "Text 3")
            this.createTextNode(40, 40, "Text 4")
        },

        /**
        * 
        *
        */
        createRootNode : function () {
            self._rootNode = new CGSGNode(0, 0, this.sceneGraph.context.canvas.clientWidth, this.sceneGraph.context.canvas.clientHeight)
            self._rootNode.onDblClick = function (cgEvent) {
                self.createTextNode(cgEvent.position[0].x, cgEvent.position[0].y, "Text")
            }

            this.sceneGraph.addNode(this._rootNode, null)
        },

        /**
        * The Solib way to create a Text node.
        *
        * @method createTextNode
        * @param {int} x The x position of the node
        * @param {int} y The y position of the node
        * @param {stirng} text The text of the node
        * @return {void}
        */
        createTextNode : function (x, y, text) {
            var textNode = new CGSGNodeText(x, y, text)
            textNode.isDraggable = true
            textNode.onDblClick = function(cgEvent) {
                textInput = document.createElement("input")
                textInput.style.position = "absolute"
                var nodeX = (textNode.getAbsoluteLeft() + cgEvent.event.target.offsetLeft)
                , nodeY   = (textNode.getAbsoluteTop() + cgEvent.event.target.offsetTop)
                textInput.style.left   = nodeX + "px"
                textInput.style.top    = nodeY + "px"
                textInput.style.width  = textNode.getAbsoluteWidth() + "px"
                textInput.style.height = textNode.getAbsoluteHeight() + "px"
                document.body.appendChild(textInput)
            }
            
            this.sceneGraph.addNode(textNode, self._rootNode)
        }
    }
);