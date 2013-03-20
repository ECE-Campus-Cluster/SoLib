# SolibCore

This is the Solib server: the core of Solib. It consists into a [Node.js](http://nodejs.org/) application. The population of this application must come from an external service. Moodle for the moment, since ECE is using it.

Solib uses [express.js](http://expressjs.com/) and [Socket.IO](http://socket.io/).

## Using it
While in development:
1. Run this command to install all Node.js required plugins:
```bash
npm install
```

2. Configure Solib in the config.js file. Don't forget the port number. It musts be provided in the `server address` field in the Moodle plugin too.

3. Run the server by typing:
```bash
node server.js
```

It should work.