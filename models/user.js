var Mongoose = require('../lib/database').Mongoose
var bcrypt = require('bcrypt')


var UserSchema = new Mongoose.Schema({
	email:				{ type: String, required: true, unique: true},
	username:			{ type: String, required: false, unique: true},
	password:			{ type: String, required: false},
	phone_number: 		{ type: String, required: false },
	token:				{ type: String, required: true },
	star_point: 		{ type: Number, required: true, default: 0},
	like_count: 		{ type: Number, required: true, default: 0},
	fbId:				{ type: Number, required: false},
	fullName:			{ type: String,	required: false },
	avatar: 			{ type: String, required: false },
	address: 			{ type: String, required: false },
	is_ban: 			{ type: Boolean, required: false},
	createdAt:		{ type: Date, 	required: true, default: Date.now}
});



var User = Mongoose.model('User', UserSchema)

module.exports = User