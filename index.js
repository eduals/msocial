var Hapi = require('hapi')
var Path = require('path')
var Config = require('./lib/config')
var Routes = require('./lib/routes')

var server = new Hapi.Server(Config.server.port, { files: { relativeTo: Path.join(__dirname, 'public') } })

server.ext('onRequest', function(request, next) {
	console.log(request.path, request.query)
	next()
})

server.route(Routes.paths)

server.start(function() {
	console.log('Server is running at:', Config.server.hostname, 'on port', Config.server.port)
})