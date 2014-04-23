angular.module('ngdualshock', [
    //'angular',
    'btford.socket-io',
    'xf.dualshock.dsanalog',
    'xf.dualshock.dsbutton',
    'xf.dualshock.dsmotion',
    'xf.dualshock.dsstatus'
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
					state[buttonType][name] = (buttonType=='button'?(evnt=='release'?true:false):update.data);
				})
			})(buttonType);
		}
	}

	return {
		init: init,
		getState: function() { console.log('Getting state'); return state; },
		socket: xfDualshockIo
	}
}])
.run(function(xfDualshockService) {
	xfDualshockService.init();
}).controller('debugController', ['$scope', 'xfDualshockService', function($scope, xfDualshockService){
	$scope.debug = xfDualshockService.getState();
	console.log($scope.debug);
}]);
