var app  = require("http").createServer(handler).listen(25000)
io       = require('socket.io').listen(app)
url      = require("url")
fs       = require('fs')
mysql    = require('mysql')

file       = "/index.html"
counter    = 0;
connection = mysql.createConnection({
	host     : 'localhost',
	database : 'solib',
	user     : 'root',
	password : 'root', // Carefull
});

/**
* The function used by node.js to handle a request
*/
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

// io.socket events
io.sockets.on("connection", function(socket) {

	// On client connection, we must send the actual count value and it last update time
	socket.emit("updateval", { val: counter });
	connection.query('select timestamp from updates order by timestamp desc limit 1', function(err, rows) {
		if (err) {
			console.log("Error connecting to mysql on select statement. Error is: " + err)
		} else if (rows.length > 0){
			console.log("Last update is:" + rows[0].timestamp)
			socket.emit("updatetime", { val: rows[0].timestamp });
		}
	});
	
	// Increment event
	socket.on("incr", function(data) {
		counter++
		socket.broadcast.emit("updateval", { val: counter });
		connection.query('insert into updates(timestamp) values(?)', [new Date().getTime()], function(err, result) {
			if (err) {
				console.log("Error connecting to mysql on insert statement. Error is: " + err)
			} else {
				console.log("inserted: " + result.timestamp)
				socket.broadcast.emit("updatetime", { timestamp: result})
			}
		});
	});
});

console.log("Server has started.")