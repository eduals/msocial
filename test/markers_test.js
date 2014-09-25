var request = require('superagent')
var expect = require('expect.js')

describe('Testing markers features', function(){
	var token = null;
	var host = "localhost:3000";
	var marker = null;

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

	it('#1 get all markers', function(done){
		request.post(host+'/markers/get')
		.send({
			angel: 1,
			location_lat: 21.0098302,
			location_lng: 105.8477864
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.markers).not.to.equal(undefined)
			marker = res.body.markers[0]._id
			done()
		})
	});

	it('#2 get markers by type', function(done){
		request.post(host+'/markers/get')
		.send({
			angel: 1,
			location_lat: 21.0098302,
			location_lng: 105.8477864,
			marker_type: 'ATM'
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.markers).not.to.equal(undefined)
			done()
		})
	});

	it('#3 get markers by category', function(done){
		request.post(host+'/markers/get')
		.send({
			angel: 1,
			location_lat: 21.0098302,
			location_lng: 105.8477864,
			marker_categories: 'FIND'
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.markers).not.to.equal(undefined)
			done()
		})
	});

	it('#4 get markers warning', function(done){
		request.post(host+'/markers/getwarning')
		.send({
			angel: 1,
			location_lat: 21.0098302,
			location_lng: 105.8477864,
			direction: 69
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.markers).not.to.equal(undefined)
			done()
		})
	});

	it('#5 set markers', function(done){
		request.post(host+'/markers/set')
		.send({
			marker_type: "ATM",
			location_lat: 21.0098302,
			location_lng: 105.8477864,
			name: "Test",
			description: {
				address: "Hanoi"
			},
			images: {
				slide: ""
			},
			token: token
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.message).to.equal("Your submission has been received")
			done()
		})
	});

	it('#6 get details marker', function(done){
		request.post(host+'/markers/getdetails')
		.send({
			id: marker,
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.status).to.equal(true)
			expect(res.body.data).not.to.equal(undefined)
			expect(res.body.liked).to.equal(false)
			done()
		})
	});

	it('#7 like/unlike', function(done){
		request.post(host+'/markers/like_unlike')
		.send({
			id: marker,
			token: token
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.status).to.equal(true)
			done()
		})
	});

	it('#8 comments', function(done){
		request.post(host+'/markers/comment')
		.send({
			id: marker,
			token: token,
			comment: "Test comment"
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.status).to.equal(true)
			done()
		})
	});

	it('#9A reports', function(done){
		request.post(host+'/markers/reports')
		.send({
			id: marker,
			token: token,
			report_type: "54228cf157c116ad26cfd9ec"
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.status).to.equal(true)
			done()
		})
	});

	it('#9B reports with change', function(done){
		request.post(host+'/markers/reports')
		.send({
			id: marker,
			token: token,
			report_type: "54228cf157c116ad26cfd9ec",
			new_marker: {
				location: {
					lat: 1,
					lng: 1
				},
				name: "Test"
			}
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.status).to.equal(true)
			done()
		})
	});

	it('#10 get reports', function(done){
		request.post(host+'/markers/getreports')
		.send({
			id: marker,
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.reports).not.to.equal(undefined)
			done()
		})
	});

	it('#11 get comments', function(done){
		request.post(host+'/markers/getcomments')
		.send({
			id: marker,
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.comments).not.to.equal(undefined)
			done()
		})
	});

	it('#12A get likes', function(done){
		request.post(host+'/markers/getlikes')
		.send({
			id: marker,
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.likes).not.to.equal(undefined)
			expect(res.body.liked).not.to.equal(undefined)
			done()
		})
	});

	it('#12B get likes with token', function(done){
		request.post(host+'/markers/getlikes')
		.send({
			id: marker,
			token: token
		})
		.end(function(e, res){
			expect(e).to.equal(null)
			expect(res.body.error).to.equal(undefined)
			expect(res.body.likes).not.to.equal(undefined)
			expect(res.body.liked).not.to.equal(undefined)
			done()
		})
	});
})