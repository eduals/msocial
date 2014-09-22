var Mongoose = require('../lib/database').Mongoose
var Markers = require('./markers');
var User = require('./user');

var CommentsSchema = new Mongoose.Schema({
	marker_id: { type: Mongoose.Schema.Types.ObjectId, ref: 'Markers', required: true},
	create_by: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	description: {type: String, required: true},
	create_on: { type: Date, 	required: true, 	default: Date.now }
});

var  Comments = Mongoose.model("Comments", CommentsSchema);

module.exports = Comments;