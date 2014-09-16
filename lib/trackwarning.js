var Joi = require('Joi')
var User = require('../models/user').User
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

	}
}