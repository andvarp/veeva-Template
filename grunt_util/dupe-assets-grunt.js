module.exports = function(grunt) {

	function dupeAssets() {
		var done = this.async();
		var fs = require('fs');
		var ncp = require('ncp');
		var path = require('path');
		var filewalker = require('filewalker');
		var async = require('async');

		grunt.verbose.writeln("task: " + this.task + ", target: " + this.target);
		grunt.verbose.writeln(this.files);

		// iterate over each item in the array of source file to copy
		async.eachSeries(this.files, function(file, filesCallback) {
			// iterate over each source file to copy
			async.eachSeries(file.src, function(src, fileCallback) {
				grunt.verbose.writeln('src: ' + src);
				var from = file.cwd + path.sep + src;
				grunt.verbose.writeln('from: ' + from);
				// iterate over each destination directory to copy to
				async.eachSeries(file.multiDests, function(dest, multiDestsCallback) {
					grunt.verbose.writeln('dest: ' + dest);
					var copyQueue = [];
					var fullDest = [process.cwd(), dest].join(path.sep);
					grunt.verbose.writeln('fullDest: ' + fullDest);
					
					// Read the destination directory and queue each subdirectory inside it for copying the assets to later
					fs.readdir(fullDest, function(err, files) {
						if (err) throw err;

						files.forEach(function(f) {
							var fullPath = [process.cwd(), dest, f].join(path.sep);
							grunt.verbose.writeln('fullPath: ' + fullPath);
							if (fs.statSync(fullPath).isDirectory()) {
								grunt.verbose.writeln('fullPath is a directory!');
								// add each copy operation to an array for processing later with async
								copyQueue.push({from: from, fullPath: fullPath});
							}
						});

						// Iterate over the copy queue to copy the source file to each subdir in the dest
						async.eachSeries(copyQueue, function(row, copyQueueCallback) {
							ncp(path.resolve(row.from), row.fullPath, function(err) {
								if (err) throw err;

									grunt.verbose.writeln('just copied: ' + row.from);
									copyQueueCallback();
								});
							},
							function(err) {
								if (err) throw err;

							multiDestsCallback();
						});
					});

				}, function() {
					fileCallback();
				});
			}, function(err) {
				if (err) throw err;

				filesCallback();
			});
		}, function(err) {
				if (err) throw err;

			done();
		});
	}

	return dupeAssets;
};
