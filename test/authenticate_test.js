var User = require('../models/user')
var request = require('superagent')
var expect = require('expect.js')

describe('Testing authentication features', function(){
	var token = null;

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
			token = res.body.token
			done()
		})
	})

	it('#3A Test the login request', function(done){
		request.post('localhost:3000/login')
		.send({ username: 'test1', password: 'password1'})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).to.equal('Login successful')
			expect(res.body.token).to.equal(token)
			done()
		})
	})

	it('#3B Login failed if the password is wrong', function(done){
		request.post('localhost:3000/login')
		.send({ username: 'test1', password: 'password2'})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).to.equal('Wrong username or password')
			done()
		})
	})

	it('#3C Also return error message when the username is wrong', function(done){
		request.post('localhost:3000/login')
		.send({ username: 'test2', password: 'password1'})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).to.equal('Wrong username or password')
			done()
		})
	})

	it("#4 Should retrieve the data if the token is right", function(done){
		request.get('localhost:3000/getdata')
		.set('Authorization', 'Bearer ' + token)
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.text).to.equal('Data Retrieved')
			done()
		})
	})

	it("#5 Should deny authentication if the token is wrong", function(done){
		request.get('localhost:3000/getdata')
		.set('Authorization', 'Bearer 3254534')
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).equal('An internal server error occurred')
			done()
		})
	})

	it("#6 Should prompt for authentication if no token provided", function(done){
		request.get('localhost:3000/getdata')
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).equal('Missing authentication')
			done()
		})
	})

	it("#7 should create new account through Facebook SDK if fbId not found", function(done){
		request.post('localhost:3000/login/facebook-mobile')
		.send({fbId: "99999999", email: "test2@email.com", fullName: "Test Pro"})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(Object.keys(res.body).length).to.equal(2)
			expect(res.body.message).equal("New account (Facebook) created!")
			expect(res.body.token.length).equal(171)
			done()
		})
	})

	it("#8 should sync data from db if fbId existed", function(done){
		request.post('localhost:3000/login/facebook-mobile')
		.send({fbId: "99999999", email: "test2@email.com", fullName: "Test Pro"})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(Object.keys(res.body).length).to.equal(2)
			expect(res.body.message).equal("Account (Facebook) existed. Logged in!")
			expect(res.body.token.length).equal(171)
			done()
		})
	});

	User.remove({email: 'test@email.com'}, function() {})
	User.remove({email: 'test2@email.com'}, function() {})
})