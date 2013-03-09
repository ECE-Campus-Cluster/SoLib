var config = require('./config')
app        = require('http').createServer(handler).listen(config.PORT)
io         = require('socket.io').listen(app)
path       = require('path')
fs         = require('fs')
text       = ''

/**
* The function used by node.js to handle a request
*/
function handler(request, response) {
	var filePath = '.' + request.url
	extname      = path.extname(filePath)
	contentType  = 'text/html'
	
	if (filePath == './') {
		filePath = './index.html'
	}
	
	// Static files
    switch (extname) {
        case '.js':
            contentType = 'text/javascript'
        break;
        case '.css':
            contentType = 'text/css'
        break;
    }

	fs.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500)
					response.end("Error loading " + filePath)
                } else {
                    response.writeHead(200, {'Content-Type': contentType });
                    response.end(content, 'utf-8')
                }
            });
        } else {
            response.writeHead(404)
            response.end("Couldn't find " + filePath)
        }
    });
}

// io.socket events
io.sockets.on("connection", function(socket) {

	socket.emit("updatetext", { text: text }); // sends to new client

	socket.on("changetext", function(data) {
		text = data.text
		socket.broadcast.emit("updatetext", { text: text }); // sends to all clients except the new connection
	});

});

console.log("Server has started.")