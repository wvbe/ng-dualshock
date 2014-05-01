angular.module('xf.dualshock.dsbutton', ['xf.dualshock'])
	.directive('dsButton', ['$rootScope', function ($rootScope) {
		return {
			link: function ($scope, $element, $attr, $controller) {
				var input = ($scope.dsButton || $attr.dsButton     || $attr.keys || $attr.key);
				console.log('Button directive', input, $scope, $attr);
				if(!input)
					return console.error('dsButton needs a key!', input, $scope, $attr);
				var sequence = input.split(',').map(function(keyNames) {
						return keyNames.split('+');
					}),

					sequenceNth = 0,
					keyNames = sequence[sequenceNth],
					doubleTapDelay = ($attr.doubleTapDelay ? parseInt($attr.doubleTapDelay) : 0),
					lastTapped = 0,
					state = {};


				// Getters
				function isPressed(keyName) {
					if(keyName)
						return state[keyName];
					for(var i=0;i<keyNames.length;i++) // for each key
						if(!state[keyNames[i]]) // when not true
							return false;
					return true;
				}

				// "Setters"
				function press(keyName) { // registers a press, not the same as (eg. doubletap "activate")
					if(!keyName)
						return console.error('Key configuration press event has no keyName');

					if(sequence.length>1 && sequenceNth===sequence.length) { // if sequence was ended, should wrap here
						sequenceNth = 0;
						keyNames = sequence[sequenceNth];
						state = {};
						$element.removeClass('sequence-complete');
					}

					state[keyName] = true;
					var prssd = true;

					// @TODO: non-valid keys break combi, double and sequence presses


					if(keyNames.length>1) // if key combination
						prssd = combopress(keyName, prssd);
					if (doubleTapDelay && prssd)
						prssd = doubletap(keyName, prssd);
					if (sequence.length>1 && prssd)
						prssd = sequencepress(keyName, prssd);
					if(prssd)
						activate();
				}
				function combopress(keyName, prssd) {
					if(isPressed()) {
						$element.addClass('combo-pressed');
						return prssd;
					}
					$element.removeClass('combo-pressed');
					return false;
				}
				function sequencepress(keyName, prssd) {
					var pressed = isPressed();
					if(pressed && sequenceNth+1<sequence.length) {
						$element.removeClass('sequence-complete');

						++sequenceNth;
						keyNames = sequence[sequenceNth];

						console.log('Shifting key sequence, next key to press is '+keyNames);
						return prssd;
					} else if(pressed) { // or be done sequencing
						++sequenceNth;
						console.log('Aight! Double press yo');
						$element.addClass('sequence-complete');
						return prssd;
					}
					sequencecancel(true);
					return false;
				}
				function sequencecancel(alsoRemoveClass) {
					sequenceNth = 0;
					keyNames = sequence[sequenceNth];
					if(alsoRemoveClass)
						$element.removeClass('sequence-complete');
				}
				function doubletap(keyName, prssd) {
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
					if(sequence.length>1) modifiers.push('sequence-complete');

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

				// release initially
				release();

				// bind events
				sequence.map(function(keyNames) { keyNames.map(function(keyName) {
					$rootScope.$on('dualshock:button:' + keyName + ':press', function () {
						press(keyName);
					});
					$rootScope.$on('dualshock:button:' + keyName + ':release', function () {
						release(keyName);
					});
				});});
			},
			'restrict': 'EA',
			scope: {
				dsButton: '='
			}
		};
	}]);