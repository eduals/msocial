var Hapi = require('hapi')
var Path = require('path')
var Config = require('./lib/config')
var Routes = require('./lib/routes')
var jwt = require('jsonwebtoken')
var User = require('./models/user')
var SocketIO = require('socket.io')

var serverOptions = {
	cors: true
}

var server = new Hapi.Server(Config.server.port)

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

server.pack.register(require('bell'), function(err) {
	server.auth.strategy('facebook', 'bell', {
		provider: 'facebook',
		password: Config.facebook.password,
		clientId: Config.facebook.appId,
		clientSecret: Config.facebook.appSecret,
		isSecure: false
	})

	server.route({
		method: ['GET', 'POST'],
		path: '/login/facebook',
		config: {
			auth: 'facebook',
			handler: function(request, reply) {
				var query = User.where({fbId: request.auth.credentials.profile.id})
				query.findOne(function(err, user) {
					if (err) return reply(err)
					if (!user) {
						var user = new User()
						user.token = jwt.sign({id: user._id}, Config.token.privateKey, { expiresInMinutes: Config.token.expires })
						user.fbId = request.auth.credentials.profile.id
						user.fullName = request.auth.credentials.profile.displayName
						user.email = request.auth.credentials.profile.email
						user.save(function(err, user) {
							if (err) {
								return reply(err)
							} else {
								return reply({
									message: 'New Account created',
									token: user.token
								})
							}
						})
					} else {
						reply({
							message: 'Account Existed',
							token: user.token
						})
					}
				})
				// Will perform account lookup or registration, token assignment then redirect back here
				// Move to misc.js and routes.js when refactoring
			}
		}
	})
})

server.route(Routes.paths)

server.start(function() {
	console.log('Server is running at:', Config.server.hostname, 'on port', Config.server.port);
	global.socket_io = SocketIO.listen(server.listener);
	var io = global.socket_io;
	var people_online = 0;
	io.sockets.on('connection', function (socket) {
		people_online++;
		io.sockets.emit('countOnline', people_online);
		socket.on('disconnect', function () {
			people_online--;
			io.sockets.emit('countOnline', people_online);
		});
	});
})