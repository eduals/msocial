var Mongoose = require('../lib/database').Mongoose



var UserSchema = new Mongoose.Schema({
	email:				{ type: String, require: true },
	username:			{ type: String, require: true },
	password:			{ type: String, require: true },
	phoneNumber: 	{ type: Number, require: false },
	token:				{ type: String, require: true },
	fbId:					{ type: Number, require: true },
	fbName:				{ type: String,	require: true },
	createdAt:		{ type: Date, 	require: true, 	default: Date.now }
})

// UserSchema.methods.setPassword = function(password) {
// 	bcrypt.genSalt(10, function(err, salt) {
// 		bcrypt.hash(password, salt, function(err, hash) {
// 			this.password = hash
// 		})
// 	})
// }

// UserSchema.methods.isValidPassword = function(password) {
// 	bcrypt.compare(password, this.password, function(err, res) {
// 		if (err) console.log(err)
// 		return res
// 	})
// }

var User = Mongoose.model('User', UserSchema)

exports.User = User;