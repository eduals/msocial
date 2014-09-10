var Hapi = require('hapi')
var Path = require('path')
var Config = require('./lib/config')
var Routes = require('./lib/routes')
var jwt = require('jsonwebtoken')
var User = require('./models/user').User

var server = new Hapi.Server(
	Config.server.port, 
	{ files: { relativeTo: Path.join(__dirname, 'public') } }
)

server.ext('onRequest', function(request, next) {
	console.log(request.path, request.query)
	next()
})

server.pack.register(require('hapi-auth-bearer-token'), function(err) {
	server.auth.strategy('token', 'bearer-access-token', {
		validateFunc: function(token, callback) {
			var user = new User()
			jwt.verify(token, Config.token.privateKey, function(err, decoded) {
				if (err) console.log(err)
				User.findById(decoded.id, function(err, user) {
					if (err) console.log(err)
					if(token === user.token) {
						callback(null, true, {token: token})
					} else {
						callback(null, false, {token: token})
					}
				})
			})
		}
	})
})

server.route(Routes.paths)

server.start(function() {
	console.log('Server is running at:', Config.server.hostname, 'on port', Config.server.port)
})