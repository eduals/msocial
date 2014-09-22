var Mongoose = require('../lib/database').Mongoose
var Markers = require('./markers');
var ReportType = require('./report_type');
var User = require('./user');

var ReportsSchema = new Mongoose.Schema({
	report_type: { type: Mongoose.Schema.Types.ObjectId, 	required: true, ref: 'ReportType' },
	marker_id: { type: Mongoose.Schema.Types.ObjectId, 	required: true, ref: 'Markers' },
	marker_change: { type: Mongoose.Schema.Types.ObjectId, 	required: true, ref: 'Markers' },
	create_by: { type: Mongoose.Schema.Types.ObjectId, 	required: true, ref: 'User' },
	create_on: { type: Date, 	required: true, 	default: Date.now }
})

var Reports = Mongoose.model("Reports", ReportsSchema)

module.exports = Reports