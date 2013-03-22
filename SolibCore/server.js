/* Server */
var path = require('path')
http     = require('http')
express  = require('express')
app      = express()
ejs      = require('ejs')
io       = require('socket.io')
SolibSQL = require('./mysql').SolibSQL
config   = require('./config')
solibSessions = require('./sessions')
const hashStore = 'solib_secret'

solibSessions = new solibSessions.SolibSessions();
solibSQL = new SolibSQL(config.DBHOST, config.DBNAME, config.DBUSERNAME, config.DBPASSWORD)

/* session & cookies express side */
var sessionStore = new express.session.MemoryStore({ reapInterval: 60000 * 10 })

/* expressjs config */
app.configure(function () {
	app.set('port', config.PORT)
	app.set('views', __dirname + '/views') // html files
	app.engine('html', ejs.renderFile)
	app.use(express.bodyParser()) // for req.param
	app.use(express.methodOverride())
	app.use(express.cookieParser())
	app.use(express.session({
		store: sessionStore,
		key: 'sid',
		secret: hashStore
	}));
});

/* expressjs init */
var server = http.createServer(app)
var sio    = io.listen(server)
server.listen(app.get('port'), function() {
	console.log("Solib server running on port %d", app.get('port'))
});

app.post('/newlesson', function (req, res) {
	solibSQL.insertLesson(req.param('name'), req.param('author'), req.param('access_token'), req.param('creation_time'), function (err, result) {
		if (err) {
			console.log('Error connecting to mysql on insert statement: \n%s', err)
			res.send(500, { text: "Error inserting course " + req.param('name') + " please try again." });
		} else {
			console.log("Inserted course '%s'", req.param('name'))
			res.send(200, { text: "SolibCore: insterted course '" + req.param('name') + "'.", 
			         		solibcoreid: result.insertId });
		}
	});
});

app.get('/log', function (req, res) {
	// we build the user object but we are still waiting the socket id, so we wait for socket.on('connection')
	req.session.user           = new Object()
	req.session.user.id        = req.param('id')
	req.session.user.firstname = req.param('firstname')
	req.session.user.lastname  = req.param('lastname')
	req.session.user.sockets   = new Array()
	//sio.sockets.emit('listusers', { users: users }); // sends to all clients
  	res.render('index.html')
});

/* setting authorization method for socket.io */
sio.configure(function () {
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
			if (handshakeData.session.user) return callback(null, true)
			else return callback('socket.io: session.user not found', false)
		});
	});
});

/* socket.io events */
sio.on('connection', function (socket) {
	var session = socket.handshake.session // get express session
	console.log(socket.id + " " + session.user.lastname)
	solibSessions.addUser(session.user, socket.id, function () {
		console.log(solibSessions.connectedUsers)
		sio.sockets.emit("list_users", { users: solibSessions.connectedUsers }); // send to all clients
	});

	/* disconnect event */
	socket.on('disconnect', function () {
	    solibSessions.removeSocket(socket.id, function (lastsocket, user) {
	    	if (lastsocket) {
	    		solibSessions.removeUser(session.user)
	    		socket.broadcast.emit("user_disconnected", { user: user });
	    	}
	    });
	});
});