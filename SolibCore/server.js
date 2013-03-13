/* Server */
var express    = require('express')
app            = express()
ejs            = require('ejs')
io             = require('socket.io')
config         = require('./config')
sessions       = require('./sessions').Sessions

sessions.addUser("moi")

/* Utilities */
users = new Array()

/* *** */
app.configure(function () {
	app.set('views', __dirname + '/views') // html files
	app.engine('html', ejs.renderFile)
	app.use(express.bodyParser()) // for req.param
});

var sio = io.listen(app.listen(config.PORT)) // app creates http server and io listening on

app.get('/log', function(req, res) {
	var user          = new Object()
	user['id']        = req.param('id')
	user['firstname'] = req.param('firstname')
	user['lastname']  = req.param('lastname')
	users.push(user)
	sio.sockets.emit('listusers', { users: users }); // sends to all clients
  	res.render('index.html')
});

// TODO sio.on('connection', ...) to rewrite as in 'CounterApp' (sio instead of io)

console.log('Server is running.')