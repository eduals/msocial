var Joi = require('joi')
var User = require('../models/user').User
var Config = require('./config')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

exports.register = {
	validate: {
		payload: {
			email: Joi.string().email().required(),
			username: Joi.string().required(),
			password: Joi.string().required()
		}
	},
	handler: function(request, reply) {
		var user = new User()
		user.email = request.payload.email
		user.username = request.payload.username
		user.password = bcrypt.hashSync(request.payload.password, 10)
		user.token = jwt.sign({id: user._id}, Config.token.privateKey, { expiresInMinutes: Config.token.expires })

		user.save(function(err, user) {
			if (err) return console.log(err)
			console.log('New User: ' + user.username + ' with id: ' + user._id)
			reply({
				message: 'Register successful',
				token: user.token
			})
		})
	},
	auth: false
}

exports.login = {
	validate: {
		payload: {
			username: Joi.string().required(),
			password: Joi.string().required()
		}
	},
	handler: function(request, reply) {
		var user = new User()
		var query = User.where({username: request.payload.username})
		query.findOne(function(err, user) {
			if (err) console.log(err)

			bcrypt.compare(request.payload.password, user.password, function(err, res) {		
				if (err) console.log(err)
				if (res === true) {
					reply({
						message: 'Login successful',
						token: user.token
					})
				} else {
					reply({message: 'Wrong username or password'})
				}
			})

		})
	},
	auth: false
}

exports.logout = {
	handler: function(request, reply) {
		reply('In Development')
	},
	auth: 'token'
}

exports.getData = {
	handler: function(request, reply) {
		reply('Data Retrieved')
	},
	auth: 'token'
}