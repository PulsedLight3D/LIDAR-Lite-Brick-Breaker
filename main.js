const serial = chrome.serial; /* Interprets an ArrayBuffer as UTF-8 encoded string data. */
const storage = chrome.storage.local;
const DEVICE_KEY = 'serialDevice';

var ab2str = function(buf) {
		var bufView = new Uint8Array(buf);
		var encodedString = String.fromCharCode.apply(null, bufView);
		return decodeURIComponent(escape(encodedString));
	}; /* Converts a string to UTF-8 encoding in a Uint8Array; returns the array buffer. */
var str2ab = function(str) {
		var encodedString = unescape(encodeURIComponent(str));
		var bytes = new Uint8Array(encodedString.length);
		for (var i = 0; i < encodedString.length; ++i) {
			bytes[i] = encodedString.charCodeAt(i);
		}
		return bytes.buffer;
	};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

var SerialConnection = function() {
		this.connectionId = -1;
		this.lineBuffer = "";
		this.boundOnReceive = this.onReceive.bind(this);
		this.boundOnReceiveError = this.onReceiveError.bind(this);
		this.onConnect = new chrome.Event();
		this.onReadLine = new chrome.Event();
		this.onError = new chrome.Event();
	};
SerialConnection.prototype.onConnectComplete = function(connectionInfo) {
	if (!connectionInfo) {
		log("Connection failed.");
		return;
	}
	this.connectionId = connectionInfo.connectionId;
	serial.onReceive.addListener(this.boundOnReceive);
	serial.onReceiveError.addListener(this.boundOnReceiveError);
	this.onConnect.dispatch();
};
SerialConnection.prototype.onReceive = function(receiveInfo) {
	if (receiveInfo.connectionId !== this.connectionId) {
		return;
	}
	this.lineBuffer += ab2str(receiveInfo.data);
	var index;
	while ((index = this.lineBuffer.indexOf('\n')) >= 0) {
		var line = this.lineBuffer.substr(0, index + 1);
		this.onReadLine.dispatch(line);
		this.lineBuffer = this.lineBuffer.substr(index + 1);
	}
};
SerialConnection.prototype.onReceiveError = function(errorInfo) {
	if (errorInfo.connectionId === this.connectionId) {
		this.onError.dispatch(errorInfo.error);
	}
};
SerialConnection.prototype.getDevices = function(callback) {
	serial.getDevices(callback);
};
SerialConnection.prototype.connect = function(path) {
	serial.connect(path, {
		bitrate: 115200
	}, this.onConnectComplete.bind(this));
	//   serial.connect(path, this.onConnectComplete.bind(this))  
};
SerialConnection.prototype.send = function(msg) {
	if (this.connectionId < 0) {
		throw 'Invalid connection';
	}
	serial.send(this.connectionId, str2ab(msg), function() {});
};
SerialConnection.prototype.disconnect = function() {
	if (this.connectionId < 0) {
		throw 'Invalid connection';
	}
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

var calibrationBox = false;
var gameBox = false;
var calibrateLeft;
var calibrateRight;
var scalerValue = 1;
var positionValue = 0;


var connection = new SerialConnection();
connection.onConnect.addListener(function() {
	// remove the connection drop-down
	document.querySelector('#connect_box').style.display = 'none';
	document.querySelector('#calibration_box').style.display = 'block';
	calibrationBox = true;
});


var distanceValue;

connection.onReadLine.addListener(function(line) {

	distanceValue = line;
	if(calibrationBox){
		document.querySelector('#calibration_distance').innerHTML = distanceValue;	
	}else if(gameBox){
		
		
	}

// 			positionValue = ;				
// 			positionValue = 5 * Math.round((positionValue)/5);
			lidarlitemove((parseInt(distanceValue)-calibrateLeft)*scalerValue);						

		

		

		
});


// Populate the list of available devices
connection.getDevices(function(ports) {
	// get drop-down port selector
	var dropDown = document.querySelector('#port_list');
	// clear existing options
	dropDown.innerHTML = "";
	// add new options
	ports.forEach(function(port) {
		var displayName = port.path;
		if (!displayName) displayName = port.path;
		var newOption = document.createElement("option");
		newOption.text = displayName;
		newOption.value = port.path;
		dropDown.appendChild(newOption);
	});

  storage.get(null, function(prefs) {
    if (prefs.lastDevice) {
      dropDown.value = prefs.lastDevice;
    }
  });
});
// Handle the 'Connect' button
document.querySelector('#connect_button').addEventListener('click', function() {
	// get the device to connect to
	var dropDown = document.querySelector('#port_list');
	devicePath = dropDown.options[dropDown.selectedIndex].value;

	storage.set({lastDevice: devicePath});

	// connect
	connection.connect(devicePath);
});

reload_app.onclick = function(){
	chrome.runtime.reload();
}

reload_game.onclick = function(){
	chrome.runtime.reload();
}

calibrate_done.onclick = function(){
		document.querySelector('#calibration_box').style.display = 'none';
	document.querySelector('#game_box').style.display = 'block';
	calibrationBox = false;
	gameBox = true;
	scalerValue = fieldW/(calibrateRight - calibrateLeft);
	game();
}

calibrate_game.onclick = function(){
	document.querySelector('#calibration_box').style.display = 'block';
	document.querySelector('#game_box').style.display = 'none';
	gameBox = false;
	calibrationBox = true;
}

info.onclick = function(){
	document.querySelector('#info_overlay').style.display = 'block';
}

close_overlay.onclick = function(){
	document.querySelector('#info_overlay').style.display = 'none';
}


calibrate_left.onclick = function(){
		calibrateLeft = distanceValue;
		console.log(calibrateLeft);		
	if(!isNaN(calibrateLeft) && !isNaN(calibrateRight)){
		document.querySelector('#calibrate_done').style.display = 'block';
	}
	document.querySelector('#calibrate_left_value').innerHTML = calibrateLeft + ' cm';		
}
calibrate_right.onclick = function(){
		calibrateRight = distanceValue;
		console.log(calibrateRight);		
	if(!isNaN(calibrateLeft) && !isNaN(calibrateRight)){
		document.querySelector('#calibrate_done').style.display = 'block';
	}		
	document.querySelector('#calibrate_right_value').innerHTML = calibrateRight + ' cm';		
}


/*
clearCanvas.onclick = function(){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect( 0 , 0 , 900,900);
	ctx.fill();
};
*/
