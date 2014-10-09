var Joi = require('joi')
var User = require('../models/user')
var Config = require('./config')
var bcrypt = require('bcrypt')

// err von da la 1 json object roi nen khong can phai them err:
// tat ca response de o dang {message: "Noi dung"}
exports.getInfo = {
	handler: function(request, reply){
		User.findOne({token: request.payload.token}, 'email username fullName phone like_count start_point', function(err, user){
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
		User.findOne({token: request.payload.token}, function(err, user){
			if(err) return reply(err);
			if(!user) return reply({message: "Invalid Token"});
			else{
				User.update({_id: user._id}, {
					first_name: request.payload.firstName ? request.payload.firstName : (user.first_name?user.first_name:""),
					last_name: request.payload.lastName ? request.payload.lastName : (user.last_name?user.last_name:""),
					phone_number: request.payload.phoneNumber ? request.payload.phoneNumber : (user.phone_number?user.phone_number:""),
					address: request.payload.address ? request.payload.address : (user.address?user.address:""),
					avatar: request.payload.avatar ? request.payload.avatar : (user.avatar?user.avatar:"")

				}, function(err){
					if(err) return reply(err);
					reply({message: 'Your profile has been updated successfully'});
				});
			}
		})
	}
}