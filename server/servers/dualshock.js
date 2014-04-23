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
        accelerometerSmoothing : false,
        analogStickSmoothing : false
    });

//make sure you add an error event handler
controller.on('error', function(data) {
  console.error('DUALSHOCK ERROR', data);
  //...someStuffDidNotWork();
});

var io = require('socket.io').listen(8082, {log: false});
io.sockets.on('connection', function (socket) {
    console.log('New IO connection');
});

function route(type, event, data) {
  console.log(type,event,data);
  io.sockets.emit(type, { event: event, data: data});
}

input.analog.map(function handleAnalog(button) {
  controller.on(button+':move',function(data) {route.apply(this, ['analog', button+':move', data]);});
});
input.buttons.map(function handleButton(button) {
  controller.on(button+':press',function(data) {route.apply(this, ['button', button+':press', data]);});
  controller.on(button+':release',function(data) {route.apply(this, ['button', button+':release', data]);});
});
input.motion.map(function handleMotion(button) {
  controller.on(button+':motion',function(data) { console.log('Motion');route.apply(this, ['motion', button+':motion', data]);});
});
input.status.map(function handleStatus(button) {
  controller.on(button+':change',function(data) {route.apply(this, ['status', button+':change', data]);});
});
//controller.connect();
