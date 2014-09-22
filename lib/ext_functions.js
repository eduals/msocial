var Config = require('./config');
var Hapi = require('hapi');


//Filter IP Address with configs
module.exports.check_except_ip = function(ip_address){
	if(Config.except_ips.indexOf(ip_address) >= 0) return true;
	var arr = ip_address.split(".");
	for(i=0; i<arr.length; i++){
		var ip_tmp = arr[0];
		for(k=1; k < arr.length-i; k++){
			ip_tmp += "."+arr[k];
		}
		for(j=arr.length-i; j< arr.length; j++){
			ip_tmp += ".*"
		}
		if(Config.except_ips.indexOf(ip_tmp) >= 0) return true;
	}
	return false;
}

//Call error
module.exports.error_ip = function(reply){
	var error = Hapi.error.badRequest('Not found');
	error.output.statusCode = 404;
	error.reformat();

	error.output.payload.custom = 'IP address not permission';

	reply(error);
}