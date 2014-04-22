angular.module('ngdualshock', [
	//'angular',
	'btford.socket-io',
    'xf.dualshock.dsmotion'
])
.service('xfDualshockService', ['$rootScope', 'socketFactory', function($rootScope, socketFactory) {
	var ioSocket = io.connect('http://localhost:8082');
	var xfDualshockIo = socketFactory({
		ioSocket: ioSocket
	});
	var layout = {
		analog: 'left,right'.split(','),
		button: 'l1,l2,r1,r2,triangle,circle,square,x,start,select,leftAnalogBump,rightAnalogBump,dpadUp,dpadDown,dpadLeft,dpadRight,psxButton'.split(','),
		motion: 'rightLeft,forwardBackward,upDown,yaw'.split(','),
		status: 'charging,battery,connection'.split(',')
	};
	var state = {};
	function emptyState() {
		// construct a state object with everything set to false
		for(var buttonType in layout) {
			if(!state[buttonType])
				state[buttonType] = {};
			layout[buttonType].map(function(buttonName) {
				state[buttonType][buttonName] = false;
			});
		}
	}
	function init() {
		emptyState();
		for(var buttonType in layout) {
			(function(buttonType) {
				xfDualshockIo.on(buttonType, function(update) {
					var desc = update.event.split(':');
					var name = desc[0];
					var evnt = desc[1];
					$rootScope.$emit(['dualshock', buttonType, name, evnt].join(':'), update.data);
				})
			})(buttonType);
		}
	}

	return {
		init: init,
		getState: function() { return state; },
		socket: xfDualshockIo
	}
}])
.run(function(xfDualshockService) {
	xfDualshockService.init();
})


/**
* Dualshock Button
**/
.directive('dsButton', ['$rootScope',function($rootScope) {
	return {
		link: function ($scope, $element, $attr, $controller) {
			var keyName = $attr.key;
			if(!keyName)
				return console.error('dsButton needs a key!');
			$scope.pressed = false; // reversed because of weird update https://github.com/rdepena/node-dualshock-controller/commit/5cf237906e778ac913bc915ca404942b72f986ef
			$rootScope.$on('dualshock:button:'+keyName+':press', function(){
				$scope.pressed = false;
			});
			$rootScope.$on('dualshock:button:'+keyName+':release', function(){
				$scope.pressed = true; // reversed because of weird update https://github.com/rdepena/node-dualshock-controller/commit/5cf237906e778ac913bc915ca404942b72f986ef
			});
		},
		'restrict': 'EA',
		scope: true
	};
}])


/**
* Dualshock Analog sticks
**/
.directive('dsAnalog', ['$rootScope',function($rootScope) {
	return {
		link: function ($scope, $element, $attr, $controller) {
			var keyName = $attr.key;
			if(!keyName)
				return console.error('dsAnalog needs a key!');
			
			var position = {x:128,y:128};

			$rootScope.$on('dualshock:analog:'+keyName+':move', function(evnt, data){
				position = data;
			});

			$scope.getValue = function() {
				return Math.sqrt(position.x*position.x+position.y*position.y)
			}
			$scope.getMultiplier = function() {
				return {
					x: position.x/255*2-1,
					y: position.y/255*2-1
				}
			};
			$scope.getPercentile = function() {
				return {
					x: position.x/255*100,
					y: position.y/255*100
				}
			};
		},
		'restrict': 'EA',
		scope: true
	};
}]);
