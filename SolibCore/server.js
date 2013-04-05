// Node.js plugins
var path = require('path')
http     = require('http')
express  = require('express')
app      = express()
ejs      = require('ejs')
io       = require('socket.io')
// Solib tools
config          = require('./config')
SolibSQL        = require('./sql/SolibSQL').SolibSQL
SolibSessions   = require('./Sessions').SolibSessions
const hashStore = 'solib_secret'

solibSessions = new SolibSessions()
solibSQL = new SolibSQL(config.DBHOST, config.DBNAME, config.DBUSERNAME, config.DBPASSWORD)

/* session & cookies express side */
var sessionStore = new express.session.MemoryStore({ reapInterval: 60000 * 10 })

/* expressjs config */
app.configure(function () {
    app.set('port', config.PORT)
    app.set('views', __dirname + '/views') // html files
    app.engine('html', ejs.renderFile)
    app.use(express.static(__dirname + '/views'))
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
server.listen(app.get('port'), function () {
    console.log("Solib server running on port %d", app.get('port'))
});

app.post('/newlesson', function (req, res) {
    solibSQL.insertLesson(req.param('name'), req.param('author'), req.param('access_token'), req.param('creation_time'), function (err, resultLesson) {
        if (err) {
            console.log('Error connecting to mysql on insert statement: \n%s', err)
            res.send(500, { text: "Error inserting course " + req.param('name') + " please try again." });
        } else {
            console.log("Inserted course '%s'", req.param('name'))
            solibSQL.query("insert into slides(idlesson, position) values(?, ?)", [resultLesson.insertId, 0], function (resultSlide) {
                var fakePoints = new Array()
                fakePoints.push({x: 0, y: 0})
                solibSQL.query("insert into drawings(idlesson, idslide, points) values(?, ?, ?)", [resultLesson.insertId, resultSlide.insertId, fakePoints], function (resultDrawing) {
                    if (resultDrawing) {
                        res.send(200, { text: "SolibCore: insterted course '" + req.param('name') + "'.", 
                            solibcoreid: resultLesson.insertId });
                    }
                });
            });
        }
    });
});

app.get('/lesson', function (req, res) {
    if (req.param('id_lesson') && req.param('access_token') && req.param('user_id') && req.param('firstname') && req.param('lastname'))
    {
        solibSQL.query('select access_token from lessons where id = ?', [req.param('id_lesson')], function (rows) {
            if (rows.length > 0) {
                if (req.param('access_token') == rows[0].access_token) {
                    // Connection established.
                    req.session.user           = new Object()
                    req.session.user.id        = req.param('user_id')
                    req.session.user.firstname = req.param('firstname')
                    req.session.user.lastname  = req.param('lastname')
                    req.session.lessonid       = req.param('id_lesson')
                    req.session.user.sockets   = new Array()
                    res.render('index.html')
                }
                else {
                    res.send(403, "Access forbidden. You must login from your Moodle Solib activity.")
                }
            }
            else {
                res.send(404, "Unknown lesson id.")
            }
        });
    }
    else {
        res.send(404, "Missing parameters. Are you trying to login from Moodle?")
    }
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
    //console.log("New user: " + socket.id + " " + session.user.lastname)

    // Add the user to the connected list
    solibSessions.addUser(session.user, socket.id, function () {
        sio.sockets.emit("list_users", { users: solibSessions.connectedUsers }); // send to all clients
    });
    
    // Retrieve the lesson. Here we can assume that the lesson exists. 
    solibSQL.getLesson(session.lessonid, function (lesson) {
        if (lesson) {
            socket.emit("lesson_infos", { lesson: lesson })
        }
    });
    
    socket.on('new_slide', function (data) {
        var slide = {
            position : data.position
        }
        solibSQL.insertSlide(session.lessonid, slide, function (resultSlide) {
            var fakePoints = new Array()
            fakePoints.push({x: 0, y: 0})
            var drawing = {
                idSlide : resultSlide.insertId,
                points  : fakePoints
            }
            solibSQL.insertDrawing(drawing, function (result) {
                socket.emit('new_slide', slide)
            });
        });
    });

    socket.on('new_drawing', function (data) {
        // TODO: check user's rights
        data.drawing.idLesson = session.lessonid
        solibSQL.insertDrawing(data.drawing, function (result) {
             socket.broadcast.emit('new_drawing', data.drawing)
        });
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