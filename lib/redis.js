var Redis = require('redis')
var redisClient = Redis.createClient()

redisClient.on("error", function(err) {
	console.log("Error: " + err)
})

redisClient.on("connect", sampleRedis)

function sampleRedis() {
	redisClient.set("FirstKey", "@323523", function(err, reply) {
		console.log(reply.toString())
		console.log("SET KEY")
	})

	redisClient.get("FirstKey", function(err, reply) {
		console.log(reply.toString())
		console.log("GET KEY")
	})
}