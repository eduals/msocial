var Mongoose = require('../lib/database').Mongoose

var User = require('./user')

var MapWarningSchema = new Mongoose.Schema({
	type: 				{ type: String, 	required: true },
	location:			{ type: Array,		required: true,	default: [] },
	memo:					{ type: String, 	required: true },
	sentBy:				{ type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	sentAt:				{ type: Date,			required: true,	default: Date.now }
})

var MapWarning = Mongoose.model("MapWarning", MapWarningSchema)

module.exports = MapWarning