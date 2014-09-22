var Joi = require('Joi')
var User = require('../models/user')
var MapWarning = require('../models/mapwarning')
var Config = require('./config')
var Redis = require('redis')

exports.sendWarning = {
	validate: {
		payload: {
			type: Joi.string().required(),
			location: Joi.array().length(2).required(),
			memo: Joi.string(),
			sentBy: Joi.string(),
		}
	},
	handler: function(request, reply){
		var mapWarning = new MapWarning()
		mapWarning.type = request.payload.type
		mapWarning.location = request.payload.location
		mapWarning.memo = request.payload.memo
		mapWarning.sentBy = request.payload.sentBy
		mapWarning.save(function(err, mapWarning) {
			if (err) {
				console.log(err)
				reply(err)
			} else {
				User.findById(mapWarning.sentBy, function(err, result) {
					console.log(result)
				})
				reply({ message: 'Added new warning successful' })
			}
		})
	},
	auth: false
}

exports.getWarning = {
	handler: function(request, reply){
		MapWarning.find({}).sort({'sentAt': -1}).limit(20).populate('sentBy', 'username fullName').exec(function(err, warnings){
			console.log(warnings)
			reply(warnings)
		})
	}
}