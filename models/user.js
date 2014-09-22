var Mongoose = require('../lib/database').Mongoose
var bcrypt = require('bcrypt')


var UserSchema = new Mongoose.Schema({
	email:				{ type: String, required: true, unique: true, match: /\S+@\S+\.\S+/},
	username:			{ type: String, required: true, unique: true },
	password:			{ type: String, required: true },
	phone_number: { type: String, required: false },
	token:				{ type: String, required: true},
	fbId:					{ type: Number, required: false},
	first_name:		{ type: String,	required: false},
	last_name: {type: String, require: false},
	avatar: {type: String, required: false},
	address: {type: String, required: false},
	is_ban: {type: Boolean, required: false},
	createdAt:		{ type: Date, 	required: true, default: Date.now}
});


// UserSchema.path('password').set(function(password) {
// 	return bcrypt.hashSync(password, 8);
// });

var User = Mongoose.model('User', UserSchema)

module.exports = User