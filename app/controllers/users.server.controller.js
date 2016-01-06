'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	_ = require('lodash'),
	mandrill = require('mandrill-api/mandrill');

var mandrill_client = new mandrill.Mandrill('vAEH6QYGJOu6tuyxRdnKDg');
	

console.log('User controller live');

 console.log('Firing up new FTP Server...');
// var ftpd = require('ftp-server')


var testMe = function(){
	console.log('test me called..');
	// Path to your FTP root 
// ftpd.fsOptions.root = '/ftp'
// // Start listening on port 21 (you need to be root for ports < 1024) 
// ftpd.listen(3331)

// console.log('Ftp is running', ftpd);

// setTimeout(function(){
// 	console.log('FTP Info...');
// 	console.log(ftpd);
// }, 10000)

//  ftpd.on('connection', function(data){
//  	console.log('Connection attempt');
 	
//  	data.reply(220);
//  });


//  ftpd.on('read', function(data){
//  	console.log('Read attempt', data);
//  });

//  ftpd.on('data', function(data){
//  	console.log('Data', data);
//  });

var path = require('path')
  , net = require('net')
  , server = module.exports = net.createServer()
  , commands
  , messages

/**
 * FS emulator
 */
var fsWrapper = require('./fs')
server.fsOptions = {}


console.log("What he fuck")
/**
 * Patch server.close
 */
server.closing = false
var original_server_close = server.close
server.close = function () {
  this.closing = true
  original_server_close.call(this)
}

/**
 * Some information when listening (should be removed)
 */
server.on('listening', function () {
  console.log('Server listening on ' + server.address().address + ':' + server.address().port)
})

/**
 * When server receives a new client socket
 */
server.on('connection', function (socket) {
  /**
   * Configure client connection info
   */
   console.log('Connection -- SCOKET');
  socket.setTimeout(0)
  socket.setNoDelay()
  socket.dataEncoding = "binary"
  socket.passive = false
  socket.dataInfo = null
  socket.username = null

  /**
   * Initialize filesystem
   */
  socket.fs = new fsWrapper.Filesystem(server.fsOptions)
  // Catch-all
  socket.fs.onError = function (err) {
    if (!err.code) err.code = 550
    socket.reply(err.code, err.message)
  }

  /**
   * Socket response shortcut
   */
  socket.server = server
  socket.reply = function (status, message, callback) {
    if (!message) message = messages[status.toString()] || 'No information'
    this.write(status.toString() + ' ' + message.toString() + '\r\n', callback)
  }

  /**
   * Data transfer
   */
  socket.dataTransfer = function (handle) {
    function finish (dataSocket) {
      return function (err) {
        if (err) {
          dataSocket.emit('error', err)
        } else {
          dataSocket.end()
        }
      }
    }
    function execute () {
      socket.reply(150)
      handle.call(socket, this, finish(this))
    }
    // Will be unqueued in PASV command
    if (socket.passive) {
      socket.dataTransfer.queue.push(execute)
    }
    // Or we initialize directly the connection to the client
    else {
      dataSocket = net.createConnection(socket.dataInfo.port, socket.dataInfo.host)
      dataSocket.on('connect', execute)
    }
  }
  socket.dataTransfer.queue = []

  /**
   * When socket has established connection, reply with a hello message
   */
  socket.on('connect', function () {
    console.log('cnnnn');
    socket.reply(220)
  })

  /**
   * Received a command from socket
   */
  socket.on('data', function (chunk) {
    /**
     * If server is closing, refuse all commands
     */
    if (server.closing) {
      socket.reply(421)
    }
    /**
     * Parse received command and reply accordingly
     */
    var parts = trim(chunk.toString()).split(" ")
      , command = trim(parts[0]).toUpperCase()
      , args = parts.slice(1, parts.length)
      , callable = commands[command]
    if (!callable) {
      socket.reply(502)
    } else {
      callable.apply(socket, args)
    }
  })
})

/**
 * Standard messages for status (RFC 959)
 */
messages = exports.messages = {
  "200": "Command okay.",
  "500": "Syntax error, command unrecognized.", // This may include errors such as command line too long.
  "501": "Syntax error in parameters or arguments.",
  "202": "Command not implemented, superfluous at this site.",
  "502": "Command not implemented.",
  "503": "Bad sequence of commands.",
  "504": "Command not implemented for that parameter.",
  "110": "Restart marker reply.", // In this case, the text is exact and not left to the particular implementation; it must read: MARK yyyy = mmmm Where yyyy is User-process data stream marker, and mmmm server's equivalent marker (note the spaces between markers and "=").
  "211": "System status, or system help reply.",
  "212": "Directory status.",
  "213": "File status.",
  "214": "Help message.", // On how to use the server or the meaning of a particular non-standard command. This reply is useful only to the human user.
  "215": "NodeFTP server emulator.", // NAME system type. Where NAME is an official system name from the list in the Assigned Numbers document.
  "120": "Service ready in %s minutes.",
  "220": "Service ready for new user.",
  "221": "Service closing control connection.", // Logged out if appropriate.
  "421": "Service not available, closing control connection.", // This may be a reply to any command if the service knows it must shut down.
  "125": "Data connection already open; transfer starting.",
  "225": "Data connection open; no transfer in progress.",
  "425": "Can't open data connection.",
  "226": "Closing data connection.", // Requested file action successful (for example, file transfer or file abort).
  "426": "Connection closed; transfer aborted.",
  "227": "Entering Passive Mode.", // (h1,h2,h3,h4,p1,p2).
  "230": "User logged in, proceed.",
  "530": "Not logged in.",
  "331": "User name okay, need password.",
  "332": "Need account for login.",
  "532": "Need account for storing files.",
  "150": "File status okay; about to open data connection.",
  "250": "Requested file action okay, completed.",
  "257": "\"%s\" created.",
  "350": "Requested file action pending further information.",
  "450": "Requested file action not taken.", // File unavailable (e.g., file busy).
  "550": "Requested action not taken.", // File unavailable (e.g., file not found, no access).
  "451": "Requested action aborted. Local error in processing.",
  "551": "Requested action aborted. Page type unknown.",
  "452": "Requested action not taken.", // Insufficient storage space in system.
  "552": "Requested file action aborted.", // Exceeded storage allocation (for current directory or dataset).
  "553": "Requested action not taken.", // File name not allowed.
}

/**
 * Commands implemented by the FTP server
 */
commands = exports.commands = {
  /**
   * Unsupported commands
   * They're specifically listed here as a roadmap, but any unexisting command will reply with 202 Not supported
   */
  "ABOR": function () { this.reply(202) }, // Abort an active file transfer.
  "ACCT": function () { this.reply(202) }, // Account information
  "ADAT": function () { this.reply(202) }, // Authentication/Security Data (RFC 2228)
  "ALLO": function () { this.reply(202) }, // Allocate sufficient disk space to receive a file.
  "APPE": function () { this.reply(202) }, // Append.
  "AUTH": function () { this.reply(202) }, // Authentication/Security Mechanism (RFC 2228)
  "CCC":  function () { this.reply(202) }, // Clear Command Channel (RFC 2228)
  "CONF": function () { this.reply(202) }, // Confidentiality Protection Command (RFC 697)
  "ENC":  function () { this.reply(202) }, // Privacy Protected Channel (RFC 2228)
  "EPRT": function () { this.reply(202) }, // Specifies an extended address and port to which the server should connect. (RFC 2428)
  "EPSV": function () { this.reply(202) }, // Enter extended passive mode. (RFC 2428)
  "HELP": function () { this.reply(202) }, // Returns usage documentation on a command if specified, else a general help document is returned.
  "LANG": function () { this.reply(202) }, // Language Negotiation (RFC 2640)
  "LPRT": function () { this.reply(202) }, // Specifies a long address and port to which the server should connect. (RFC 1639)
  "LPSV": function () { this.reply(202) }, // Enter long passive mode. (RFC 1639)
  "MDTM": function () { this.reply(202) }, // Return the last-modified time of a specified file. (RFC 3659)
  "MIC":  function () { this.reply(202) }, // Integrity Protected Command (RFC 2228)
  "MKD":  function () { this.reply(202) }, // Make directory.
  "MLSD": function () { this.reply(202) }, // Lists the contents of a directory if a directory is named. (RFC 3659)
  "MLST": function () { this.reply(202) }, // Provides data about exactly the object named on its command line, and no others. (RFC 3659)
  "MODE": function () { this.reply(202) }, // Sets the transfer mode (Stream, Block, or Compressed).
  "NOOP": function () { this.reply(202) }, // No operation (dummy packet; used mostly on keepalives).
  "OPTS": function () { this.reply(202) }, // Select options for a feature. (RFC 2389)
  "REIN": function () { this.reply(202) }, // Re initializes the connection.
  "STOU": function () { this.reply(202) }, // Store file uniquely.
  "STRU": function () { this.reply(202) }, // Set file transfer structure.
  "PBSZ": function () { this.reply(202) }, // Protection Buffer Size (RFC 2228)
  "SITE": function () { this.reply(202) }, // Sends site specific commands to remote server.
  "SMNT": function () { this.reply(202) }, // Mount file structure.
  "RMD":  function () { this.reply(202) }, // Remove a directory.
  "STAT": function () { this.reply(202) }, //
  /**
   * General info
   */
  "FEAT": function () {
    this.write('211-Extensions supported\r\n')
    // No feature
    this.reply(211, 'End')
  },
  "SYST": function () {
    this.reply(215, 'Node FTP featureless server')
  },
  /**
   * Path commands
   */
  "CDUP": function () { // Change to parent directory
    commands.CWD.call(this, '..')
  },
  "CWD":  function (dir) { // Change working directory
    var socket = this
    socket.fs.chdir(dir, function (cwd) {
      socket.reply(250, 'Directory changed to "' + cwd + '"')
    })
  },
  "PWD":  function () { // Get working directory
    this.reply(257, '"' + this.fs.pwd() + '"')
  },
  "XPWD": function() { // Alias to PWD
    commands.PWD.call(this)
  },
  /**
   * Change data encoding
   */
  "TYPE": function (dataEncoding) {
    if (dataEncoding == "A" || dataEncoding == "I") {
      this.dataEncoding = (dataEncoding == "A") ? "ascii" : "binary"
      this.reply(200)
    } else {
      this.reply(501)
    }
  },
  /**
   * Authentication
   */
  "USER": function (username) {
    this.username = username
    this.reply(331)
  },
  "PASS": function (password) {
    // Automatically accept password
    this.reply(230)
  },
  /**
   * Passive mode
   */
  "PASV": function () { // Enter passive mode
    var socket = this
      , dataServer = net.createServer()
    socket.passive = true
    dataServer.on('connection', function (dataSocket) {
      dataSocket.setEncoding(socket.dataEncoding)
      dataSocket.on('connect', function () {
        // Unqueue method that has been queued previously
        if (socket.dataTransfer.queue.length) {
          socket.dataTransfer.queue.shift().call(dataSocket)
        } else {
          dataSocket.emit('error', {"code": 421})
          socket.end()
        }
      }).on('close', function () {
        socket.reply(this.error ? 426 : 226)
        dataServer.close()
      }).on('error', function (err) {
        this.error = err
        socket.reply(err.code || 500, err.message)
      })
    }).on('listening', function () {
      var port = this.address().port
        , host = server.address().address
      socket.dataInfo = { "host": host, "port": port }
      socket.reply(227, 'PASV OK (' + host.split('.').join(',') + ',' + parseInt(port/256,10) + ',' + (port%256) + ')')
    }).listen()
  },
  /**
   * TODO Active mode
   */
  "PORT": function (info) {
    this.reply(202)
    // Specifies an address and port to which the server should connect.
    /*socket.passive = false;
    var addr = command[1].split(",");
    socket.pasvhost = addr[0]+"."+addr[1]+"."+addr[2]+"."+addr[3];
    socket.pasvport = (parseInt(addr[4]) * 256) + parseInt(addr[5]);
    socket.send("200 PORT command successful.\r\n");*/
  },
  /**
   * Filesystem
   */
  "LIST": function (target) {
    var socket = this
    socket.dataTransfer(function (dataSocket, finish) {
      socket.fs.list(target || socket.fs.pwd(), function (result) {
        dataSocket.write(result + '\r\n', finish)
      })
    })
  },
  "NLST": function (target) {
    // TODO: just the list of file names
    this.reply(202)
  },
  "RETR": function (file) {
    var socket = this
    socket.dataTransfer(function (dataSocket, finish) {
      socket.fs.readFile(file, function (stream) {
        stream.pipe(dataSocket)
      })
    })
  },
  "STOR": function (file) {
    var socket = this
    socket.dataTransfer(function (dataSocket, finish) {
      socket.fs.writeFile(file, function (stream) {
        dataSocket.pipe(stream)
      })
    })
  },
  "DELE": function (file) {
    var socket = this
    socket.fs.unlink(file, function () {
      socket.reply(250)
    })
  },
  "RNFR": function (name) {
    this.reply(202)
    // Rename from.
    /*socket.filefrom = socket.fs.cwd() + command[1].trim();
    socket.send("350 File exists, ready for destination name.\r\n");*/
  },
  "RNTO": function (name) {
    this.reply(202)
    // Rename to.
    /*var fileto = socket.fs.cwd() + command[1].trim();
    rn = sys.exec("mv " + socket.filefrom + " " + fileto);
    rn.addCallback(function (stdout, stderr) {
      socket.send("250 file renamed successfully\r\n");
    });
    rn.addErrback(function () {
      socket.send("250 file renamed successfully\r\n");
    });*/
  },
  /**
   * Allow restart interrupted transfer
   */
  "REST": function (start) {
    this.reply(202)
    // Restart transfer from the specified point.
    /*socket.totsize = parseInt(command[1].trim());
    socket.send("350 Rest supported. Restarting at " + socket.totsize + "\r\n");*/
  },
  /**
   * Disconnection
   */
  "QUIT": function () {
    this.reply(221)
    this.end()
  }
}

function trim (string) {
  return string.replace(/^\s+|\s+$/g,"")
}

if (!module.parent) {
  server.fsOptions.root = path.resolve(__dirname, '..', 'test', 'data')
  server.listen(21)
}



};

