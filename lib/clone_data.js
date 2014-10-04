var User = require('../models/user')
var Markers = require('../models/markers')
var MarkerType = require('../models/marker_type')
var Config = require('./config')
var client = require('request');

exports.run = {
	handler: function(request, reply){
		User.findOne({username: "demo"}, function(err, user){
			if (err) return reply(err);
			return get_data(5.000000, 105.000000, reply);
		});
	}
}

function get_data(lat, lng, reply){
	client('http://222.255.28.13:8087/poi/get_near_by_location?xmin='+lng+'&ymin='+lat+'&xmax='+(lng+0.01).toFixed(2)+'&ymax='+(lat+0.01).toFixed(2), function(err, res, body){
		console.log(body);
		if((lat == 25.00) && (lng == 115.00)) return reply({message: "Done"});
		else if(lat == 25.00) return get_data(5.00, lng+0.01);
		else return get_data(lat+0.01, lng);
	});
}