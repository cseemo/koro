'use strict';

angular.module('core').directive('mytest', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Mytest directive logic
				// ...

				element.text('this is the mytest directive');
			}
		};
	}
]);