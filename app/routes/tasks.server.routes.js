'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tasks = require('../../app/controllers/tasks.server.controller');

	// Tasks Routes
	app.route('/tasks')
		.get(tasks.list)
		.post(users.requiresLogin, tasks.create);

	app.route('/allOfOurTasks')
		.get(users.requiresLogin, tasks.allOfOurTasks);

	app.route('/rejectTask')
		.post(users.requiresLogin, tasks.rejectTask);
	

	app.route('/tasks/:taskId')
		.get(tasks.read)
		.put(users.requiresLogin, tasks.hasAuthorization, tasks.update)
		.delete(users.requiresLogin, tasks.hasAuthorization, tasks.delete);

	// Finish by binding the Task middleware
	app.param('taskId', tasks.taskByID);
};
