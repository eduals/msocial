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

	it('#2 Test the get authorization', function(done){
		done()
	})

	it('#3 Test the post authorization', function(done){
		done()
	})
})