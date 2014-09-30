var Config = require('./config');
var Hapi = require('hapi');


//Filter IP Address with configs
module.exports.checkExceptIP = function(ipAddress){
	if(Config.exceptIPs.indexOf(ipAddress) >= 0) return true;
	var arr = ipAddress.split(".");
	for(i=0; i<arr.length; i++){
		var ipTmp = arr[0];
		for(k=1; k < arr.length-i; k++){
			ipTmp += "."+arr[k];
		}
		for(j=arr.length-i; j< arr.length; j++){
			ipTmp += ".*"
		}
		if(Config.exceptIPs.indexOf(ipTmp) >= 0) return true;
	}
	return false;
}

//Call error
module.exports.errorIP = function(reply){
	var error = Hapi.error.badRequest('Not found');
	error.output.statusCode = 404;
	error.reformat();
	error.output.payload.custom = 'IP address not permission';
	reply(error);
}