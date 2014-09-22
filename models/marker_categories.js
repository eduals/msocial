var Mongoose = require('../lib/database').Mongoose

var MarkerCategoriesSchema = new Mongoose.Schema({
	name: {type: String, required: true},
	code: {type: String, required: true, unique: true},
	description: {type: String, required: false},
	icon: {type: String, required: false}
});

var  MarkerCategories = Mongoose.model("MarkerCategories", MarkerCategoriesSchema)

module.exports = MarkerCategories;