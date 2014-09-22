var Joi = require('Joi')
var User = require('../models/user')
var Config = require('./config')
var Redis = require('redis')
var bcrypt = require('bcrypt')

exports.getInfo = {
	handler: function(request, reply){
		User.findOne({token: request.params.token}, function(err, user){
			if(err) return reply({error: err});
			if(!user) return reply({error: "Token is not define"});
			reply(user);
		})
	}
}

exports.changePassword = {
	handler: function(request, reply){
		User.findOne({token: request.params.token}, function(err, user){
			if(err) return reply({error: err});
			if(!user) return reply({error: "Token is not define"});
			else{
				if(bcrypt.compareSync(request.query.old_password, user.password)){
					var new_pass = bcrypt.hashSync(request.query.new_password, 8);
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
		User.findOne({token: request.params.token}, function(err, user){
			if(err) return reply({error: err});
			if(!user) return reply({error: "Token is not define"});
			else{
				User.update({_id: user._id}, {
					first_name: request.query.first_name?request.query.first_name:(user.first_name?user.first_name:""),
					last_name: request.query.last_name?request.query.last_name:(user.last_name?user.last_name:""),
					phone_number: request.query.phone_number?request.query.phone_number:(user.phone_number?user.phone_number:""),
					address: request.query.address?request.query.address:(user.address?user.address:""),
					avatar: request.query.avatar?request.query.avatar:(user.avatar?user.avatar:"")
				}, function(err){
					if(err) return reply({error: err});
					reply({status: true});
				});
			}
		})
	}
}