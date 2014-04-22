window.onload = function() {
		new NodecopterStream(document.getElementById("drone-stream"));
		var socket = io.connect('http://localhost:8082');
		socket.on('dualshock', function (data) {
			if(data.type=='button') {
				handleButton(data);
			}

			
			if(data.type=='analog') {
				handleAnalog(data);
			}
		});
		function normalizeDroneVelocity(vel) {
			var max = 100;
			return (Math.round(vel)/max+0.5*max)+'%';
		}
		socket.on('ardrone', function (data) {

			if(data.type=='position') {



				var el = document.getElementById('drone-velocity-knob');
				el.style.top = normalizeDroneVelocity(data.data.velocity.y);
				el.style.left = normalizeDroneVelocity(data.data.velocity.x);


				// roll
				var elRoll = document.getElementById('horizon');
				elRoll.setAttribute('style', 'transform: rotate('+Math.round(data.data.rotation.roll)+'deg); -webkit-transform: rotate('+Math.round(data.data.rotation.roll)+'deg);');
				// rotation
				var elRoll = document.getElementById('droneStream');
				elRoll.setAttribute('style', 'transform: rotate('+Math.round(data.data.rotation.roll)+'deg); -webkit-transform: rotate('+Math.round(data.data.rotation.roll)+'deg);');
			}
		});
	}
	function handleButton(data) {
		var desc = data.event.split(':');
		var el = document.getElementById('dualshock-'+desc[0]);
		if(desc[1] == 'press') {
			el.className = 'pressed';
		} else if(desc[1] =  'release') {
			el.className = 'released';
		}
	}
	function handleAnalog(data) {
		var desc = data.event.split(':');
		var el = document.getElementById('dualshock-'+desc[0]+'-knob');
		el.style.left = data.data.x/2.55+'%';
		el.style.top = data.data.y/2.55+'%';
	}		