# CounterApp
This little application is a test for [Solib](https://github.com/ECE-Campus-Cluster/SoLib) using [Node.js](http://nodejs.org/) and [Socket.IO](http://socket.io/) to display a synchronized counter between multiple browsers. It requires Node.js, Socket.IO and [node-mysql](http://github.com/felixge/node-mysql) to be installed.

## How to use it
1. node.js can be downloaded [here](http://nodejs.org/download/).
To install socket.io and node-mysql, run the following commands in the CounterApp directory **or** any parent directory: 

```bash
npm install socket.io
```

```bash
npm install mysql@2.0.0-alpha7
```

You should now have a directory named `node_modules` with a socket.io and mysql folders in it.

2. Configure your app in config.js **and** the address and port of your Node.js server in the index.html `io.connection` function.

3. Run the server with the following command: `node server.js`.

4. Open your browser and go to `http://yourdomain:yourport` (address of your Node.js server). That's it.

You can also make the server run as a background process using: `nohup node server.js > output.log &`.

* By taping `/supersecretfunction` after your domain name and port number you will reset the counter to 0.
