# CounterApp
This little application is a test using node.js and socket.io to display a synchronized counter between multiple browsers. It requires node.js, socket.io and [node-mysql](http://github.com/felixge/node-mysql) to be installed.

## How to use it
1. node.js can be downloaded [here](http://nodejs.org/download/).
To install socket.io and node-mysql, run the following command in the CounterApp directory: 

```bash
npm install socket.io
```

```bash
npm install mysql@2.0.0-alpha7
```

 You should now have a directory named `node_modules` with a socket.io and mysql folders in it.

2. Configure your app in config.js and the address and port in the index.html `io.connection` function.

3. Run the server with the following command: `node server.js`.

4. Open your browser and go to `http://yourdomain:yourport`. That's it.

You can also make the server run as a background process using: `nohup node server.js > output.log &`.

* By taping `/supersecretfunction` after your domain name and port number you will reset the counter to 0.
