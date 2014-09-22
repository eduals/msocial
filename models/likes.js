var Mongoose = require('../lib/database').Mongoose
var Markers = require('./markers');
var User = require('./user');

var LikesSchema = new Mongoose.Schema({
	marker_id: { type: Mongoose.Schema.Types.ObjectId, ref: 'Markers', required: true},
	create_by: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	create_on: { type: Date, required: true, 	default: Date.now }
})

var Likes = Mongoose.model("Likes", LikesSchema)

module.exports = Likes