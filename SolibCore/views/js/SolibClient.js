/**
* JavaScript canvas drawing handler for Solib.
*/
function SolibClient (canvas, socket) {

    SolibClient.PRECISION = 1

    // Socket.IO stuff
    var _socket
    , isTeacher = false

    // Canvas stuff
    var _canvas
    , _ctx
    , _ispainting = false
    , _oldX, _oldY, _precision = SolibClient.PRECISION
    , _drawing // The drawing object to fill when a user draws on canvas
    , slidesArray = new Array()
    , currentSlideId

    /**
    * Class constructor from canvas' id.
    * Take a Socket.IO socket object.
    *
    * @method __construct
    * @param {DOMElement} canvas The canvas element
    * @param {object} socket The Socket.IO socket
    * @return {void}
    */
    function __construct (canvas, socket) {
        _canvas  = canvas
        _socket  = socket
        _ctx     = _canvas.getContext('2d')
        _drawing = {
            idSlide : currentSlideId,
            points  : new Array()
        }
        _canvas.addEventListener("mousedown", mouseDown)
        _canvas.addEventListener("mousemove", draw)
        window.addEventListener("mouseup", mouseUp)
    } __construct(canvas, socket);

    this.setTeacher = function (boolean) {
        isTeacher = boolean
    }

    /**
    * Start the drawing when the mouse is pressed
    *
    * @method mouseDown
    * @param {object} event The event object
    * @return {void}
    */
    function mouseDown (event) {
        if (isTeacher) {
            _ispainting      = true
            _oldX            = event.offsetX
            _oldY            = event.offsetY
            _drawing.idSlide = currentSlideId
            _drawing.color   = $("#colorpicker").val()
            _drawing.radius  = document.getElementById('pencil_width').value
            _drawing.points.push({ x: _oldX, y: _oldY })
        }
    } mouseDown(event);

    /**
    * Draw pixel by pixel on canvas while mouseDown is binded. 
    *
    * @method draw
    * @param {object} event The event object
    * @return {void}
    */
    function draw (event) {
        if (_ispainting) {
            if (_precision == SolibClient.PRECISION) {
                _ctx.beginPath()
                _ctx.moveTo(_oldX, _oldY)
                _ctx.lineTo(event.offsetX, event.offsetY)
                _ctx.strokeStyle = _drawing.color
                _ctx.lineJoin = "round"
                _ctx.lineCap = "round"
                _ctx.lineWidth = _drawing.radius
                _ctx.stroke()
                _precision = 0
                _oldX = event.offsetX
                _oldY = event.offsetY
                _drawing.points.push({ x: _oldX, y: _oldY })
            } else {
                _precision++
            }
        }
    } draw(event);

    /**
    * Stop the mouse from drawing and send the drawing Array to Socket.IO
    *
    * @method mouseUp
    * @param {object} event The event object
    * @return {void}
    */
    function mouseUp (event) {
        if (_ispainting) {
            _ispainting = false
            _socket.emit('new_drawing', _drawing)
            _drawing.points = new Array()
        }
    } mouseUp(event);

    /**
    * PUBLIC METHOD
    * Render a drawing from the given points object
    *
    * @method renderDrawing
    * @param {drawing} drawing The drawing object from a slide of SolibLesson
    * @return {void}
    */
    this.renderDrawing = function (drawing) {
        if (drawing.points.length > 0) {
            _oldX = drawing.points[0].x
            _oldY = drawing.points[0].y
            for (var i=1 ; i<drawing.points.length ; i++) {
                _ctx.beginPath()
                _ctx.moveTo(_oldX, _oldY)
                _ctx.lineTo(drawing.points[i].x, drawing.points[i].y)
                _ctx.strokeStyle = drawing.color
                _ctx.lineJoin    = "round"
                _ctx.lineCap     = "round"
                _ctx.lineWidth   = drawing.radius
                _ctx.stroke()
                _oldX = drawing.points[i].x
                _oldY = drawing.points[i].y
            }
        }
    }

    /**
    * PUBLIC METHOD
    * Render a given slide and set the currentSlideId
    * to slide param's id.
    * 
    * @method renderSlide
    * @param {slide} The slide object from SolibLesson
    * @return {void}
    */
    this.renderSlide = function (slide) {
        currentSlideId = slide.id
        _ctx.clearRect(0, 0, _canvas.width, _canvas.height)
        for (var d=0 ; d<slide.drawings.length ; d++) {
            this.renderDrawing(slide.drawings[d])
        }
    }
}