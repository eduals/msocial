var Joi = require('joi')
var User = require('../models/user')
var Config = require('./config')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

exports.register = {
	handler: function(request, reply) {
		var user = new User()
		user.email = request.payload.email
		user.username = request.payload.username
		user.password = bcrypt.hashSync(request.payload.password, 8)
		user.token = jwt.sign({id: user._id}, Config.token.privateKey, { expiresInMinutes: Config.token.expires })

		user.save(function(err, user) {
			if (err) { 
				reply(err);
			} else {
				console.log('New User: ' + user.username + ' with id: ' + user._id)
				reply({
					message: 'Register successful',
					userId: user._id,
					username: user.username,
					email: user.email,
					token: user.token
				})
			}
		});
	},
	auth: false
}

exports.login = {
	handler: function(request, reply) {
		User.findOne({username: request.payload.username}, function(err, user) {
			if (err) {
				console.log(err)
			} else {
				if (!user) {
					reply({message: 'Wrong username or password'})
				} else {
					if(bcrypt.compareSync(request.payload.password, user.password)){
						reply({
							userId: user._id,
							message: 'Login successful',
							token: user.token,
							username: user.username,
							email: user.email
						})	
					}
					else{
						reply({message: 'Wrong username or password'})
					}			
				}
			}
		})
	},
	auth: false
}

exports.facebookMobile = {
	handler: function(request, reply) {
		User.findOne({fbId: request.payload.fbId}, function(err, user) {
			if (err) {
				console.log(err)
			} else {
				if(!user) {
					var user = new User()
					user.token = jwt.sign({id: user._id}, Config.token.privateKey, { expiresInMinutes: Config.token.expires })
					user.fbId = request.payload.fbId
					user.email = request.payload.email
					user.fullName = request.payload.fullName
					user.save(function(err, user) {
						if (err) {
							console.log(err)
							reply(err)
						} else {
							console.log('New Account (Facebook) created! ' + user.fbId)
							reply({
								userId: user._id,
								message: 'New account (Facebook) created!',
								token: user.token
							})
						}
					})
				} else {
					console.log('Facebook account found: ' + user.fbId)
					reply({
						userId: user._id,
						message: 'Account (Facebook) existed. Logged in!',
						token: user.token
					})
				}
			}
		})
	},
	auth: false
}

exports.logout = {
	handler: function(request, reply) {
		reply({message: 'Logout successful'})
	},
	auth: 'token'
}

exports.getData = {
	handler: function(request, reply) {
		reply('Data Retrieved')
	},
	auth: 'token'
}