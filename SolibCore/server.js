var config = require('./config')
app        = require('http').createServer(handler).listen(config.PORT)
io         = require('socket.io').listen(app)
path       = require('path')
fs         = require('fs')
users      = new Array()

/**
* The function used by node.js to handle a request
*/
function handler(request, response) {
	var filePath = '.' + request.url
	extname      = path.extname(filePath)
	contentType  = 'text/html'
	// Special cases
	switch (filePath) {
		case './':
			filePath = './index.html'
		break;
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
	
    console.log("new client:" + socket.id)

	socket.on("connect_from_moodle", function(data) {
        console.log("someone connected on moodle")
		users.push(data)
        io.sockets.emit("getusers", { users: users });
	});

});

console.log("Server has started.")