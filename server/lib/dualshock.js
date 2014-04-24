var dualShock = require('dualshock-controller');

// Set up the socket.io server and a helper function
var io = require('socket.io').listen(8082, { log: false });
io.sockets.on('connection', function (socket) {
	socket.emit('initial', {
		status: status
	});
	console.log('# New connection on Socket.io');
});
function routeUpdateToSocket(type, event, data) {
	console.log(type, event, data);
	io.sockets.emit(type, { event: event, data: data});
}

// set up dualshock server and key binds
var input = {
    analog: 'left,right'.split(','),
    button: 'l1,l2,r1,r2,triangle,circle,square,x,start,select,leftAnalogBump,rightAnalogBump,dpadUp,dpadDown,dpadLeft,dpadRight,psxButton'.split(','),
    motion: 'rightLeft,forwardBackward,upDown,yaw'.split(','),
    status: 'charging,battery,connection'.split(',')
};
var controller = dualShock({
    config: "dualShock3",
    accelerometerSmoothing: false,
    analogStickSmoothing: false,
    forceNodeHid: true // Use legacay node-hid to include motion data (requires sudo)
});

// make sure you add an error event handler
controller.on('error', function (data) {
    console.error('DUALSHOCK ERROR', data);
});

var status = {};
// Forward
input.analog.map(function handleAnalog(button) {
    controller.on(button + ':move', function (data) {
        routeUpdateToSocket.apply(this, ['analog', button + ':move', data]);
    });
});
input.button.map(function handleButton(button) {
    controller.on(button + ':press', function (data) {
        routeUpdateToSocket.apply(this, ['button', button + ':press', data]);
    });
    controller.on(button + ':release', function (data) {
        routeUpdateToSocket.apply(this, ['button', button + ':release', data]);
    });
});
input.motion.map(function handleMotion(button) {
    controller.on(button + ':motion', function (data) {
        routeUpdateToSocket.apply(this, ['motion', button + ':motion', data]);
    });
});
input.status.map(function handleStatus(button) {
    controller.on(button + ':change', function (data) {
        routeUpdateToSocket.apply(this, ['status', button + ':change', data]);
		status[button] = data;
    });
});