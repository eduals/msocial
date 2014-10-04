var Mongoose = require('../lib/database').Mongoose
var Markers = require('./markers');
var User = require('./user');

var ReportsSchema = new Mongoose.Schema({
	marker_id: { type: Mongoose.Schema.Types.ObjectId, 	required: true, ref: 'Markers' },
	create_by: { type: Mongoose.Schema.Types.ObjectId, 	required: true, ref: 'User' },
	create_on: { type: Date, 	required: true, 	default: Date.now }
})

var MarkersShare = Mongoose.model("MarkersShare", ReportsSchema)

module.exports = MarkersShare


//For multi person share one marker.