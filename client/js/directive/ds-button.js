angular.module('xf.dualshock.dsbutton', ['xf.dualshock'])
    .directive('dsButton', ['$rootScope', function ($rootScope) {
        return {
            link: function ($scope, $element, $attr, $controller) {
                var keyName = $attr.key,
					doubleTapDelay = 0,
					lastTapped = 0;
                if (!keyName)
                    return console.error('dsButton needs a key!');

				if($attr.doubleTapDelay) {
					doubleTapDelay = parseInt($attr.doubleTapDelay);
				}
                $scope.pressed = false;
                $element.addClass('released');

                $rootScope.$on('dualshock:button:' + keyName + ':press', function () {
                    $scope.pressed = true;
                    $element.addClass('pressed').removeClass('released');
					if(doubleTapDelay) {
						var nowTapped = new Date().getTime();
						if(lastTapped && (nowTapped-lastTapped)<=doubleTapDelay)
							$element.addClass('double-tapped');
						else
							$element.removeClass('double-tapped');
						lastTapped = nowTapped;
					}
                });

                $rootScope.$on('dualshock:button:' + keyName + ':release', function () {
                    $scope.pressed = false;
                    $element.addClass('released').removeClass('pressed');
                });
            },
            'restrict': 'EA',
            scope: true
        };
    }]);