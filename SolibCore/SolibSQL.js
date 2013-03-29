var mysql = require('mysql')

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

        _connection.query("CREATE TABLE IF NOT EXISTS `lessons` (`id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL COMMENT 'Name of the lesson (from Moodle)', `author` varchar(50) NOT NULL COMMENT 'Creator of the lesson (from Moodle)', `creation_time` int(10) NOT NULL COMMENT 'Creation time of the lesson (from Moodle)', `access_token` varchar(20) NOT NULL COMMENT 'token from moodle to connect to the course.', PRIMARY KEY (`id`))",
            function (err, rows) {
                if (err)
                    console.log("Error connecting to database.\n" + err)
            }
        )
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
                console.log("Error connecting to mysql on insert statement.\n" + err)
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
                console.log("Error connecting to mysql on select statement.\n" + err)
            else if (callback && typeof(callback) === 'function')
                callback(rows)
        });
    }

    /**
    * Execute a query.
    *
    * @method query
    * @param {string} query The query to execute
    * @return {void}
    */
    this.query = function (query, params, callback) {
        _connection.query(query, params, function (err, result) {
            if (callback && typeof(callback) === 'function') {
                callback(err, result)
            }
        });
    }
}

exports.SolibSQL = SolibSQL