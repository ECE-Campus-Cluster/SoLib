/**
* JavaScript canvas drawing handler for Solib.
*/
function SolibClient (canvasId, socket) {

    Solib.PRECISION = 1

    // Socket.IO stuff
    var _socket

    // Canvas stuff
    var _canvas
    , _ctx
    , _ispainting = false
    , _oldX, _oldY, _precision = Solib.PRECISION
    , _drawing // Array of canvas points

    /**
    * Class constructor from canvas' id.
    * Take a Socket.IO socket object.
    *
    * @method __construct
    * @param {string} canvasId The html canvas's id 
    * @param {object} socket The Socket.IO socket
    * @return {void}
    */
    function __construct (canvasId, socket) {
        _canvas = document.getElementById(canvasId)
        if (_canvas) {
            _socket = socket
            _ctx = _canvas.getContext('2d')
            _canvas.addEventListener("mousedown", mouseDown)
            _canvas.addEventListener("mousemove", draw)
            window.addEventListener("mouseup", mouseUp)
        } else {
            console.log('No canvas with id: %s', canvasId)
        }
    } __construct(canvasId, socket);

    /**
    *
    *
    */
    function mouseDown (event) {
        _ispainting = true
        _drawing    = new Array()
        _oldX       = event.offsetX
        _oldY       = event.offsetY
        _drawing.push({ x: _oldX, y: _oldY })
    } mouseDown(event);

    /**
    *
    *
    */
    function draw (event) {
        if (_ispainting) {
            if (_precision == Solib.PRECISION) {
                //console.log(event.offsetX + " " + event.offsetY)
                _ctx.beginPath()
                _ctx.moveTo(_oldX, _oldY)
                _ctx.lineTo(event.offsetX, event.offsetY)
                _ctx.strokeStyle = "#333333"
                _ctx.stroke()
                _precision = 0
                _oldX = event.offsetX
                _oldY = event.offsetY
                _drawing.push({ x: _oldX, y: _oldY })
            } else {
                _precision++
            }
        }
    } draw(event);

    /**
    * Stop the mouse from drawing and send the drawing Array to Socket.IO
    *
    */
    function mouseUp (event) {
        if (_ispainting) {
            _ispainting = false
            _socket.emit('new_drawing', { points: _drawing })
        }
    } mouseUp(event);

    /**
    * PUBLIC METHODS
    *
    *
    */
    this.drawFromPoints = function (points) {
        _oldX = points[0].x
        _oldY = points[0].y
        for (var i=1 ; i<points.length ; i++) {
            _ctx.beginPath()
            _ctx.moveTo(_oldX, _oldY)
            _ctx.lineTo(points[i].x, points[i].y)
            _ctx.strokeStyle = "#333333"
            _ctx.stroke()
            _oldX = points[i].x
            _oldY = points[i].y
        }
    }
}