var input = {
  analog: 'left,right'.split(','),
  buttons: 'l1,l2,r1,r2,triangle,circle,square,x,start,select,leftAnalogBump,rightAnalogBump,dpadUp,dpadDown,dpadLeft,dpadRight,psxButton'.split(','),
  motion: 'rightLeft,forwardBackward,upDown,yaw'.split(','),
  status: 'charging,battery,connection'.split(',')
};

var dualShock = require('dualshock-controller');
var controller = dualShock(
    {
        config : "dualShock3",
        accelerometerSmoothing : true,
        analogStickSmoothing : false
    });

//make sure you add an error event handler
controller.on('error', function(data) {
  //...someStuffDidNotWork();
});


var io = require('socket.io').listen(8082);
io.sockets.on('connection', function (socket) {
    console.log('New IO connection');
});

function route(type, event, data) {
  io.sockets.emit('dualshock', { type: type, event: event, data: data});
}

input.analog.map(function handleButton(button) {
  controller.on(button+':move',function(data) {route.apply(this, ['analog', button+':move', data]);});
});
input.buttons.map(function handleButton(button) {
  controller.on(button+':press',function(data) {route.apply(this, ['button', button+':press', data]);});
  controller.on(button+':release',function(data) {route.apply(this, ['button', button+':release', data]);});
});
input.motion.map(function handleButton(button) {
  controller.on(button+':motion',function(data) {route.apply(this, ['motion', button+':motion', data]);});
});
input.status.map(function handleButton(button) {
  controller.on(button+':change',function(data) {route.apply(this, ['status', button+':change', data]);});
});
controller.connect();