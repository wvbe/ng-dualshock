angular.module('xf.dualshock.dsstatus', ['xf.dualshock'])
	.directive('dsStatus', ['$rootScope', function ($rootScope) {
		return {
			link: function ($scope, $element, $attr, $controller) {
				var keyName = $attr.key;
				if (!keyName)
					return console.error('dsStatus needs a key!'); // directives need key/button to listen to
				$scope.message = false; // $scope.connection would be too specific. Make dsConnection if do want ;)
				$scope.getMessage = function () {
					return $scope.message || 'Not available';
				}

				//@TODO: pull initial status data
				//@IDEA: display icons instead of text, icon/status mapping is needed!

				$rootScope.$on('dualshock:status:' + keyName + ':change', function (evnt, message) {
					$scope.message = message;
				});
			},
			'restrict': 'EA',
			scope: true
		};
	}]);