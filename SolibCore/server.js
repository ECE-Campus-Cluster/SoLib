// Node.js plugins
//var path = require('path')
var http  = require('http')
, express = require('express')
, app     = express()
, ejs     = require('ejs')
, io      = require('socket.io')
// Solib tools
, config        = require('./config')
, SolibSQL      = require('./sql/SolibSQL').SolibSQL
, SolibSessions = require('./Sessions').SolibSessions
const hashStore = 'solib_secret'

solibSessions = new SolibSessions()
solibSQL = new SolibSQL(config.DBHOST, config.DBNAME, config.DBUSERNAME, config.DBPASSWORD)

/* Session & cookies express side */
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
        store  : sessionStore,
        key    : 'sid',
        secret : hashStore
    }));
});

/* expressjs init */
var server = http.createServer(app)
var sio    = io.listen(server)
server.listen(app.get('port'), function () {
    console.log("Solib server running on port %d", app.get('port'))
});

app.post('/newlesson', function (req, res) {
    solibSQL.insertLesson(req.param('name'), req.param('author'), req.param('users'), req.param('access_token'), req.param('creation_time'), function (err, resultLesson) {
        if (err) {
            console.log('Error connecting to mysql on insert statement: \n%s', err)
            res.send(500, { text: "Error inserting course " + req.param('name') + " please try again." });
        } else {
            console.log("Inserted course '%s'", req.param('name'))
            // Insert first empty slide
            solibSQL.query("insert into slides(idlesson, position) values(?, ?)", [resultLesson.insertId, 0], function (resultSlide) {
                 // Quick fix for slide with no drawing bug. Forced to add drawing.
                var fakePoints = [{x: 0, y: 0}]
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
    if (req.param('id_lesson') && req.param('user_id'))
    {
        solibSQL.getUser(rows) {
            if (rows.length > 0) {
                    // Connection established.
                    req.session.user = {
                        id        : req.param('user_id'),
                        firstname : rows[0].firstname,
                        lastname  : rows[0].lastname,
                        //role      : 
                        sockets   : []
                    }
                    req.session.lessonid = req.param('id_lesson')
                    res.render('index.html')
            }
            else {
                res.send(403, "Access forbidden. You must login from your Moodle Solib activity.")
                //res.send(404, "Unknown lesson id.")
            }
        });
    }
    else {
        res.send(400, "Bad request. You should login from Moodle.?")
    }
});

/* Setting authorization method for socket.io */
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

    // Add the user to the connected list
    solibSessions.addUser(session.user, socket.id, function () {
        sio.sockets.emit("list_users", solibSessions.connectedUsers); // send to all clients
    });

    // Retrieve the lesson. Here we can assume that the lesson exists. 
    solibSQL.getLesson(session.lessonid, function (lesson) {
        if (lesson) socket.emit("lesson_infos", lesson)
    });
    
    socket.on('new_slide', function (data) {
        var slide = {
            position : data.position
        }
        solibSQL.insertSlide(session.lessonid, slide, function (resultSlide) {
            // Quick fix for slide with no drawing bug. Forced to add drawing.
            var fakePoints = [{x: 0, y: 0}]
            var drawing = {
                idSlide  : resultSlide.insertId,
                points   : fakePoints,
                idLesson : session.lessonid,
                radius   : 5,
                color    : '#333333'
            }
            solibSQL.insertDrawing(drawing, function (result) {
                sio.sockets.emit('new_slide', slide) // send new slides to all clients
            });
        });
    });

    socket.on('new_drawing', function (drawing) {
        // TODO: check user's rights
        drawing.idLesson = session.lessonid
        solibSQL.insertDrawing(drawing, function (result) {
             socket.broadcast.emit('new_drawing', drawing)
        });
    });

    // Disconnect event
    socket.on('disconnect', function () {
        solibSessions.removeSocket(socket.id, function (lastsocket, user) {
            if (lastsocket) {
                solibSessions.removeUser(session.user)
                socket.broadcast.emit("user_disconnected", user);
            }
        });
    });
});