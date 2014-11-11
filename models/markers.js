var Mongoose = require('../lib/database').Mongoose
var User = require('./user');

var MarkersSchema = new Mongoose.Schema({
	marker_type: { type: Mongoose.Schema.Types.ObjectId, ref: 'MarkerType', required: true},
	name: {type: String},
	lat_lng: {
		lat: {type: Number, required: true},
		lng: {type: Number, required: true}
	},
	description: {
		address:{ type: String, required: false },
		// 	number: {type: String, required: false},
		// 	street: {type: String, required: false},
		// 	district: {type: String, required: false},
		// 	province: {type: String, required: false}
		// },
		info_review: {type: String, required: false}
	},
	images: {
		avatar: {type: String, required: false},
		slide: {type: String, required: false}
	},
	star_point: {type: Number, required: true, default: 0},
	like_count: {type: Number, required: true, default: 0},
	create_by: { type: Mongoose.Schema.Types.ObjectId, ref: 'User'},//, required: true},
	create_on: { type: Date, 	required: true, 	default: Date.now },
	//PENDING|ACCEPT|DISABLE for status
	status: {type: String, required: true, default: "PENDING"}
});
MarkersSchema.index({ marker_type: 1, lat_lng: 1 });

var Markers = Mongoose.model("Markers", MarkersSchema)


module.exports = Markers;