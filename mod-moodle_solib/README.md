# moodle-mod_solib
The required plugin to use Solib. This plugin will allow you to create a Solib activity in one of your Moodle courses, and this activity will contains a link with authentication information to connect to the Solib server.

## How to use it
1. Install. Open your Moodle installation. Create a directory named `solib` at `moodle/mod/solib`. Place all the content of mod-moodle_solib/ in this new directory. Open your Moodle in a browser, you should now have an alert from Moodle asking you to install the new plugin.

2. Create an activity. Open one of your courses and add an activity to it. You should see 'Solib' in the list of possible activities, click it. The plugin will now ask you the name of your course and the 'server address'. This is very important. **'server address' is the address of the server where SolibCore is running.** You have to provide the port number if needed.
Example:

Working on `myserver.com` you have set `port = 25000` in `config.js`. You do `node server.js` and the SOlib server is up.

If so, in the `server address` field you should type:
```
http://myserver.com:25000
```