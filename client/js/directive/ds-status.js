angular.module('xf.dualshock.dsstatus', ['xf.dualshock'])
	.directive('dsStatus', ['$rootScope', function ($rootScope) {
		return {
			link: function ($scope, $element, $attr, $controller) {
				//if (!$attr.key) return console.error('dsButton needs a key!');

				$scope.connection = false;
				$rootScope.$on('dualshock:status:connection:change', function (mode) {
					$scope.connection = mode;
				});
			},
			'restrict': 'EA',
			scope: true
		};
	}]);