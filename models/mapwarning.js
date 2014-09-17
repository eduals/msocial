var Mongoose = require('../lib/database').Mongoose

var User = require('./user')

var MapWarningSchema = new Mongoose.Schema({
	type: 				{ type: String, 	require: true },
	location:			{ type: Array,		require: true,	default: [] },
	memo:					{ type: String, 	require: false },
	sentBy:				{ type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
	sentAt:				{ type: Date,			require: true,	default: Date.now }
})

var MapWarning = Mongoose.model("MapWarning", MapWarningSchema)

exports.MapWarning = MapWarning