var http = require("http"),
    drone = require("dronestream"),
    path = require('path'),
    arDrone = require('ar-drone');

var server = http.createServer(function(req, res) {
  require("fs").createReadStream(path.join(__dirname, '../public', 'index.html')).pipe(res);
});

drone.listen(server, { ip: "192.168.1.1"});
server.listen(5555);
