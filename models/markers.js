var Mongoose = require('../lib/database').Mongoose
var MarkerType = require('./marker_type');
var User = require('./user');

var MarkersSchema = new Mongoose.Schema({
	marker_type: { type: Mongoose.Schema.Types.ObjectId, ref: 'MarkerType', required: true},
	name: {type: String, required: true},
	lat_lng: {
		lat: {type: Number, required: true},
		lng: {type: Number, required: true},
	},
	description: {
		address:{
			number: {type: String, required: false, default: ""},
			street: {type: String, required: false, default: ""},
			district: {type: String, required: false, default: ""},
			province: {type: String, required: false, default: ""}
		},
		info_review: {type: String, required: true, default: ""}
	},
	images: {
		avatar: {type: String, required: false, default: ""},
		slide: {type: String, required: false, default: ""}
	},
	star_point: {type: Number, required: true, default: 0},
	create_by: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	create_on: { type: Date, 	required: true, 	default: Date.now },
	//PENDING|ACCEPT|DISABLE|REPORT for status
	status: {type: String, required: true, default: "PENDING"}
});

var Markers = Mongoose.model("Markers", MarkersSchema)

module.exports = Markers;