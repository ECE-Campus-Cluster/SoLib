// connectedUsers example
/*
[{  id: '3',
    firstname: 'Thibault',
    lasname: 'Charbonnier',
    sockets: [ '-zyTqv8UL0xepTB_49Id', 'NpmFZ70hdupUH3GM49Ie' ],
}]
*/

// Good JS class template: http://labs.tomasino.org/2011/11/10/javascript-class-template/
function SolibSessions ()
{
	this.connectedUsers = new Array();

	function __construct () {};

	/**
	* Add a user if he's new or add a socket if he already connected.
	* @param  {user} user object
	* @return {Array}
	*/
	this.addUser = function (user, socketID, callback) {
		var isPresent = false;
		for (var i=0 ; i<this.connectedUsers.length ; i++) {
			// Is already present so we just add the socket id
			if (this.connectedUsers[i].id == user.id) {
				this.connectedUsers[i].sockets.push(socketID)
				isPresent = true
			}
		}
		if (!isPresent) {
			user.sockets.push(socketID)
			this.connectedUsers.push(user)
		}
		if (callback && typeof(callback) === "function")
			callback(user)
	};

	/**
	* Remove a socket from a user.
	* @param  {socketID} id of the socket to remove
	* @return {void}
	*/
	this.removeSocket = function (socketID, callback) {
		for (var i=0 ; i<this.connectedUsers.length ; i++) {
			for (var j=0 ; j<this.connectedUsers[i].sockets.length ; j++) {
				if (this.connectedUsers[i].sockets[j] == socketID) {
					this.connectedUsers[i].sockets.splice(j, 1)
					var islast = !this.connectedUsers[i].sockets.length > 0;
					var user   = this.connectedUsers[i];
				}
			}
		}
		if (callback && typeof(callback) === "function")
			callback(islast, user)
	};

	/**
	* Remove a user.
	* @param  {user} user object
	* @return {void}
	*/
	this.removeUser = function (user) {
		for (var i=0 ; i<this.connectedUsers.length ; i++) {
			if (this.connectedUsers[i].id == user.id)
				this.connectedUsers.splice(i, 1)
		}
	};
}

exports.SolibSessions = SolibSessions;