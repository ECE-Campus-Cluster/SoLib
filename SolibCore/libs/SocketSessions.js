/**
* A class to manage sessions of connected users with Socket.IO,
* assuming you have an id for each user. It handles different
* sockets for each user (basically the number of opened tabs).
*
* @author: thibaultCha
* @version: 1.0
*/

function SocketSessions ()
{
	this.connectedUsers = new Array()

	function __construct () {};

	/**
	* Add a user if he's new or add a socket if
	* he's already connected.
	*
	* @method addUser
	* @param  {user} User Object
	* @return {Array}
	*/
	this.addUser = function (user, socketID, callback) {
		var isPresent = false
		for (var i=0 ; i<this.connectedUsers.length ; i++) {
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
	* Remove a socket from a user. Remove the user too if
	* his latest socket has been removed. 
	*
	* @method removeSocket
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
		if (islast)
			this.removeUser(user)
		if (callback && typeof(callback) === "function")
			callback(islast, user)
	};

	/**
	* Remove a user.
	*
	* @method removeUser
	* @param  {user} user object
	* @return {void}
	*/
	this.removeUser = function  (user) {
		for (var i=0 ; i<this.connectedUsers.length ; i++) {
			if (this.connectedUsers[i].id == user.id)
				this.connectedUsers.splice(i, 1)
		}
	};
}

exports.SocketSessions = new SocketSessions()