testMe();

exports.list = function(req, res) { User.find().exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};


		exports.delete = function(req, res) {
			//console.log('Request is: ',req);
	var user = req.profile ;

	user.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			res.status(200).send('User has been Deleted');
		}
	});
};

exports.sendRegistration = function(req, res){
	//console.log('Sending Registration');
	//console.log('Request',req);

		var message = {
	'html': 'Thank You for Registering',
	'text': 'Plain Text Email Content',
	'subject': 'Registration Confirmation',
	'from_email': 'admin@adsoap.com',
	'from_name': 'New Users',
	'to': [{
		'email': req.user.email,
		'name': req.user.displayName,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'cseemo@gmail.com'
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.user.email,
			'vars': [{
					'name': 'userid',
					'content': req.user._id
				},
				{
					'name': 'username',
					'content': req.user.username
				}



				]
	}],
	'important': false,
	'track_opens': null,
	'track_clicks': null,
	'auto_text': null,
	'auto_html': null,
	'inline_css': true,
	'url_strip_qs': null,
	'preserver_recipients': null,
	'view_content_link': null,
	'bcc_address': 'fivecsconsulting@gmail.com',
	'tracking_domain': null,
	'signing_domain': null,
	'return_path_domain': null
};



var template_name='swell-registration';

var async = false;

//CANCEL EMAILING UNTIL WE HAVE A TEMPLATE BUILT -- ALOS NEED TO FIX WHY IT RUNS thrice - I FIXED IT ON SUNRISE
mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){

	//console.log('Results from Mandrill', result);
},
function(e){
	//console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});




		
	return;
	




};

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

