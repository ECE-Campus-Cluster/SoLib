// connectedUsers example
/*
[{  id: '3',
    firstname: 'Thibault',
    lasname: 'Charbonnier',
    sockets: [ '-zyTqv8UL0xepTB_49Id', 'NpmFZ70hdupUH3GM49Ie' ],
    newsocket: 'vCXLSlhc4U-39TA_49Ic' // the last socket used to connect
}]
*/

// Good JS class template: http://labs.tomasino.org/2011/11/10/javascript-class-template/
function Sessions()
{
	this.connectedUsers = new Array();

	function __construct() {};

	/**
	* Add a user
	* @param  {user} user object
	* @return
	*/
	this.addUser = function (user, callback) {
		if (this.connectedUsers.length < 1) {
			this.connectedUsers.push(user)
		}
		else {
			for (var i=0 ; i<this.connectedUsers.length ; i++) {
				// Is already present so we just add the socket id
				if (this.connectedUsers[i].id == user.id)
					return this.connectedUsers[i].sockets.push(user.newsocket)
			}

			this.connectedUsers.push(user)
			delete this.connectedUsers[i].newsocket
		}

		if (callback && typeof(callback) === "function")
			callback(user)
	};

	/**
	* Remove a socket from a user
	* @param  {user} user object
	* @return {true} if sockets are still presents or {false} if it was the last one
	*/
	this.removeSocket = function (user, socketID, callback) {
		for (var i=0 ; i<this.connectedUsers.length ; i++) {
			if (this.connectedUsers[i].id == user.id) {
				for (var j=0 ; j<this.connectedUsers[i].sockets.length ; j++) {
					if (this.connectedUsers[i].sockets[j] == socketID) {
						this.connectedUsers[i].sockets.splice(j, 1)
						var islast = !this.connectedUsers[i].sockets.length > 0;
					}
				}	
			}
		}
		if (callback && typeof(callback) === "function")
			callback(islast)
	};

	/**
	* Remove a user
	* @param  {user} user object
	* @return {null}
	*/
	this.removeUser = function (user) {
		for (var i=0 ; i<this.connectedUsers.length ; i++) {
			if (this.connectedUsers[i].id == user.id)
				this.connectedUsers.splice(i, 1)
		}
	};
}

exports.SolibSessions = Sessions;