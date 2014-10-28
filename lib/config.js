module.exports = {
	server: {
		hostname: 'localhost',
		port: process.env.PORT || 3000,
		socketPort: 8080
	},

	db: {
		username: '',
		password: '',
		url: 'localhost',
		dbname: 'msocial',
		port: '' || 27017
	},

	redis: {
		repo: 'msocial',
		port: '' || 6379
	},

	token: {
		privateKey: '346reojiu3459y235uIUIUFHSKH35',
		expires: 60
	},

	facebook: {
		password: '3468oerjfikf345gi32u23JSF',
		appId: '352185904859185',
		appSecret: '39d7eac40d00cf5160ad2a1d2d3a6f6c'
	},

	exceptIPs: ['127.0.0.1', '192.168.1.*', '113.190.*.*', '117.0.*.*'],

	uploadFolder: "/Users/me866chuan/Desktop/Projects/Node/msocial/files",

	codeAccept: [],

	pointMinForShare: 10,
	starPerShare: 3,
	starPerLike: 1,

	soap: {
		iMapService : 'http://222.255.28.13:8080/iMapServices/GeoService/Geocoding.asmx?WSDL',
		iMapkey: 'RtaNBl23amjMZG3YbVE55+PnPtA9icXz7s0RcIRzmjk='
	}

}