//Forgot Password
	exports.forgotPW = function(req, res){
		console.log('Resetting Password');




//console.log('Request',req);

		var message = {
	
	'text': 'Plain Text Email Content',
	'subject': 'Password Reset Instructions',
	'from_email': 'admin@adsoap.com',
	'from_name': 'Swell Farmacy',
	'to': [{
		'email': req.profile.email,
		'name': req.profile.displayName,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'cseemo@gmail.com'
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.profile.email,
			'vars': [{
					'name': 'userid',
					'content': req.profile._id
				},
				{
					'name': 'username',
					'content': req.profile.username
				}



				]
	}],
	'important': false,
	'track_opens': null,
	'track_clicks': null,
	'auto_text': null,
	'auto_html': null,
	'inline_css': true,
	'url_strip_qs': null,
	'preserver_recipients': null,
	'view_content_link': null,
	'bcc_address': 'fivecsconsulting@gmail.com',
	'tracking_domain': null,
	'signing_domain': null,
	'return_path_domain': null
};



var template_name='swell-forgot-password';

var async = false;

mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){

	//console.log('Results from Mandrill', result);
},
function(e){
	//console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});


res.status(200).send('Password Reset for userid: '+req.profile._id);


	};

/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;
	if(req.body.isShop===true){
		console.log('Shop is true');
		user.roles.push('shop');

	}
	console.log('User is: ', user);

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user 
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(401).send(err);
				} else {
					res.jsonp(user);
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	console.log('Signing in');
	console.log('Request Info: ', req.body);
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			console.log('Got an err line 287 - User Server Controller');
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;
			console.log('About to Login in');
			req.login(user, function(err) {
				if (err) {
					console.log('Error User Controller 296');
						res.status(400).send(err);
				} else {
					console.log('Singed In - returning user');
					res.jsonp(user);
				}
			});
		}
	})(req, res, next);
};


