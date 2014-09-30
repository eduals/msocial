var Mongoose = require('mongoose');
var ExtFunctions = require('./ext_functions');

exports.genForm = {
	handler: function(request, reply){
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