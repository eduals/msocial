var Misc = require('./misc');
var Auth = require('./authentication');
var TrackWarning = require('./trackwarning');
var UserInfo = require('./users');
var Private = require('./private');
var Markers = require('./markers');

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
	{ method: 'POST', path: '/login/facebook-mobile',	config: Auth.facebookMobile },

	// Warning Tracker
	{ method: 'POST',	path: '/action/setwarning',			config: TrackWarning.sendWarning },
	{ method: 'GET', 	path: '/action/getwarning',			config: TrackWarning.getWarning },

	//Privte control
	{ method: 'GET', 		path: '/private/genform/{name?}',			config: Private.genForm },
	{ method: 'POST', 	path: '/private/postform/{name?}',			config: Private.postForm },
	{ method: 'POST', 	path: '/private/deleteform/{name?}',		config: Private.deleteForm },

	// User control
	{ method: 'POST', 	path: '/user/getinfo',		config: UserInfo.getInfo},
	{ method: 'POST', 	path: '/user/changepass',		config: UserInfo.changePassword},
	{ method: 'POST', 	path: '/user/changeinfo/{token?}',		config: UserInfo.changeInfo},

	//Marker control
	{ method: 'GET', 		path: '/markers/get',		config: Markers.get},
	{ method: 'POST', 	path: '/markers/set/{token?}',		config: Markers.set},
	{ method: 'POST', 	path: '/markers/getdetails',		config: Markers.getDetails},
	{ method: 'GET', 		path: '/markers/getwarning',		config: Markers.getWarning},

	//Social control
	{ method: 'POST', 	path: '/markers/like_unlike',		config: Markers.likeUnlike},
	{ method: 'POST', 	path: '/markers/comment',		config: Markers.comments}

]