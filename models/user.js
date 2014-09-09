var Mongoose = require('../lib/database').Mongoose

var UserSchema = new Mongoose.Schema({
	email:				{ type: String, require: false },
	username:			{ type: String, require: true },
	password:			{ type: String, require: false },
	phoneNumber: 	{ type: Number, require: false },
	token:				{ type: String, require: true },
	createdAt:		{ type: Date, require: true, default: Date.now }
})

var User = Mongoose.model('User', UserSchema)

exports.User = User;