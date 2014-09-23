var Joi = require('Joi')
var User = require('../models/user')
var Config = require('./config')
var bcrypt = require('bcrypt')

exports.getInfo = {
	handler: function(request, reply){
		User.findOne({token: request.payload.token}, function(err, user){
			if(err) return reply({error: err});
			if(!user) return reply({error: "Bad Request. Invalid Token"});
			reply(user);
		})
	}
}

exports.changePassword = {
	handler: function(request, reply){
		User.findOne({token: request.payload.token}, function(err, user){
			if(err) return reply({error: err});
			if(!user) return reply({error: "Token is not define"});
			else{
				if(bcrypt.compareSync(request.payload.old_password, user.password)){
					var new_pass = bcrypt.hashSync(request.payload.new_password, 8);
					User.update({_id: user._id}, {password: new_pass}, function(err){
						if(err) return reply({error: err});
						reply({status: true});
					});
				}
				else return reply({error: "Password is wrong"});
			}
		})
	}
}

exports.changeInfo = {
	handler: function(request, reply){
		User.findOne({token: request.payload.token}, function(err, user){
			if(err) return reply({error: err});
			if(!user) return reply({error: "Token is not define"});
			else{
				User.update({_id: user._id}, {
					first_name: request.payload.first_name?request.payload.first_name:(user.first_name?user.first_name:""),
					last_name: request.payload.last_name?request.payload.last_name:(user.last_name?user.last_name:""),
					phone_number: request.payload.phone_number?request.payload.phone_number:(user.phone_number?user.phone_number:""),
					address: request.payload.address?request.payload.address:(user.address?user.address:""),
					avatar: request.payload.avatar?request.payload.avatar:(user.avatar?user.avatar:"")
				}, function(err){
					if(err) return reply({error: err});
					reply({status: true});
				});
			}
		})
	}
}