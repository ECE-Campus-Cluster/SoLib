var app  = require("http").createServer(handler).listen(8080)
io       = require('socket.io').listen(app)
fs       = require('fs')
file     = "/index.html"
counter  = 0

function handler(request, response) {
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
	socket.on("incr", function() {
		counter++
		socket.emit("update", { val: counter })
	});
});

console.log("Server has started.")