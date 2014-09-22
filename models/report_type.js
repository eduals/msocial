var Mongoose = require('../lib/database').Mongoose

var ReportTypeSchema = new Mongoose.Schema({
	code: {type: String, required: true, unique: true},
	name: {type: String, required: true},
	description: {type: String, required: false}
})

var ReportType = Mongoose.model("ReportType", ReportTypeSchema)

module.exports = ReportType