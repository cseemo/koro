'use strict';

module.exports = {
	app: {
		title: 'Swell Farmacy',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 5000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				//NExt line was commented out before Jan 21 at 2pm
				// 'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/font-awesome/css/font-awesome.min.css',
				'public/lib/weather-icons/css/weather-icons.min.css',
				'/modules/core/css/main.css',
        		'/modules/core/css/ui.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/jquery.easy-pie-chart/dist/angular.easypiechart.js',
				'public/lib/textAngular/dist/textAngular.min.js',
				'public/lib/angular-ui-tree/dist/angular-ui-tree.min.js',
				'public/lib/ngmap/dist/ng-map.min.js',
				'public/lib/ng-tags-input/ng-tags-input.min.js',
				'public/lib/jquery.slimscroll/jquery.slimscroll.min.js',
				'/public/lib/flot/excanvas.js',
				'public/lib/flot/jquery.flot.js',
				'public/lib/flot/jquery.flot.*.js',
				'public/lib/flot.tooltip/js/jquery.flot.tooltip.min.js',
				'public/lib/angular-socket-io/socket.js',
				'public/lib/socket.io-client/socket.io.js',
				'public/lib/angular-file-upload/angular-file-upload.js',
				'public/lib/angular-xeditable/dist/js/xeditable.js',
				'public/lib/lodash/dist/lodash.min.js',
				'public/lib/angular-google-maps/dist/angular-google-maps.min.js',


				//'public/lib/flot/*.js'
			]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/lib/angular-xeditable/dist/css/xeditable.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};