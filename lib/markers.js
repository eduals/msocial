var Joi = require('joi')
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
var ReportType = require('../models/report_type')

exports.get = {
	validate: {
		payload: {
			distance: Joi.number().required(),
			locationLat: Joi.number().required(),
			locationLng: Joi.number().required(),
			markerType: Joi.string(),
			markerCategories: Joi.string()
		}
	},
	handler: function(request, reply){
		var lat = request.payload.locationLat;
		var lng = request.payload.locationLng;
		var dist = request.payload.distance;
		var latMin = LatLon(lat, lng).destinationPoint(180, dist).lat;
		var latMax = LatLon(lat, lng).destinationPoint(0, dist).lat
		var lngMax = LatLon(lat, lng).destinationPoint(90, dist).lon;
		var lngMin = LatLon(lat, lng).destinationPoint(270, dist).lon;
		var obj = {$and:[{'lat_lng.lat': {$gte: latMin, $lte: latMax}}, {'lat_lng.lng': {$gte: lngMin, $lte: lngMax}}, {status: "ACCEPT"}]};
		if(request.payload.markerType){
			MarkerType.findOne({code: request.payload.markerType}, function(err, type){
				if(err) return reply(err);
				if(!type) return reply({message: "Type's not found"});
				obj = {$and:[{'lat_lng.lat': {$gte: latMin, $lte: latMax}}, {'lat_lng.lng': {$gte: lngMin, $lte: lngMax}}, {marker_type: type._id}, {status: "ACCEPT"}]}
				doWorking();
			});
		}
		else{
			if(request.payload.markerCategories){
				MarkerCategories.findOne({code: request.payload.markerCategories}, function(err, cat){
					if(err) return reply(err);
					if(!cat) return reply({message: "Category's not found"});
					MarkerType.find({category_id: cat._id}, function(err, types){
						if(err) return reply(err);
						var tmpId = [];
						for(var i=0; i<types.length; i++){
							tmpId.push(types[i]._id);
						}
						obj = {$and:[{'lat_lng.lat': {$gte: latMin, $lte: latMax}}, {'lat_lng.lng': {$gte: lngMin, $lte: lngMax}}, {marker_type: {$in: tmpId}}, {status: "ACCEPT"}]}
						doWorking();
					});
				});
			}
			else do_working();
		}

		function doWorking(){
			Markers.find(obj, function(err, markers){
				if(err) return reply({error: err});
				else{
					var markersTmp = [];
					for(var i=0; i<markers.length; i++){
						if((LatLon(lat, lng).distanceTo(LatLon(markers[i].lat_lng.lat, markers[i].lat_lng.lng), 4)) > dist) continue;
						markersTmp.push(markers[i]);
					}
					reply({
						markers: markersTmp
					});
				}
			});
		}
	}
}

