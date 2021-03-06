var mysql = require('mysql')
, fs      = require('fs')

function SolibSQL (host, database, username, password) {

    _connection = ''

    /**
    * Build the SolibSQL object connecting to the database and create tables if needed.
    *
    * @method __construct
    * @param {string} host Host address of the database
    * @param {string} database Name of the database
    * @param {string} username Database username
    * @param {string} password Database password for username
    * @return {void}
    */
    function __construct (host, database, username, password) {
        _connection = mysql.createConnection({
            host     : host,
            database : database,
            user     : username,
            password : password
        });

        _connection.connect(function (err) {
            if (err) throw err
        });

        var solibsql = "ressources/solib.sql"
        fs.exists(solibsql, function (exists) {
            if (exists) {
                fs.readFile(solibsql, 'utf-8', function (error, content) {
                    if (error) throw error
                    else {
                        // TODO read sql file to create tables
                        // _connection.query(content, function (err) {
                        //     if (err) throw err
                        // });
                    }
                });
            } else {
                console.log("No SQL file at path %s. SolibCore database may be missing.", solibsql)
            }
        });

        // _connection.query("CREATE TABLE IF NOT EXISTS `lessons` (`id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL COMMENT 'Name of the lesson (from Moodle)', `author` varchar(50) NOT NULL COMMENT 'Creator of the lesson (from Moodle)', `creation_time` int(10) NOT NULL COMMENT 'Creation time of the lesson (from Moodle)', `access_token` varchar(20) NOT NULL COMMENT 'token from moodle to connect to the course.', PRIMARY KEY (`id`))",
        //     function (err, rows) {
        //         if (err)
        //             console.log("Error connecting to database.\n" + err)
        //     }
        // )
    }  __construct(host, database, username, password);

    /**
    * Insert a new lesson in database. Called from moodle curl request.
    *
    * @method insertLesson
    * @param {string} name Lesson's name
    * @param {int} author The moodle id of the author
    * @param {json} users The user list authorized to see the lesson
    * @param {string} access_token Token to access the lesson from Moodle
    * @param {string} creation_time Creation time of the Solib lesson on Moodle
    * @return {void}
    */
    this.insertLesson = function (name, author, users, access_token, creation_time, callback) {
        _connection.query('insert into lessons(name, authorid, access_token, creation_time) values(?, ?, ?, ?)', [name, author, access_token, creation_time], function (err, result) {
            if (err)
                console.log("Error on insert lesson statement.\n" + err)
            else {
                users = JSON.parse(users)
                for (var u in users) {
                    _connection.query('insert into users(idmoodle, lastname, firstname) value(?, ?, ?)', [users[u].id, users[u].lastname, users[u].firstname], function (err, result) {
                        if (err)
                            console.log("Error on insert user statement.\n" + err)
                    });
                }
            }
            if (callback && typeof(callback) === 'function')
                callback(err, result)
        });
    };

    /**
    * Get the lesson with the specified id from the database.
    * Retrieve the name and all drawings. Convert a drawing from
    * string to SolibDrawing.
    *
    * @method getLesson
    * @param {int} lessonId The lesson id.
    * @return {void}
    */
    this.getLesson = function (lessonId, callback) {
        _connection.query("select *, (select count(*) from drawings where idlesson = ?) as nbDrawings, (select count(*) from slides where idlesson = ?) as nbSlides from lessons join slides join drawings on lessons.id = slides.idlesson and slides.id = drawings.idslide where lessons.id = ?", [lessonId, lessonId, lessonId], function (err, rows) {
            if (err)
                console.log("Error on select lesson statement.\n" + err)
            else if (rows.length > 0) {
                var lesson = {
                    id       : rows[0].id,
                    name     : rows[0].name,
                    authorId : rows[0].authorid,
                    slides   : []
                }
                var position = 0;
                // Build slides
                for (var s=0 ; s<rows.length ; s++) {
                    lesson.slides[rows[s].position] = {
                        id       : rows[s].idslide,
                        position : rows[s].position,
                        drawings : []
                    }

                    // Build drawings
                    var sum = 0, d = 0;
                    while(sum < rows[0].nbDrawings) {
                        if(lesson.slides[position].id == rows[sum].idslide) {
                            var points = rows[sum].points.split(';')
                            lesson.slides[rows[s].position].drawings.push({
                                radius  : rows[sum].radius,
                                color   : rows[sum].color,
                                idSlide : rows[sum].idslide,
                                points  : []
                            })

                            if(position != rows[s].position) {
                                position = rows[s].position
                                d = 0;
                            }
                            // Build points
                            for (var j=0 ; j < points.length ; j++) {
                                lesson.slides[position].drawings[d].points.push({ x: points[j].split(',')[0] ,
                                                                                  y: points[j].split(',')[1] });
                            }
                            d++;
                        }
                        sum++;
                    }
                }
            } // rows.length > 0
            if (callback && typeof(callback) === 'function')
                callback(lesson)
        });
    };

    /**
    * Retrieve a user accorgind to the given id
    *
    * @method getUser
    * @param {int} userId The user id
    * @return {void}
    */
    this.getUser = function (userId, callback) {
        _connection.query('select * from users where idmoodle = ?', [userId], function (err, rows) {
            if (err)
                console.log("Error on select user statement.\n" + err)
            else if (callback && typeof(callback) === 'function')
                callback(rows)
        });
    }

    /**
    * Insert a slide in a given lesson according to the lesson id param.
    *
    * @method insertSlide
    * @param {int} idLesson The lesson id
    * @param {SolibSlide} slide The SolibSlide object
    * @return {void}
    */
    this.insertSlide = function (idLesson, slide, callback) {
        _connection.query("insert into slides(idlesson, position) values(?, ?)", [idLesson, slide.position], function (err, resultSlide) {
            if (err)
                console.log("Error on insert slide statement.\n" + err)
            else {
                // Quick fix for slide with no drawing bug. Forced to add drawing.
                var fakePoints = [{ x: 0, y: 0 }]
                var fakeDrawing = {
                    idSlide  : resultSlide.insertId,
                    points   : fakePoints,
                    idLesson : idLesson,
                    radius   : 5,
                    color    : '#ffffff'
                }
                slide.id = resultSlide.insertId
                slide.drawings = new Array(fakeDrawing)
                solibSQL.insertDrawing(fakeDrawing, function (result) {
                    if (callback && typeof(callback) === 'function')
                        callback(slide)
                });
            }
        });
    };

    /**
    * Insert a drawing in DB for a given lesson at a given slide.
    * Convert a SolibDrawing object into a string.
    *
    * @method insertDrawing
    * @param {object} drawing The drawing
    * @return {void} 
    */
    this.insertDrawing = function (drawing, callback) {
        var pointsToString = ''
        for (var i=0 ; i<drawing.points.length ; i++) {
            if (/^[\d]+$/.test(drawing.points[i].x) && /^[\d]+$/.test(drawing.points[i].y))
                pointsToString += drawing.points[i].x + "," + drawing.points[i].y + ";"
        }
        if (pointsToString != '') {
            pointsToString = pointsToString.substring(0, pointsToString.length - 1) // remove last semicolon

            _connection.query("insert into drawings(idlesson, idslide, radius, color, points) values(?, ?, ?, ?, ?)", [drawing.idLesson, drawing.idSlide, drawing.radius, drawing.color, pointsToString], function (err, result) {
                if (err)
                    console.log("Error on insert drawing statement.\n" + err)
                else if (callback && typeof(callback) === 'function')
                    callback(result)
            });
        }
    };

    /**
    
    *
    *
    *
    */
    this.removeSlide = function (idSlide, callback) {
        _connection.query("DELETE FROM slides where id = ?", [idSlide], function (err, result) {
            if (err)
                console.log("Error on delete slide statement.\n" + err)
            else if (callback && typeof(callback) === 'function')
                callback()
        });
    };

    /**
    *
    *
    *
    */
    this.clearSlide = function (idSlide, idLesson, callback) {
        _connection.query("DELETE FROM drawings where idslide = ?", [idSlide], function (err, result) {
            if (err)
                console.log("Error on clear slide statement.\n" + err)
            else {
                // Quick fix for slide with no drawing bug. Forced to add drawing.
                var fakePoints = [{ x: 0, y: 0 }]
                var fakeDrawing = {
                    idSlide  : idSlide,
                    points   : fakePoints,
                    idLesson : idLesson,
                    radius   : 5,
                    color    : '#ffffff'
                }
                solibSQL.insertDrawing(fakeDrawing, function (result) {
                    if (callback && typeof(callback) === 'function')
                        callback()
                });
            }
        });
    };

    /**
    * Execute a query.
    *
    * @method query
    * @param {string} query The query to execute
    * @return {void}
    */
    this.query = function (query, params, callback) {
        _connection.query(query, params, function (err, result) {
            if (err)
                console.log("Error on SolibSQL query.\n" + err)
            else if (callback && typeof(callback) === 'function')
                callback(result)
        });
    };
}

exports.SolibSQL = SolibSQL