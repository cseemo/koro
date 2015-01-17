'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user,
			hasRole: function(role) {
				// console.log('Has Role', role);
				
				if(!this.user)
					return false;

				for (var i in this.user.roles) {
					if(this.user.roles[i] === role) {
						return true;
					}
				}
				return false;
			}
		};

		return _this._data;
	}
]);