exports.set = {
	validate: {
		payload: {
			markerType: Joi.string().required(),
			locationLat: Joi.number().required(),
			locationLng: Joi.number().required(),
			name: Joi.string().required(),
			description: Joi.object(),
			images: Joi.object(),
			token: Joi.string().required()
		}
	},
	handler: function(request, reply){
		User.findOne({token: request.payload.token}, function(err, user){
			if(err) return reply(err);
			if(!user) return reply({message: "Invalid token"});
			else{
				MarkerType.findOne({code: request.payload.markerType}, function(err, type){
					if (err) return reply({error: err});
					else if (!type) return reply({message: "This type code does not exist"});
					var obj = {
						name: request.payload.name,
						marker_type: type._id,
						lat_lng: {
							lat: request.payload.locationLat,
							lng: request.payload.locationLng
						},
						description: request.payload.description?request.payload.description:{},
						images: request.payload.images?request.payload.images:{},
						create_by: user._id
					};
					if(Config.codeAccept.indexOf(request.payload.markerType) >= 0){
						obj.status = "ACCEPT";
					}
					Markers.create(obj, function(err, data){
						if(err) return reply({error: err});
						if(data.status == "ACCEPT"){
							global.socket_io.sockets.emit('newMarker', obj);
						}
						reply({message: "Your submission has been received"});
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
			if (err) return reply(err);
			if (!data) return reply({message: "Marker's not valid"})
			Comments.find({marker_id: data._id}, function(err, dataCm){
				if(err) return reply(err);
				Reports.find({marker_id: data._id}, function(err, dataReport){
					if(err) return reply(err);
					Likes.find({marker_id: data._id}, function(err, dataLike){
						if(err) return reply(err);
						var liked = false;
						if(!request.payload.token) return do_response(data, dataCm, dataLike, dataReport, liked);
						User.findOne({token: request.payload.token}, function(err, user){
							if(err) return reply(err);
							if(!data) return reply({message: "Token's not define"});
							for(var i=0; i<dataLike.length; i++){
								if(dataLike[i].create_by == user.id){
									liked = true;
									break;
								}
							}
							return doResponse(data, dataCm, dataLike, dataReport, liked);
						})
					})
				})
			})
		});

		function doResponse(data, dataCm, dataLike, dataReport, liked){
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
			if(err) return reply(err);
			if(!user) return reply({message: "Token's not define"});
			Likes.findOne({marker_id: request.payload.id, create_by: user._id}, function(err, data){
				if(err) return reply(err);
				if(!data){
					Likes.create({marker_id: request.payload.id, create_by: user._id}, function(err, likeData){
						if(err) return reply(err);
						reply({
							message: "Success",
							liked: true
						});
					});
				}
				else{
					Likes.remove({marker_id: request.payload.id, create_by: user._id}, function(err){
						if(err) return reply(err);
						reply({
							message: "Success",
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
			if(err) return reply(err);
			if(!user) return reply({message: "Token's not define"});
			Comments.create({marker_id: request.payload.id, create_by: user._id, description: request.payload.comment}, function(err, data){
				if(err) return reply(err);
				reply({
					message: "Success",
					data: data
				})
			});
		})
	}
}

exports.getWarning = {
	validate: {
		payload: {
			distance: Joi.number().required(),
			locationLat: Joi.number().required(),
			locationLng: Joi.number().required(),
			direction: Joi.number().required(),
			directionRadius: Joi.string(),
			markerType: Joi.string(),
			markerCategories: Joi.string()
		}
	},
	handler: function(request, reply){
		var lat = request.payload.locationLat;
		var lng = request.payload.locationLng;
		var directionRadius = request.payload.directionRadius?parseFloat(request.payload.directionRadius):90;
		if (directionRadius > 360) directionRadius = directionRadius%60;
		var directionLeft = parseFloat(request.payload.direction) - directionRadius/2;
		var directionRight = parseFloat(request.payload.direction) + directionRadius/2;
		var directionLeftTmp = 0;
		var directionRightTmp = 0;
		if (directionLeft < 0){
			directionLeftTmp = 360 + directionLeft;
			directionLeft = 0;
		}
		if (directionRight > 360){
			directionRightTmp = directionRight - 360;
			directionRight = 360;
		}

		var dist = parseFloat(request.payload.distance);
		var latMin = LatLon(lat, lng).destinationPoint(180, dist).lat;
		var latMax = LatLon(lat, lng).destinationPoint(0, dist).lat
		var lngMax = LatLon(lat, lng).destinationPoint(90, dist).lon;
		var lngMin = LatLon(lat, lng).destinationPoint(270, dist).lon;
		var obj = {$and:[{'lat_lng.lat': {$gte: latMin, $lte: latMax}}, {'lat_lng.lng': {$gte: lngMin, $lte: lngMax}}, {status: "ACCEPT"}]};
		if(request.payload.markerType){
			MarkerType.findOne({code: request.payload.markerType}, function(err, type){
				if(err) return reply(err);
				if(!type) return reply({message: "Type's not found"});
				obj = {$and:[{'lat_lng.lat': {$gte: latMin, $lte: latMax}}, {'lat_lng.lng': {$gte: lngMin, $lte: lngMax}}, {marker_type: type._id}, {status: "ACCEPT"}]}
				doWorking();
			});
		}
		else{
			if(request.payload.markerCategories){
				MarkerCategories.findOne({code: request.payload.markerCategories}, function(err, cat){
					if(err) return reply(err);
					if(!cat) return reply({message: "Category's not found"});
					MarkerType.find({category_id: cat._id}, function(err, types){
						if(err) return reply(err);
						var tmpId = [];
						for(var i=0; i<types.length; i++){
							tmpId.push(types[i]._id);
						}
						obj = {$and:[{'lat_lng.lat': {$gte: latMin, $lte: latMax}}, {'lat_lng.lng': {$gte: lngMin, $lte: lngMax}}, {marker_type: {$in: tmpId}}, {status: "ACCEPT"}]}
						doWorking();
					});
				});
			}
			else doWorking();
		}

		function doWorking(){
			Markers.find(obj, function(err, markers){
				if(err) return reply({error: err});
				else{
					var markersTmp = [];
					for(var i=0; i<markers.length; i++){
						var rad = LatLon(lat, lng).distanceTo(LatLon(markers[i].lat_lng.lat, markers[i].lat_lng.lng), 4);
						var dir = LatLon(lat, lng).bearingTo(LatLon(markers[i].lat_lng.lat, markers[i].lat_lng.lng));
						if(rad > dist) continue;
						if((dir >= directionLeft) && (dir <= directionRight))
							markersTmp.push(markers[i]);
						if((directionLeftTmp !=0) && (dir >= directionLeftTmp) && (dir < 360))
							markersTmp.push(markers[i]);
						if((directionRightTmp !=0 || directionRight == 360) && (dir >= 0) && (dir <= directionRightTmp))
							markersTmp.push(markers[i]);
					}
					reply({
						markers: markersTmp
					});
				}
			});
		}
	}
}

exports.reports = {
	validate: {
		payload: {
			id: Joi.string().required(),
			reportType: Joi.string().required(),
			token: Joi.string().required(),
			newMarkerName: Joi.string(),
			newMarkerLocationLat: Joi.string(),
			newMarkerLocationLng: Joi.string()
		}
	},
	handler: function(request, reply){
		User.findOne({token: request.payload.token}, function(err, user){
			if(err) return reply(err);
			if(!user) return reply({message: "Token's not valid"});
			ReportType.findOne({code: request.payload.reportType}, function(err, type){
				if (err) return reply(err);
				if (!type) return reply({message: "Type's not found"});
				Markers.findOne({_id: request.payload.id}, function(err, data){
					if(err) return reply(err);
					if(!data) return reply({message: "Marker's not found"});
					if((request.payload.newMarkerName) || (request.payload.newMarkerLocationLat && )){
						doResponse({
							report_type: type._id,
							marker_id: request.payload.id,
							create_by: user._id,
							marker_change: {
								name: request.payload.newMarkerName,
								lat_lng: {
									lat: request.payload.newMarkerLocationLat,
									lng: request.payload.newMarkerLocationLng
								}
							}
						});
					}
					else doResponse({
						report_type: type._id,
						marker_id: request.payload.id,
						create_by: user._id
					});
				});
			});
			function doResponse(obj){
				Reports.create(obj, function(err, data){
					if(err) return reply(err);
					reply({
						message: "Success",
						data: data
					})
				});
			}
		})
	}
}

exports.getReports = {
	validate: {
		payload: {
			id: Joi.string().required()
		}
	},
	handler: function(request, reply){
		Reports.find({marker_id: request.payload.id}, function(err, data){
			if(err) return reply(err);
			reply({
				reports: data
			})
		});
	}
}

exports.getComments = {
	validate: {
		payload: {
			id: Joi.string().required()
		}
	},
	handler: function(request, reply){
		Comments.find({marker_id: request.payload.id}, function(err, data){
			if(err) return reply(err);
			reply({
				comments: data
			})
		});
	}
}

exports.getLikes = {
	validate: {
		payload: {
			id: Joi.string().required(),
			token: Joi.string()
		}
	},
	handler: function(request, reply){
		if(request.payload.token){
			User.findOne({token: request.payload.token}, function(err, user){
				if(err) return reply(err);
				if(!user) return reply({message: "Token's not valid"});
				Likes.findOne({marker_id: request.payload.id, create_by: user._id}, function(err, data){
					if(err) return reply(err);
					if(!data) return doResponse(false);
					doResponse(true);
				});
			});
		}
		else doResponse(false);
		function doResponse(liked){
			Likes.find({marker_id: request.payload.id}, function(err, data){
				if(err) return reply(err);
				reply({
					likes: data,
					liked: liked
				})
			});
		}
	}
}

exports.getTypes = {
	handler: function(request, reply){
		MarkerType.find({}, function(err, list){
			if(err) return reply(err);
			reply({types: list});
		});
	}
}