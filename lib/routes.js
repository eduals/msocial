var Misc = require('./misc')
var Auth = require('./authentication')

exports.paths = [

	// Misc Routes
	{ method: 'GET',	path: '/',											config: Misc.index },
	{ method: 'GET',	path: '/bg.jpg',								config: Misc['bg.jpg'] },
	{ method: 'GET', 	path: '/docs',									config: Misc.docs },
	{ method: 'GET', 	path: '/test',									config: Misc.test },

	//Authentication Routes
	{ method: 'POST',	path: '/register',							config: Auth.register },
	{ method: 'POST',	path: '/login',									config: Auth.login },
	{ method: 'GET', 	path: '/logout',								config: Auth.logout },
	{ method: 'GET', 	path: '/getdata',								config: Auth.getData },
	{ method: 'POST', path: '/login/facebook-mobile',	config: Auth.facebookMobile }
]