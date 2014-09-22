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
var Comments = require('../models/comments')
var Reports = require('../models/reports')

exports.get = {
	validate: {
		query: {
			angel: Joi.string().required(),
			location_lat: Joi.string().required(),
			location_lng: Joi.string().required()
		}
	},
	handler: function(request, reply){
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
	validate: {
		payload: {
			marker_type: Joi.string().required(),
			location_lat: Joi.string().required(),
			location_lng: Joi.string().required(),
			name: Joi.string().required()
		}
	},
	handler: function(request, reply){
		User.findOne({token: request.params.token}, function(err, user){
			if(err) return reply(err);
			if(!user) return reply({error: "Token\'is not valid"});
			else{
				MarkerType.findOne({code: request.marker_type}, function(err, type){
					if (err) return reply({error: err});
					else if (!type) return reply({error: "Type\'s not valid"});
					Markers.create({
						name: request.payload.name,
						marker_type: type._id,
						lat_lng: {
							lat: request.payload.location_lat,
							lng: request.payload.location_lng
						},
						description: request.payload.description?request.payload.description:{},
						images: request.payload.images?request.payload.images:{},
						create_by: user._id
					}, function(err, data){
						if(err) return reply({error: err});
						reply({status: true});
					});
				})
			}
		})
	}
}

exports.getDetails = {
	validate: {
		payload: {
			id: Joi.string().required(),
			token: Joi.string()
		}
	},
	handler: function(request, reply){
		Markers.findOne({_id: request.payload.id}, function(err, data){
			if (err) return reply({error: err});
			if (!data) return reply({error: "Marker's not valid"})
			Comments.find({marker_id: data._id}, function(err, dataCm){
				if(err) return reply({error: err});
				Reports.find({marker_id: data._id}, function(err, dataReport){
					if(err) return reply({error: err});
					Likes.find({marker_id: data._id}, function(err, dataLike){
						if(err) return reply({error: err});
						var liked = false;
						if(!request.payload.token) return do_response(data, dataCm, dataLike, dataReport, liked);
						User.findOne({token: request.payload.token}, function(err, user){
							if(err) return reply({error: err});
							if(!data) return reply({error: "Token's not define"});
							for(var i=0; i<dataLike.length; i++){
								if(dataLike[i].create_by == user.id){
									liked = true;
									break;
								}
							}
							return do_response(data, dataCm, dataLike, dataReport, liked);
						})
					})
				})
			})
		});

		function do_response(data, dataCm, dataLike, dataReport, liked){
			reply({
				status: true,
				data: data,
				comments: dataCm,
				likes: dataLike,
				reports: dataReport,
				liked: liked
			});
		}
	}
}

exports.likeUnlike = {
	validate: {
		payload: {
			id: Joi.string().required(),
			token: Joi.string().required()
		}
	},
	handler: function(request, reply){
		User.findOne({token: request.payload.token}, function(err, user){
			if(err) return reply({error: err});
			if(!user) return reply({error: "Token's not define"});
			Likes.findOne({marker_id: request.payload.id, create_by: user._id}, function(err, data){
				if(err) return reply({error: err});
				if(!data){
					Likes.create({marker_id: request.payload.id, create_by: user._id}, function(err, likeData){
						if(err) return reply({error: err});
						reply({
							status: true,
							liked: true
						});
					});
				}
				else{
					Likes.remove({marker_id: request.payload.id, create_by: user._id}, function(err){
						if(err) return reply({error: err});
						reply({
							status: true,
							liked: false
						});
					});
				}
			});
		})
	}
}

exports.comments = {
	validate: {
		payload: {
			id: Joi.string().required(),
			token: Joi.string().required(),
			comment: Joi.string().required()
		}
	},
	handler: function(request, reply){
		User.findOne({token: request.payload.token}, function(err, user){
			if(err) return reply({error: err});
			if(!user) return reply({error: "Token's not define"});
			Comments.create({marker_id: request.payload.id, create_by: user._id, description: request.payload.comment}, function(err, data){
				if(err) return reply({error: err});
				reply({
					status: true,
					data: data
				})
			});
		})
	}
}

exports.getWarning = {
	validate: {
		query: {
			angel: Joi.string().required(),
			location_lat: Joi.string().required(),
			location_lng: Joi.string().required(),
			direction: Joi.string().required(),
			direction_radius: Joi.string()
		}
	},
	handler: function(request, reply){
		var lat = request.query.location_lat;
		var lng = request.query.location_lng;
		var direction_radius = request.query.direction_radius?parseFloat(request.query.direction_radius):90;
		if (direction_radius > 360) direction_radius = direction_radius%60;
		var direction_left = parseFloat(request.query.direction) - direction_radius/2;
		var direction_right = parseFloat(request.query.direction) + direction_radius/2;
		var direction_left_tmp = 0;
		var direction_right_tmp = 0;
		if (direction_left < 0){
			direction_left_tmp = 360 + direction_left;
			direction_left = 0;
		}
		if (direction_right > 360){
			direction_right_tmp = direction_right - 360;
			direction_right = 360;
		}

		var dist = parseFloat(request.query.angel);
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
						var rad = LatLon(lat, lng).distanceTo(LatLon(markers[i].lat_lng.lat, markers[i].lat_lng.lng), 4);
						var dir = LatLon(lat, lng).bearingTo(LatLon(markers[i].lat_lng.lat, markers[i].lat_lng.lng));
						if(rad > dist) continue;
						if((dir >= direction_left) && (dir <= direction_right))
							markersTmp.push(markers[i]);
						if((direction_left_tmp !=0) && (dir >= direction_left_tmp) && (dir < 360))
							markersTmp.push(markers[i]);
						if((direction_right_tmp !=0 || direction_right == 360) && (dir >= 0) && (dir <= direction_right_tmp))
							markersTmp.push(markers[i]);
					}
					reply({
						markers: markersTmp,
						location: [lat_max, lng_max],
						direction_tmp: [direction_left_tmp, direction_right_tmp]
					});
				}
			});
		}
	}
}