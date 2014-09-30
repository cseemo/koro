'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db);

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on('connection', function(){

console.log('What up bitches!!');
io.sockets.emit('Done');
});
server.listen(5000);
// Start the app by listening on <port>
//app.get('server').listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);