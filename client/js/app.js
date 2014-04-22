angular.module('ngdualshock', [
	//'angular',
	'btford.socket-io',
	'xf.dualshock.service'
])
.factory('xfDualshockSocket', function (socketFactory) {
 return socketFactory();
})
.run(function(xfDualshockSocket) {
	console.log('Angular is live', angular, xfDualshockSocket);
});
angular.module('xf.dualshock.service', []);