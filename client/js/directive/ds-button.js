angular.module('xf.dualshock.dsbutton', ['xf.dualshock'])
	.directive('dsButton', ['$rootScope', function ($rootScope) {
		return {
			link: function ($scope, $element, $attr, $controller) {
				if(!$attr.keys && !$attr.key)
					return console.error('dsButton needs a key!');

				// variables
				var keyNames = ($attr.keys || $attr.key).split('+'),
					doubleTapDelay = ($attr.doubleTapDelay ? parseInt($attr.doubleTapDelay) : 0),
					lastTapped = 0,
					state = {};

				function press(keyName) { // registers a press, not the same as (eg. doubletap "activate")
					state[keyName] = true;

					if(keyNames.length>1) // if key combination
						return combopress(keyName);

					activate(keyName);
				}
				function isPressed() {
					for(var i=0;i<keyNames.length;i++) // for each key
						if(!state[keyNames[i]]) // when not true
							return false;
					return true;
				}
				function combopress(keyName) {
					if(isPressed())
						return activate('combo-pressed');
					return deactivate('combo-pressed');

				}
				function doubletap(keyName) {
					var nowTapped = new Date().getTime();
					if (lastTapped && (nowTapped - lastTapped) <= doubleTapDelay)
						activate('double-tapped');
					else
						deactivate('double-tapped');
					lastTapped = nowTapped;
				}
				function release(keyName) {
					state[keyName] = false;
					$scope.pressed = false;
					deactivate();
				}
				function activate(className) {

					if(className)
						$element.addClass(className);

					if(!isPressed())
						return;

					$scope.pressed = true;
					$element.addClass('pressed').removeClass('released');
				}
				function deactivate(className) {
					$scope.pressed = false;
					$element.addClass('released').removeClass('pressed');
					if(className)
						$element.removeClass(className);

				}

				release();
				keyNames.map(function(keyName) {
					$rootScope.$on('dualshock:button:' + keyName + ':press', function () {
						press(keyName);
						if (doubleTapDelay && isPressed())
							doubletap(keyName);
					});
					$rootScope.$on('dualshock:button:' + keyName + ':release', function () {
						release(keyName);
						if(keyNames.length>1) // if key combination
							return combopress(keyName);
					});
				});
			},
			'restrict': 'EA',
			scope: true
		};
	}]);