var Mongoose = require('../lib/database').Mongoose

var MapWarningSchema = new Mongoose.Schema {
	type: 				{ type: String, 	require: true,	default: [] },
	location:			{ type: Array,		require: true,		}
	memo:					{ type: String, 	require: false },
	sentBy:				{ type: ObjectId,	require: true, 	ref: 'User' },
	sentAt:				{ type: Date,			require: true,	default: Date.now }
}

var MapWarning = Mongoose.model("MapWarning", MapWarningSchema)

exports.MapWarning = MapWarning