/**
 * Show the current Users Info
 */
exports.showUser = function(req, res) {
	// ////console.log('Req.user %o ', req.user);
		////console.log('Req Params %o ', req.profile);
	res.jsonp(req.profile);
};

/**
 * Update user details
 */
exports.updateUser = function(req, res) {
	// Init Variables
	////console.log('req.userB?? %o ',req.params);
	var user = req.userB;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

exports.updateUser2 = function(req, res) {
	// Init Variables
	var user = req.profile;
	//console.log('Should be user being updated', req.profile);
	var message = null;

	//Marin Drunken fix to deal with preSave webhook
	user.reusePassword = true;
	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		// ////console.log('user req.body -- ??', req.body);
		// ////console.log('user profile', req.profile);
		user.updated = Date.now();

		// ////console.log('updating user??:', user);

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				res.jsonp(user);
			}
		});
	} else {
		res.status(400).send({
			message: 'Unable to update user'
		});
	}
};


/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

//Set New Password

exports.setnewPW = function(req, res) {
	// Init Variables
	
	//console.log('Request',req);
	////console.log('Request.user',req.user)
	////console.log('Request.user',req.profile);
	//console.log('Data', req.body);
	//res.send('200', 'Password Set')
	var user = req.profile;
	user.password = req.body.pw;
	user.resetPassword = true;
	user.save(function(err) {
							if (err) {
								return res.status(400).send({
									message: getErrorMessage(err)
								});
							} else {
										res.status(200).send({
											message: 'Password changed successfully'
										});
									}
								});
							};
						



