'use strict';

angular.module('core').factory('Socket', ['socketFactory',
	function(socketFactory) {
		return socketFactory({
			prefix: '',
			ioSocket: io.connect('http://107.170.195.228:5000')
		});
	}
	]);