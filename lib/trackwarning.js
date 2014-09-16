var Joi = require('Joi')
var User = require('../models/user').User
var MapWarning = require('../models/mapwarning').MapWarning
var Config = require('./config')
var Redis = require('redis')

exports.sendWarning = {
	validate: {
		payload: {
			type: Joi.string().required(),
			location: Joi.array().length(2).required(),
			memo: Joi.string(),
			sentBy: Joi.string()
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
				reply(err)
			} else {
				reply({ message: 'Added new warning successful' })
			}
		})
	}
}