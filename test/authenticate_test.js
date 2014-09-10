var request = require('superagent')
var expect = require('expect.js')

describe('Testing authentication features', function(){
	it('#1 Test get the home page', function(done){
		request.get('localhost:3000').end(function(res){
			expect(res).to.exists
			expect(res.status).to.equal(200)
			expect(res.text).to.contain('Map Social Application')

			done()
		})
	})

	it('#2 Test to register a new account', function(done){
		request.post('localhost:3000/register')
		.send({
			email: 'test@email.com',
			username: 'test1',
			password: 'password1'
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(Object.keys(res.body).length).to.equal(2)
			expect(res.body.token.length).to.equal(171)
			done()
		})
	})

	it('#3 Test the post authorization', function(done){
		request.post('localhost:3000/login')
		.send({authorization: 'Bearer ' + token})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.text).to.contain('Welcome!')
			done()
		})
	})
})