var request = require('superagent')
var expect = require('expect.js')

describe('Testing users features', function(){
	var token = null;

	request.post('localhost:3000/login')
		.send({ username: 'demo', password: '123456'})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).to.equal('Login successful')
			token = res.body.token
		});

	it('#1 Test get info', function(done){
		request.get('localhost:3000/user/getinfo')
		.send({token: token})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).equal(null)
			expect(res.username).to.equal('demo')
			expect(res.token).not.to.equal(null)
			done()
		})
	})

})