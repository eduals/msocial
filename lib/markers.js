var Joi = require('Joi')
var User = require('../models/user')
var Markers = require('../models/markers')
var MarkerType = require('../models/marker_type')
var MarkerCategories = require('../models/marker_categories')
var Config = require('./config')
var Redis = require('redis')
var Geo = require('./geo')
var LatLon = require('./latlon')
var Likes = require('../models/likes')

exports.get = {
	handler: function(request, reply){
		if(!request.query.angel || !request.query.location_lat || !request.query.location_lng){
			return reply({
				error: "Bad request"
			});
		}
		var lat = request.query.location_lat;
		var lng = request.query.location_lng;
		var dist = request.query.angel;
		var lat_min = LatLon(lat, lng).destinationPoint(180, dist).lat;
		var lat_max = LatLon(lat, lng).destinationPoint(0, dist).lat
		var lng_max = LatLon(lat, lng).destinationPoint(90, dist).lon;
		var lng_min = LatLon(lat, lng).destinationPoint(270, dist).lon;
		var obj = {$and:[{'lat_lng.lat': {$gte: lat_min, $lte: lat_max}}, {'lat_lng.lng': {$gte: lng_min, $lte: lng_max}}, {status: "ACCEPT"}]};
		if(request.query.marker_type){
			MarkerType.findOne({code: request.query.marker_type}, function(err, type){
				if(err) return reply({error: err});
				if(!type) return reply({error: "Type's not found"});
				obj = {$and:[{'lat_lng.lat': {$gte: lat_min, $lte: lat_max}}, {'lat_lng.lng': {$gte: lng_min, $lte: lng_max}}, {marker_type: type._id}, {status: "ACCEPT"}]}
				do_working();
			});
		}
		else{
			if(request.query.marker_category){
				MarkerCategories.findOne({code: request.query.marker_category}, function(err, cat){
					if(err) return reply({error: err});
					if(!cat) return reply({error: "Category's not found"});
					MarkerType.find({category_id: cat._id}, function(err, types){
						if(err) return reply({error: err});
						var tmpId = [];
						for(var i=0; i<types.length; i++){
							tmpId.push(types[i]._id);
						}
						obj = {$and:[{'lat_lng.lat': {$gte: lat_min, $lte: lat_max}}, {'lat_lng.lng': {$gte: lng_min, $lte: lng_max}}, {marker_type: {$in: tmpId}}, {status: "ACCEPT"}]}
						do_working();
					});
				});
			}
			else do_working();
		}

		function do_working(){
			Markers.find(obj, function(err, markers){
				if(err) return reply({error: err});
				else{
					var markersTmp = [];
					for(var i=0; i<markers.length; i++){
						if((LatLon(lat, lng).distanceTo(LatLon(markers[i].lat_lng.lat, markers[i].lat_lng.lng), 4)) > dist) continue;
						markersTmp.push(markers[i]);
					}
					reply({
						markers: markersTmp,
						location: [lat_max, lng_max]
					});
				}
			});
		}
	}
}

exports.set = {
	handler: function(request, reply){
		if(!request.query.marker_type || !request.query.location_lat || !request.query.location_lng){
			return reply({
				error: "Bad request"
			});
		}
		
	}
}