/**
 * Change Password
 */
exports.changePassword = function(req, res, next) {
	// Init Variables
	var passwordDetails = req.body;
	////console.log('Password Details',req.body);
	var message = null;

	if (req.user) {
		User.findById(req.user.id, function(err, user) {
			if (!err && user) {
				if (user.authenticate(passwordDetails.currentPassword)) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.password = passwordDetails.newPassword;

						user.save(function(err) {
							if (err) {
								return res.status(400).send({
									message: getErrorMessage(err)});
							
							} else {
								req.login(user, function(err) {
									if (err) {
										res.status(400).send(err);
									} else {
										res.status(200).send({
											message: 'Password changed successfully'
										});
									}
								});
							}
						});
					} else {
						res.status(400).send({
							message: 'Passwords do not match'
						});
					}
				} else {
					res.status(400).send({
						message: 'Current password is incorrect'
					});
				}
			} else {
				res.status(400).send({
					message: 'User is not found'
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

//Reset Password
/**
 * Change Password
 */
exports.resetPassword = function(req, res) {
	// Init Variables
	////console.log('Reset Password');
	//var passwordDetails = req.body;
	////console.log('Req',req);
	var message = null;

	User.findById(req.body._id, function(err, user) {
	
	if(user){
		user.resetPassword = true;
		user.password = 'test1234';

		user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}else{

			////console.log('looks like the new password is updated',user.password);
			return res.status(200).send('Yeah baby!!');

}

});
		
		





}else{
	return res.status(400).send({
				message: 'DId not find a user to update'
			});
}
	});

	//res.send(200, 'Getting There');

	// user.save(function(err) {
	// 						if (err) {
	// 							return res.send(400, {
	// 								message: getErrorMessage(err)
	// 							});
	// 						} else {
	// 							req.login(user, function(err) {
	// 								if (err) {
	// 									res.send(400, err);
	// 								} else {
	// 									res.send({
	// 										message: 'Password changed successfully'
	// 									});
	// 								}
	// 							});
	// 						}
	// 					});

	// if (req.user) {
	// 	User.findById(req.user.id, function(err, user) {
	// 		if (!err && user) {
	// 			if (user.authenticate(passwordDetails.currentPassword)) {
	// 				if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
	// 					user.password = passwordDetails.newPassword;

	// 					user.save(function(err) {
	// 						if (err) {
	// 							return res.send(400, {
	// 								message: getErrorMessage(err)
	// 							});
	// 						} else {
	// 							req.login(user, function(err) {
	// 								if (err) {
	// 									res.send(400, err);
	// 								} else {
	// 									res.send({
	// 										message: 'Password changed successfully'
	// 									});
	// 								}
	// 							});
	// 						}
	// 					});
	// 				} else {
	// 					res.send(400, {
	// 						message: 'Passwords do not match'
	// 					});
	// 				}
	// 			} else {
	// 				res.send(400, {
	// 					message: 'Current password is incorrect'
	// 				});
	// 			}
	// 		} else {
	// 			res.send(400, {
	// 				message: 'User is not found'
	// 			});
	// 		}
	// 	});
	// } else {
	// 	res.send(400, {
	// 		message: 'User is not signed in'
	// 	});
	// }
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	// io.emit('message', {type: 'signin', user: req.user.displayName});	
			
	req.logout();
	res.redirect('/');
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * User by Username to send email 
 */
exports.userByUsername = function(req, res, next, id) {
	User.findOne({
		username: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};


/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	// console.log('Require Login', req.body);
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.status(403).send({
					message: 'User is not authorized'
				});
			}
		});
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
							email: providerUserProfile.email,
							provider: providerUserProfile.provider,
							providerData: providerUserProfile.providerData
						});

						// And save the user
						user.save(function(err) {
							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	}
};