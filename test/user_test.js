var request = require('superagent')
var expect = require('expect.js')

describe('Testing users features', function(){
	var token = null;
	var host = "localhost:3000";

	it('Login', function(done){
		request.post(host+'/login')
		.send({ username: 'demo', password: '123456'})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).to.equal('Login successful')
			token = res.body.token
			done()
		})
	})

	it('#1 Test get info', function(done){
		request.post(host+'/user/getinfo')
		.send({token: token})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).to.equal(undefined)
			expect(res.body.username).to.equal('demo')
			done()
		})
	})

	it('#1B Test get info with not token', function(done){
		request.post(host+'/user/getinfo')
		.send({})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).to.equal("Bad Request. Invalid Token")
			expect(res.body.username).to.equal(undefined)
			done()
		})
	})
	it("#2A Test change pass", function(done){
		request.post(host+"/user/changepass")
		.send({token: token, oldPassword: '123456', newPassword: '123456'})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).to.equal("Password has been changed successfully")
			done()
		});
	});

	it("#2B Test change pass with fail old pass", function(done){
		request.post(host+"/user/changepass")
		.send({token: token, oldPassword: '1234567', newPassword: '123456'})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).to.equal("Wrong password")
			done()
		});
	});

	it("#3A Test change account info", function(done){
		request.post(host+"/user/changeinfo")
		.send({token: token})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).to.equal("Your profile has been updated successfully")
			done()
		})
	});
	it("#3B Test change account info", function(done){
		request.post(host+"/user/changeinfo")
		.send({token: token, first_name: "Test", last_name: "Demo", phone_number: "0986600032", address: "Hanoi", avatar: ""})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.message).to.equal("Your profile has been updated successfully")
			done()
		})
	});
})