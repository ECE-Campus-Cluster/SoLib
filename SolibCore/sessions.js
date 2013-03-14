// connectedUsers example
/*{
	{
		id: 1,
		firstname: "Barrack",
		lastname: "Obama",
		sockets: {
			5765687,
			5768890
		}
	}
}
*/

// Good JS class template: http://labs.tomasino.org/2011/11/10/javascript-class-template/
function Sessions()
{
	this.connectedUsers = new Array();

	function __construct() {};

	this.addUser = function (session) {
		if (this.connectedUsers.length < 1) {
			console.log('one')
			this.connectedUsers.push(session)
		}
		else {
			console.log('more')
			for (var i=0 ; i<this.length ; i++) {
				console.log(this.connectedUsers[i].id+" "+session.id)
				if(this.connectedUsers[i].id == session.id) {
					console.log('same id')
					// insert socket
				} else {
					console.log('new id')
					this.connectedUsers.push(session)
				}
			}
		}
	};
}

exports.SolibSessions = Sessions;