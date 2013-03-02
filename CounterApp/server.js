var config = require('./config')
app        = require('http').createServer(handler).listen(config.port)
io         = require('socket.io').listen(app)
url        = require('url')
fs         = require('fs')
mysql      = require('./mysql')
file       = "/index.html"
counter    = 0

db = mysql.connect(config.host, config.database, config.username, config.password)

/**
* The function used by node.js to handle a request
*/
function handler(request, response) {
	var pathname = url.parse(request.url).pathname
	if (pathname == "/supersecretfunction") {
		counter = 0
		console.log("counter reset")
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

// io.socket events
io.sockets.on("connection", function(socket) {

	// On client connection, we must send the actual count value and it last update time
	socket.emit("updateval", { val: counter }); // sends to new client
	db.query('select timestamp from updates order by timestamp desc limit 1', function(err, rows) {
		if (err)
			console.log("Error connecting to mysql on select statement.\n" + err)
		else if (rows.length > 0)
			socket.emit("updatetime", { timestamp: rows[0].timestamp });
	});
	
	// Increment event
	socket.on("incr", function(data) {
		socket.broadcast.emit("updateval", { val: counter++ }); // sends to all clients except the new connection
		var timestamp = new Date()
		db.query('insert into updates(timestamp) values(?)', [timestamp], function(err, result) {
			if (err)
				console.log("Error connecting to mysql on insert statement.\n" + err)
			else
				io.sockets.emit("updatetime", { timestamp: timestamp }); // sends to all clients
		});
	});

});

console.log("Server has started.")