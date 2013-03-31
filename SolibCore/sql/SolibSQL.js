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

        var solibsql = "sql/solib.sql"
        fs.exists(solibsql, function (exists) {
            if (exists) {
                fs.readFile(solibsql, 'utf-8', function (error, content) {
                    if (error) throw error
                    else {
                        // TODO
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
    * @param {string} author Lesson's author
    * @param {string} access_token Token to access the course from Moodle
    * @param {string} creation_time Creation time of the Solib lesson on Moodle
    * @return {void}
    */
    this.insertLesson = function (name, author, access_token, creation_time, callback) {
        _connection.query('insert into lessons(name, author, access_token, creation_time) values(?, ?, ?, ?)', [name, author, access_token, creation_time], function (err, result) {
            if (err)
                console.log("Error on insert lesson statement.\n" + err)
            else if (callback && typeof(callback) === 'function')
                callback(err, result)
        });
    };

    /**
    * Get the lesson with the specified id from the database.
    *
    * @method getLesson
    * @param {int} lessonId The lesson id.
    * @return {void}
    */
    this.getLesson = function (lessonId, callback) {
        _connection.query("select * from lessons where id = ?", [lessonId], function (err, rows) {
            if (err) 
                console.log("Error on select lesson statement.\n" + err)
            else if (callback && typeof(callback) === 'function')
                callback(rows)
        });
    };

    /**
    * Insert a drawing in DB for a given lesson.
    * Convert a SOlibDrawing object into a string.
    *
    * @method insertDrawing
    * @param {int} lessonId The id of the lesson where the drawing has been made
    * @param {object} points The drawing 
    * @return {void} 
    */
    this.insertDrawing = function (lessonId, points, callback) {
        var pointsToString = ''
        for (var i=0 ; i<points.length ; i++) {
            if (/^[\d]+$/.test(points[i].x) && /^[\d]+$/.test(points[i].y))
                pointsToString += points[i].x + "," + points[i].y + ";"
        }
        if (pointsToString != '') {
            pointsToString = pointsToString.substring(0, pointsToString.length - 1) // remove last semicolon
            
            _connection.query("insert into drawings(idlesson, points) values(?, ?)", [lessonId, pointsToString], function (err, result) {
                if (err)
                    console.log("Error on insert drawing statement.\n" + err)
                else if (callback && typeof(callback) === 'function')
                    callback(result)
            });
        }
    };

// TODO: MUST RETRIEVE LESSON DRAWINGS IN THE GETLESSON QUERY
    // /**
    // * Get all drawings from DB for a given lesson.
    // * Convert the drawing from a string to a SolibDrawing object.
    // *
    // * @method getDrawings
    // * @param {int} lessonId The lesson's id
    // * @return {void}
    // */
    // this.getDrawings = function (lessonId, callback) {
    //     var drawings = ''
    //     _connection.query("select points from drawings where idlesson = ?", [lessonId], function (err, rows) {
    //         if (err)
    //             console.log("Error on select drawing statement.\n" + err)
    //         else {
    //             if (rows.length > 0) {
    //                 for (var i=0 ; i<rows.length ; i++) {
    //                     var points = rows[i].points.split(';')
    //                     console.log(points)
    //                 }
    //             }
    //         }
    //     });
    // }

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