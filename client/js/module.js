angular.module('xf.dualshock', [
	'xf.dualshock.dsanalog',
	'xf.dualshock.dsbutton',
	'xf.dualshock.dsmotion',
	'xf.dualshock.dsstatus',

	'btford.socket-io'
])
	.service('xfDualshockService', ['$rootScope', 'socketFactory', function ($rootScope, socketFactory) {

		var xfDualshockIo = false;

		var layout = {
			analog: 'left,right'.split(','),
			button: 'l1,l2,r1,r2,triangle,circle,square,x,start,select,leftAnalogBump,rightAnalogBump,dpadUp,dpadDown,dpadLeft,dpadRight,psxButton'.split(','),
			motion: 'rightLeft,forwardBackward,upDown,yaw'.split(','),
			status: 'charging,battery,connection'.split(',')
		};

		var state = {};


		function initSocket(config) {
			if (!config)
				config = {};
			var ioSocket = io.connect(config.host || 'http://localhost:8082');
			xfDualshockIo = socketFactory({
				ioSocket: ioSocket,
				prefix: config.prefix,
				scope: config.scope
			});
		}

		function emptyState(config) {
			// construct a state object with everything set to false
			for (var buttonType in layout) {
				if (!state[buttonType])
					state[buttonType] = {};
				layout[buttonType].map(function (buttonName) {
					state[buttonType][buttonName] = false;
				});
			}
		}

		function bind(config) {
			for (var buttonType in layout) {
				(function (buttonType) {
					xfDualshockIo.on(buttonType, function (update) {
						var desc = update.event.split(':');
						var name = desc[0];
						var evnt = desc[1];
						$rootScope.$emit(['dualshock', buttonType, name, evnt].join(':'), update.data);
						state[buttonType][name] = (buttonType == 'button' ? (evnt == 'press' ? true : false) : update.data);
					})
				})(buttonType);
			}
		}

		return {
			init: function (config) {
				initSocket(config);
				emptyState(config);
				bind(config);
			},
			getState: function () {
				return state;
			},
			socket: xfDualshockIo
		}
	}]);