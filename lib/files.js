var fs = require('fs');
var multiparty = require('multiparty');
var configs = require('./config');
var md5 = require('MD5');
var Joi = require('Joi')

exports.upload = {
	payload:{
		maxBytes:209715200,
		output:'stream',
		parse: false
	},
	handler: function(request, reply){
		var form = new multiparty.Form();
		form.parse(request.payload, function(err, fields, files) {
			if(err) return reply({error: err});
			if(!files.file) return reply({error: "File not found"});
			fs.readFile(files.file[0].path,function(err,data){
				if(err) return reply({error: err});
				var file_name = md5(data)+"."+files.file[0].originalFilename;
				var newpath = configs.uploadFolder + "/"+file_name;
				fs.writeFile(newpath,data,function(err){
					if(err) return reply({error: err});
					reply({
						status: true,
						file: file_name
					});
				})
			});
		});
	}
}

exports.download = {
	handler: function(request, reply){
		var fileArr = request.params.file.split(".");
		reply.file(
			configs.uploadFolder + "/"+request.params.file,
			{
				filename: fileArr[1]+"."+fileArr[fileArr.length-1],
				mode: 'attachment'
			}
		)
	}
}