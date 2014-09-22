var Mongoose = require('../lib/database').Mongoose
var MarkerCategories = require('./marker_categories');

var MarkerTypeSchema = new Mongoose.Schema({
	category_id: { type: Mongoose.Schema.Types.ObjectId, ref: 'MarkerCategories', required: true},
	code: {type: String, required: true, unique: true},
	name: {type: String, required: true},
	description: {type: String, required: false},
	icon: {type: String, required: false}
});

var  MarkerType = Mongoose.model("MarkerType", MarkerTypeSchema);

module.exports = MarkerType;