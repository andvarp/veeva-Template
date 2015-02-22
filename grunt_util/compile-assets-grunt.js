module.exports = function(grunt) {
	//START - compileAssets
	function compileAssets() {
		var done = this.async();
		var fs = require('fs');
		var touch = require("touch")
		var mkdirp = require('mkdirp');
		var async = require('async');
		var ncp = require('ncp');
		var compressor = require('node-minify');
		var cwd =  process.cwd();


		grunt.verbose.writeln("task: " + this.task + ", target: " + this.target);
		
		compileCSS(this.data);

		// CSS
		function compileCSS(data){
			grunt.log.writeln("COMPILE CSS")
			async.each(data, function(directory, dataCallback){
				// console.log(directory)
				if(fs.existsSync(directory.tmpDir)) {
				    fs.readdir(directory.tmpDir, function (err, SlideDirectories) {
						if (err) errorCallback(err);

						async.each(SlideDirectories, function(slideDirectory, SlideDirectoriesCallback){
							var baseSlideDirectory = directory.tmpDir + "/" + slideDirectory;
							// var buildBaseSlideDirectory = directory.webDir + "/" + slideDirectory; //web url
							var buildBaseSlideDirectory = directory.tmpDir + "/" + slideDirectory; // tmp url

							if (directory.files.hasOwnProperty("css")){
								var fileOutCSSFolder = buildBaseSlideDirectory + "/" + directory.files.css.destFolder;
								var fileOutCSS = cwd + "/" + fileOutCSSFolder + "/" + directory.files.css.destFile;
								mkdirp.sync(fileOutCSSFolder);
								if(fs.lstatSync(baseSlideDirectory).isDirectory()){
									var fileInArrayCSS = new Array();
									directory.files.css.src.forEach(function(item,index){
										fileInArrayCSS.push(cwd + "/" + baseSlideDirectory + "/" + item);
									});
									touch.sync(fileOutCSS);
									minify.css(compressor, fileInArrayCSS, fileOutCSS, SlideDirectoriesCallback);
								}
							}
						}, function(err){
							if (err){
								grunt.log.writeln(('Error triyng to compiling the slides').red);
								grunt.log.writeln((err).red);
								throw err;
							}else{
								dataCallback();
							}
						});
					});
				}
			}, function(err){
				if (err){
					grunt.log.writeln(('Error triyng to compiling the slides').red);
					grunt.log.writeln((err).red);
					throw err;
				}else{
					complileJS(data);
				}
			});
		}

		//JS
		function complileJS(data){
			grunt.log.writeln("COMPILE JS")
			async.eachSeries(data, function(directory, dataCallback){
				// console.log(directory)
				if(fs.existsSync(directory.tmpDir)) {
				    fs.readdir(directory.tmpDir, function (err, SlideDirectories) {
						if (err) errorCallback(err);

						async.eachSeries(SlideDirectories, function(slideDirectory, SlideDirectoriesCallback){
							var baseSlideDirectory = directory.tmpDir + "/" + slideDirectory;
							// var buildBaseSlideDirectory = directory.webDir + "/" + slideDirectory; //web url
							var buildBaseSlideDirectory = directory.tmpDir + "/" + slideDirectory; // tmp url
							
							// Minify JS
							if (directory.files.hasOwnProperty("js")){
								var fileOutJSFolder = buildBaseSlideDirectory + "/" + directory.files.js.destFolder;
								var fileOutJS = cwd + "/" + fileOutJSFolder + "/" + directory.files.js.destFile;
								mkdirp.sync(fileOutJSFolder);
								if(fs.lstatSync(baseSlideDirectory).isDirectory()){
									var fileInArrayJS = new Array();
									directory.files.js.src.forEach(function(item,index){
										var fileInJS = cwd + "/" + baseSlideDirectory + "/" + item;
										fileInArrayJS.push(fileInJS);
									});
									touch.sync(fileOutJS);
									minify.js(compressor, fileInArrayJS, fileOutJS, SlideDirectoriesCallback)
								}
							}
						}, function(err){
							if (err){
								grunt.log.writeln(('Error triyng to compiling the slides').red);
								grunt.log.writeln((err).red);
								throw err;
							}
							dataCallback();
						});
					});
				}
			}, function(err){
				if (err){
					grunt.log.writeln(('Error triyng to compiling the slides').red);
					grunt.log.writeln((err).red);
					throw err;
				}else{
					done();
				}
			});

		}
	}
	
	// Error Callback, this is shared acrross the function zipAssets and createZip
	var errorCallback = function(err){
		if (err){
			grunt.log.writeln(('Error triyng to compiling the slides').red);
			grunt.log.writeln((err).red);
			throw err;
		}

	}
	//END - Error Callback


// https://github.com/srod/node-minify
	
	var minify = {
		config:{
			css:{
				compressorType:"sqwish"//clean-css
			},
			js:{
				//compressorType:"uglifyjs"//uglify
				compressorType:"no-compress" 
			}
		},
		css: function (compressor, fileInArrayCSS, fileOutCSS,SlideDirectoriesCallback){
			new compressor.minify({
			type: this.config.css.compressorType,
			fileIn: fileInArrayCSS,
			fileOut: fileOutCSS,
			callback: function(err, min){
					if (err) errorCallback(err);
					grunt.log.writeln(' Created ' + (fileOutCSS).cyan + ' ' + ("OK").green);
					SlideDirectoriesCallback();
				}
			});
		},
		js: function (compressor, fileInArrayJS, fileOutJS, SlideDirectoriesCallback){
			new compressor.minify({
				type: this.config.js.compressorType,
				fileIn: fileInArrayJS,
				fileOut: fileOutJS,
				callback: function(err, min){
					if (err) errorCallback(err);
					grunt.log.writeln(' Created ' + (fileOutJS).cyan + ' ' + ("OK").green);
					SlideDirectoriesCallback();
				}
			});
		}
	}


	return compileAssets;
};
