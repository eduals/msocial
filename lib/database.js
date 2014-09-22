var Mongoose = require('mongoose')
var Config = require('./config')


// simple
Mongoose.connect('mongodb://' + Config.db.url + '/' + Config.db.dbname)

// production
// Mongoose.connect('mongodb://' + Config.db.username + ':' + Config.db.password + '@' + Config.db.url + ':' + Config.db.port + '/' + Config.db.dbname)

var db = Mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function callback(){
	console.log('Connection to MongoDB server succeeded!')
})

exports.Mongoose = Mongoose
// exports.db = db