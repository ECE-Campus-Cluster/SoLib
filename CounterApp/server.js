var app  = require("http").createServer(handler).listen(25000)
io       = require('socket.io').listen(app)
url      = require("url")
fs       = require('fs')
file     = "/index.html"
counter  = 0;

function handler(request, response) {
	var pathname = url.parse(request.url).pathname
	if (pathname == "/supersecretfunction") {
		counter = 0
	}

	fs.readFile(__dirname + file, function(error, data) {
		if (error) {
			response.writeHead(500)
			return response.end("Error loading " + file)
		}
		response.writeHead(200)
		response.end(data)
	});
}

io.sockets.on("connection", function(socket) {
	socket.emit("update", { val: counter });
	socket.on("incr", function(data) {
		counter++
		socket.broadcast.emit("update", { val: counter });
	});
});

console.log("Server has started.")