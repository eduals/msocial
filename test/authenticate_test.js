var request = require('superagent')
var expect = require('expect.js')
var User = require('../models/user').User

describe('Testing authentication features', function(){
	var token = null;

  // beforeEach(function(done){    
  //   //add some test data    
  //   customer.register("test@test.com", "password", "password", function(doc){      
  //     currentCustomer = doc;      
  //     done();    
  //   });  
  // });  

  after(function(done){
		User.remove({email: 'test@email.com'}, function() {      
    	done()
  	})
  });

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

	it('#3 Test the login request', function(done){
		request.post('localhost:3000/login')
		.send({ username: 'test1', password: 'password1'})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).to.equal('Login successful')
			expect(res.body.token).to.equal(token)
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
})