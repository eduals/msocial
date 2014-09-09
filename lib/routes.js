var Misc = require('./misc')
var Auth = require('./authentication')

exports.paths = [

	// Misc Routes
	{ method: 'GET',	path: '/',					config: Misc.index },
	{ method: 'GET',	path: '/bg.jpg',		config: Misc['bg.jpg'] },
	{ method: 'GET', 	path: '/docs',			config: Misc.docs },

	//Authentication Routes
	{ method: 'POST',	path: '/register',	config: Auth.register },
	{ method: 'POST',	path: '/login',			config: Auth.login },
	{ method: 'GET', 	path: '/logout',		config: Auth.logout }
	
]