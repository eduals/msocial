var jwt = require('jsonwebtoken')

exports.index = {
	handler: function(request, reply) {
		var data = '<h2>Map Social Application</h2>'
		reply(data)
	}
}

exports['bg.jpg'] = {
	handler: function(request, reply) {
		reply.file('./public/bg.jpg')
	}
}

exports.docs = {
	handler: function(request, reply) {
		reply.file('./public/docs.html')
	}
}

exports.test = {
	handler: function(request, reply) {
		var token = jwt.sign({id: 213}, 'as3252')
		var decoded = jwt.decode(token)
		reply(decoded)
	}
}