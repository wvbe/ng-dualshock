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

				function isPressed() {
					for(var i=0;i<keyNames.length;i++) // for each key
						if(!state[keyNames[i]]) // when not true
							return false;
					return true;
				}

				function press(keyName) { // registers a press, not the same as (eg. doubletap "activate")
					state[keyName] = true;
					var prssd = true;
					if(keyNames.length>1) // if key combination
						prssd = combopress(keyName);
					if (doubleTapDelay && prssd)
						prssd = doubletap(keyName);
					if(prssd)
						activate(keyName);
				}
				function combopress(keyName) {
					if(isPressed()) {
						$element.addClass('combo-pressed');
						return true;
					}
					$element.removeClass('combo-pressed');
					return false;
				}

				function doubletap(keyName) {
					var nowTapped = new Date().getTime(), double = false;
					if (lastTapped && (nowTapped - lastTapped) <= doubleTapDelay) {
						$element.addClass('double-tapped');
						double = true;
					} else {
						$element.removeClass('double-tapped');

					}
					lastTapped = nowTapped;
					return double;
				}


				function release(keyName) {
					state[keyName] = false;
					var modifiers = [];
					if(keyNames.length) modifiers.push('combo-pressed');
					if(doubleTapDelay) modifiers.push('double-tapped');
					return deactivate();
					// return deactivate(modifiers.join(' ')); // uncomment to wipe all modifier classnames on release
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
					});
					$rootScope.$on('dualshock:button:' + keyName + ':release', function () {
						release(keyName);
					});
				});
			},
			'restrict': 'EA',
			scope: true
		};
	}]);