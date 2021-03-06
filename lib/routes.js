var Misc = require('./misc');
var Auth = require('./authentication');
var UserInfo = require('./users');
var Private = require('./private');
var Markers = require('./markers');
var Files = require('./files');
var GeoService = require('./geo_service');
var CloneData = require('./clone_data');

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

	//Privte control
	{ method: 'GET', 	path: '/private/genform/{name?}',				config: Private.genForm },
	{ method: 'POST', 	path: '/private/postform/{name?}',			config: Private.postForm },
	{ method: 'POST', 	path: '/private/deleteform/{name?}',		config: Private.deleteForm },
	{ method: 'POST', 	path: '/private/importdata',		config: Private.importData },
	{ method: 'POST', 	path: '/private/importdatafind',		config: Private.importDataFind },

	// User control

	{ method: 'POST', 	path: '/user/getinfo',			config: UserInfo.getInfo},

	{ method: 'POST', 	path: '/user/changepass',		config: UserInfo.changePassword},
	{ method: 'POST', 	path: '/user/changeinfo',		config: UserInfo.changeInfo},

	//Marker control
	{ method: 'POST', 	path: '/markers/get',		config: Markers.get},
	{ method: 'POST', 	path: '/markers/getmarkers',		config: Markers.getMarkers},
	{ method: 'POST', 	path: '/markers/find',		config: Markers.find},
	{ method: 'POST', 	path: '/markers/set',		config: Markers.set},
	{ method: 'POST', 	path: '/markers/getdetails',		config: Markers.getDetails},
	{ method: 'POST', 	path: '/markers/getwarning',		config: Markers.getWarning},
	{ method: 'POST', 	path: '/markers/getmarkerswarning',		config: Markers.getMarkersWarning},
	{ method: 'POST', 	path: '/markers/reports',		config: Markers.reports},
	{ method: 'POST', 	path: '/markers/getreports',		config: Markers.getReports},
	{ method: 'POST', 	path: '/markers/getcomments',		config: Markers.getComments},
	{ method: 'POST', 	path: '/markers/getlikes',		config: Markers.getLikes},
	{ method: 'POST',	path: '/markers/gettypes',	config: Markers.getTypes},

	//Social control
	{ method: 'POST', 	path: '/markers/like_unlike',		config: Markers.likeUnlike},
	{ method: 'POST', 	path: '/markers/comment',		config: Markers.comments},


	//Files control
	{ method: 'POST', path: '/files/upload', config: Files.upload},
	{ method: 'GET', path: '/files/download/{file?}', config: Files.download},

	//Geo service
	{ method: 'POST', path: '/geoservice/info', config: GeoService.info},

	// //Clone data
	// { method: 'GET', path: '/clonedata/run', config: CloneData.run},
]