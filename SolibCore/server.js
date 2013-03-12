var express = require('express')
app         = express()

app.get('/', function(req, res) {
	console.log("received get request")
  	res.send('hello world')
});

app.post('/user', function(req, res) {
	console.log(req)
  	res.send('$USER received')
});

app.listen(8080)

console.log("Server is running.")