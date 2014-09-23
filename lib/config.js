module.exports = {
	server: {
		hostname: 'localhost',
		port: process.env.PORT || 3000
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

	except_ips: ['127.0.0.1', '192.168.1.*'],

	uploadFolder: "/Users/me866chuan/Desktop/Projects/Node/msocial/files"
}