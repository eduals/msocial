exports.index = {
	handler: function(request, reply) {
		var data = '<h2>Map Social Application</h2>'
		reply(data)
	}
}

exports['bg.jpg'] = {
	handler: function(request, reply) {
		reply.file('bg.jpg')
	}
}

exports.docs = {
	handler: function(request, reply) {
		reply.file('docs.html')
	}
}