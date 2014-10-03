var soap = require('soap');
var Config = require('./config');
var User = require('../models/user');
var Joi = require('joi');

exports.info = {
	validate: {
		payload: {
			locationLat: Joi.string().required(),
			locationLng: Joi.string().required(),
		}
	},
	handler: function(request, reply){
		var args = {
			key: Config.soap.iMapkey,
			geoType: 'Reserve_Geocode',
			coords: request.payload.locationLng+'|'+request.payload.locationLat
		};
		soap.createClient(Config.soap.iMapService, function(err, client) {
			if (err) return reply(err);
			client.GetGeocodeInfor(args, function(err, result) {
				if (err) return reply(err);
				var addressArr = result.GetGeocodeInforResult.Result.split(", ");
				var infoExpand = {
					number: null,
					street: null,
					village: null,
					district: null,
					province: null
				};
				var tags = ['number', 'street', 'village', 'district', 'province'];
				var j = (addressArr.length-1);
				var i = (tags.length-1);
				while(true){
					infoExpand[tags[i]] = addressArr[j];
					j--;
					i--;
					if(j<0 || i <0) break;
				}
				reply({
					message: "Success",
					info: result.GetGeocodeInforResult.Result,
					infoExpand: infoExpand
				})
			});
		});
	}
}