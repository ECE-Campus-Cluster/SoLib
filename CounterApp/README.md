# CounterApp
This little application is a test using node.js and socket.io to display a synchronized counter between multiple browsers. It requires node.js and socket.io to be installed. 

## How to use it
1. node.js can be downloaded [here](http://nodejs.org/download/).
To install socket.io, run the following command in the CounterApp directory: `npm install socket.io`. You should now have a directory named node_modules with socket.io in it.

2. Configure the port you want to use in server.js line 1 and the address and port in index.html line 24.

3. Run the server with the following command: `node server.js`.

4. Open your browser and go to `http://yourdomain:yourport`. That's it.

You can also make the server run as a background process using: `nohup node server.js > output.log &`.

* By taping `/supersecretfunction` after your domain name and port number you will reset the counter to 0.