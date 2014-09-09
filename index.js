var Hapi = require('hapi')
var Path = require('path')
var config = require('./lib/config')

var server = new Hapi.Server(config.server.port, { files: { relativeTo: Path.join(__dirname, 'public') } })

server.ext('onRequest', function(request, next) {
	console.log(request.path, request.query)
	next()
})

server.route({
	method: 'GET',
	path: '/',
	handler: function(request, reply) {
		reply('<h2>Map Social Application</h1>')
	}
})

server.route({
	method: 'GET',
	path: '/bg.jpg',
	handler: function(request, reply) {
		reply.file('bg.jpg')
	}
})

server.route({
	method: 'GET',
	path: '/docs',
	handler: function(request, reply) {
		reply.file('./docs.html')
	}
})

server.start(function() {
	console.log('Server is running at:', config.server.hostname, 'on port', config.server.port)
})