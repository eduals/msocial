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
		port: '' || 28017
	},

	token: {
		privateKey: '346reojiu3459y235uIUIUFHSKH35',
		expires: 60
	}
}