var Mongoose = require('mongoose');
var ExtFunctions = require('./ext_functions');
var node_xj = require("xls-to-json");
var multiparty = require('multiparty');
var Markers = require('../models/markers');
var MarkerType = require('../models/marker_type');

exports.genForm = {
	handler: function(request, reply){
		console.log(request.info.remoteAddress);
		if(!ExtFunctions.checkExceptIP(request.info.remoteAddress)){
			return ExtFunctions.errorIP(reply);
		}
		var MongoModel = require("../models/"+request.params.name);
		MongoModel.find(request.query, function(err, data){
			if(err) return reply({error: err});
			return reply({
				data: data
			});
		});
	}
}

exports.postForm = {
	handler: function(request, reply){
		if(!ExtFunctions.checkExceptIP(request.info.remoteAddress)){
			return ExtFunctions.errorIP(reply);
		}
		var MongoModel = require("../models/"+request.params.name);
		MongoModel.create(request.query, function(err, data){
			if(err) return reply({error: err});
			return reply({data: data});
		})
	}
}

exports.deleteForm = {
	handler: function(request, reply){
		if(!ExtFunctions.checkExceptIP(request.info.remoteAddress)){
			return ExtFunctions.errorIP(reply);
		}
		var ObjectId = Mongoose.Types.ObjectId;
		var MongoModel = require("../models/"+request.params.name);
		var object = {};
		if(request.payload.id){
			object = {_id: new ObjectId(request.payload.id)};
		}

		MongoModel.remove(object, function(err){
			if(err) return reply({error: err});
			return reply({status: true});
		});
	}
}

exports.importData = {
	payload:{
		maxBytes: 209715200,
		output:'stream',
		parse: false
	},
	handler: function(request, reply){
		var form = new multiparty.Form();
		form.parse(request.payload, function(err, fields, files) {
			console.log(err, fields, files);
			if(err) return reply(err);
			if(!files.file) return reply({message: "File not found"});
			node_xj({
				input: files.file[0].path,
			    output: null  // input xls
			}, function(err, result) {
				if(err) {
					return console.error(err);
					reply({status: "Error"});
				} else {
					return do_working(0, result, reply);
				}
			});
		});

		function do_working(i, result, reply){
			console.log("RUNING "+i);
			if(i == (result.length - 1)){
				return reply({status: "Done"});
			}
			MarkerType.findOne({code: result[i].type}, function(err, type){
				if (err) {
					console.log({error: err});
					return do_working(i+1, result, reply);
				}
				else if (!type) {
					console.log({message: "This type code "+ result[i].type +" does not exist"});
					return do_working(i+1, result, reply);
				}
				else Markers.findOne({'lat_lng.lat': result[i].lat, 'lat_lng.lng': result[i].lng, marker_type: type._id}, function(err, marker){
					if (err) {
						console.log({error: err});
						return do_working(i+1, result, reply);
					}
					if (marker) {
						console.log({error: err});
						return do_working(i+1, result, reply);
					}
					else{
						var obj = {
							name: (result[i].name.replace(" ","") != "")?result[i].name:type.name + " " + result[i].info,
							marker_type: type._id,
							lat_lng: {
								lat: result[i].lat,
								lng: result[i].lng
							},
							status: "ACCEPT"
						};
						Markers.create(obj, function(err, data){
							if(err) {
								console.log({error: err});
								return do_working(i+1, result, reply);
							}
							return do_working(i+1, result, reply);
						});
					}
				});
			});
		}
	}
}

exports.importDataFind = {
	payload:{
		maxBytes: 209715200,
		output:'stream',
		parse: false
	},
	handler: function(request, reply){
		var form = new multiparty.Form();
		form.parse(request.payload, function(err, fields, files) {
			console.log(err, fields, files);
			if(err) return reply(err);
			if(!files.file) return reply({message: "File not found"});
			node_xj({
				input: files.file[0].path,
			    output: null  // input xls
			}, function(err, result) {
				if(err) {
					return console.error(err);
					reply({status: "Error"});
				} else {
					return do_working(0, result, reply);
				}
			});
		});

		function do_working(i, result, reply){
			console.log("RUNING "+i);
			if(i == (result.length - 1)){
				return reply({status: "Done"});
			}
			MarkerType.findOne({code: result[i]['GEN_TYPE']}, function(err, type){
				if (err) {
					console.log({error: err});
					return do_working(i+1, result, reply);
				}
				else if (!type) {
					console.log({message: "This type code "+ result[i].type +" does not exist"});
					return do_working(i+1, result, reply);
				}
				else Markers.findOne({'lat_lng.lat': result[i].lat, 'lat_lng.lng': result[i].lng, marker_type: type._id}, function(err, marker){
					if (err) {
						console.log({error: err});
						return do_working(i+1, result, reply);
					}
					if (marker) {
						console.log({error: err});
						return do_working(i+1, result, reply);
					}
					else{
						var obj = {
							name: result[i]['POI_VN'],
							marker_type: type._id,
							lat_lng: {
								lat: result[i]["LAT"],
								lng: result[i]["LON"]
							},
							description: {
								address: result[i]["ADDRESS"]
							},
							star_point: result[i]["RATING"],
							like_count: result[i]["LIKES"],
							status: "ACCEPT"
						};
						Markers.create(obj, function(err, data){
							if(err) {
								console.log({error: err});
								return do_working(i+1, result, reply);
							}
							return do_working(i+1, result, reply);
						});
					}
				});
			});
		}
	}
}
