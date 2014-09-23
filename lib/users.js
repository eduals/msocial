var Joi = require('Joi')
var User = require('../models/user')
var Config = require('./config')
var Redis = require('redis')
var bcrypt = require('bcrypt')

// err von da la 1 json object roi nen khong can phai them err:
// tat ca response de o dang {message: "Noi dung"}
exports.getInfo = {
	handler: function(request, reply){
		User.findOne({token: request.payload.token}, 'email username fullName phone', function(err, user){
			if(err) return reply(err);
			if(!user) return reply({message: "Bad Request. Invalid Token"});
			reply(user);
		})
	}
}

exports.changePassword = {
	handler: function(request, reply){
		User.findOne({token: request.payload.token}, function(err, user){
			if(err) return reply(err);
			if(!user) return reply({message: "Invalid Token"});
			else{
				if(bcrypt.compareSync(request.payload.oldPassword, user.password)){
					var newPassword = bcrypt.hashSync(request.payload.newPassword, 8);
					User.update({_id: user._id}, {password: newPassword}, function(err){
						if(err) return reply(err)
						console.log("Changed")
						reply({message: "Password has been changed successfully"});
					});
				}
				else return reply({message: "Wrong password"});
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