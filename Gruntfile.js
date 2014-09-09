module.exports = function(grunt) {
	grunt.initConfig({
		sshconfig: {
			staging: {
				host: 'staging.skipfile.com',
				username: 'root',
				password: 'Hemlock1@'
			}
		},
		sshexec: {
			deploy: {
				command: [
					'cd /home/app',
					'git pull origin master',
					'npm install',
					'forever stop index.js',
					'forever start index.js',
					'forever list'
				].join(' && '),
				options: {
					config: 'staging',
				}
			}
		}
	})

	grunt.registerTask('deploy', ['sshexec:deploy'])
	grunt.loadNpmTasks('grunt-ssh')
}