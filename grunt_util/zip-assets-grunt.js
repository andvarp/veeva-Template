module.exports = function(grunt) {

	//START - zipAssets
	function zipAssets() {
		var done = this.async();
		var fs = require('fs');
		// var ncp = require('ncp');
		// var path = require('path');
		var mkdirp = require('mkdirp');
		var async = require('async');
		var cwd =  process.cwd();
		var date = new Date();
		//var timestamp = [date.getFullYear().toString().slice(-2),date.getMonth() + 1,date.getDate(),"-",date.getHours(),date.getMinutes(),date.getSeconds()].join('');

		grunt.verbose.writeln("task: " + this.task + ", target: " + this.target);

		// Iterate over each item in the array of source file to zip it
		async.each(this.data, function(brand, callback){
			// Check if the web directory exist
			if(fs.existsSync(brand.webDir)) {
				// Create the zip folder async
				mkdirp(brand.zipDir, function (err) {
					if (err) errorCallback(err);
				    // Read web directory to get all slides names
				    fs.readdir(brand.webDir, function (err, directories) {
						if (err) errorCallback(err);
						// Iterate over each slide folder to zip it
						async.each(directories, function(directory, callback){
							var slideDirectory = brand.webDir + "/" + directory;
							var slideZipName = directory + ".zip";
							var slideZipDirectory = brand.zipDir
							//Check if the slide names is a directory
							if(fs.lstatSync(slideDirectory).isDirectory()){
								// Create the zip file
								createZip(cwd, brand.zipDir, slideZipName, slideDirectory, directory);
							}
						}, errorCallback);
					});
					//END - Read web directory to get all slides names
				});
				//END - Create the zip folder async
			}
			//END - Check if the web directory exist
		  }, errorCallback);
		//END - Iterate over each item in the array of source file to zip it
	}
	//END - zipAssets
	
	// Error Callback, this is shared acrross the function zipAssets and createZip
	var errorCallback = function(err){
		if (err){
			grunt.log.writeln(('Error triyng to Ziping the slides').red);
			throw err;
		}

	}
	//END - Error Callback


	// START - createZip This function will create the zip for each slide
	function createZip(cwd, outputDirectory, outputName, srcPath, directory){
		var file_system = require('fs');
		var archiver = require('archiver');
		var archive = archiver('zip');
		
		var fullOutputPath = outputDirectory+"/"+outputName;
		var output = file_system.createWriteStream(fullOutputPath);

		output.on('close', function () {
			grunt.log.writeln(' Created ' + (fullOutputPath).cyan + ' ' + ("OK").green);
		});

		archive.on('error', errorCallback);

		// All the Archiver will write on output file
		archive.pipe(output);
		// Adding the folder, with all its content
		archive.bulk([{ expand: true, cwd: srcPath, src: ['**'], dest: ''}]);
		// Ending the Zip file
		archive.finalize();
	}
	// END - createZip

	return zipAssets;
};
