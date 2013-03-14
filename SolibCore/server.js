/* Server */
var path = require('path')
http     = require('http')
express  = require('express')
app      = express()
ejs      = require('ejs')
io       = require('socket.io')
config   = require('./config')
//sessions       = require('./sessions').Sessions
const hashStore = 'solib_secret'

/* expressjs config */
app.configure(function () {
	app.set('port', config.PORT)
	app.set('views', __dirname + '/views') // html files
	app.engine('html', ejs.renderFile)
	app.use(express.bodyParser()) // for req.param
	app.use(express.methodOverride())
});

/* session & cookies express side */
var sessionStore = new express.session.MemoryStore({ reapInterval: 60000 * 10 })
app.use(express.cookieParser())
app.use(express.session({
	store: sessionStore,
	key: 'sid',
	secret: hashStore
}));

/* expressjs init */
app.use(app.router)
var server = http.createServer(app)
var sio    = io.listen(server)
server.listen(app.get('port'), function() {
	console.log("Solib server running on port %d", app.get('port'))
});

app.get('/log', function(req, res) {
	var user          = new Object()
	user['id']        = req.param('id')
	user['firstname'] = req.param('firstname')
	user['lastname']  = req.param('lastname')
	req.session.user  = user
	//users.push(user)
	//sio.sockets.emit('listusers', { users: users }); // sends to all clients
  	res.render('index.html')
});

/* setting authorization method for socket.io */
sio.configure(function (){
	sio.set('authorization', function (handshakeData, callback) {
		// cookies
		if (!handshakeData.headers.cookie) return callback('socket.io: cookie not found.', false)
		// cookies and sessionId, https://github.com/DanielBaulig/sioe-demo/blob/master/app.js
		var signedCookies = require('express/node_modules/cookie').parse(handshakeData.headers.cookie)
		handshakeData.cookies = require('express/node_modules/connect/lib/utils').parseSignedCookies(signedCookies, hashStore)
		// sessionId username
		sessionStore.get(handshakeData.cookies['sid'], function(err, session) {
			if (err || !session) return callback('socket.io: session not found.', false)
			// session handshakeData
			handshakeData.session = session
			if (handshakeData.session.user) {
				return callback(null, true)
			} else {
				return callback('socket.io: session.user not found', false)
			}
		});
	});
});

/* socket.io events */
sio.on('connection', function (client) {
	console.log(client.handshake.session)
});