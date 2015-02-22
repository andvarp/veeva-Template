// Gruntfile.js

module.exports = function(grunt) {

	//Custom Grunt Plugins
	var dupeAssets = require('./grunt_util/dupe-assets-grunt.js')(grunt);
	var zipAssets = require('./grunt_util/zip-assets-grunt.js')(grunt);
	var compileAssets = require('./grunt_util/compile-assets-grunt.js')(grunt);

	// Project Configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		env: require('./grunt_util/env-config'),

		// Set the enviroment variables
		config: {
		  dev: {
		    options: {
		      variables: {
		        'data': 'false'
		      }
		    }
		  },

		  prod: {
		    options: {
		      variables: {
		        'data': 'true'
		      }
		    }
		  }
		},

		// Build the slides html
		assemble: {
			options: {
				layoutdir: '<%= env.DIR_LAYOUT %>',
				layout: '<%= env.FILE_LAYOUT %>',
				partials: '<%= env.PATTERN_PARTIALS %>',
				data: '<%= env.PATTERN_DATA %>',
				production:'<%= grunt.config.get("data") %>',
				flatten: false
			},
			pages: {
				files: {
					'<%= env.DIR_PAGES_DEST %>': '<%= env.PATTERN_PAGES %>',
				}
	 		}
	 	},

		// Copy task to copy static assets to the web dist folder
		copy: {
			slideAssets: {
				cwd: '<%= env.DIR.src %>',
				src: '<%= env.PATTERN_ASSETS %>',
				dest: '<%= env.DIR_ASSETS_DEST %>',
				expand: true
			},
			build: {
				cwd: '<%= env.DIR_BUILD_SRC %>',
				src: '**',
				dest: '<%= env.DIR_PAGES_DEST %>',
				expand: true
			}
		},

		// The dupeAssets tasks duplicate global and client specific assets to all the slide subfolders.
		// We need a custom task for these because the grunt files tasks don't handle multiple destinations.
		dupeAssets: {
			global: {
				files: [
					{
						cwd: '<%= env.DIR.src %>',
						src: ['<%= env.DIR_GLOBAL %>'],
						dest: '',
						multiDests: ['<%= env.DIR_BUILD_SRC %>']
					}
				]
			}
		},

		// Avoid cache issues
		cachebreaker: {
			dev: {
				options: {
					match: '<%= env.FILE_CACHEBREAKER %>',
				},
				files: {
					src: '<%= env.PATTERN_CACHEBREAKER %>'
				}
			}
		},

		// This will zip all the assets
		zipAssets: {
			directories: [
				{
					name: '<%= env.DIR.project %>',
					webDir: '<%= env.DIR_PAGES_DEST %>',
					zipDir: '<%= env.DIR_ZIP_DEST %>'
					// name: 'slides',
					// webDir: 'web/slides',
					// zipDir: 'zip/slides'
				}
			]
		},

		// This will zip all the assets
		compileAssets: {
			directories: [
				{
					name: '<%= env.DIR.project %>',
					tmpDir: '<%= env.DIR_BUILD_SRC %>',
					files:{
						css:{
							src: '<%= env.FILE_CSS_SRC %>',
							destFolder: '<%= env.DIR_CSS_DEST %>',
							destFile: '<%= env.FILE_CSS_DEST %>'
						},
						js:{
							src: '<%= env.FILE_JS_SRC %>',
							destFolder: '<%= env.DIR_JS_DEST %>',
							destFile: '<%= env.FILE_JS_DEST %>'
						}
					}
				}
			]
		},

		// Take screnshots of all slides
		phantomjs_screenshot: {
			thumbs: {
				options: {
					viewport: '400x300',
					quality: 20,
					closeDelay: 2000
				},
				files: [{
					expand: true,
					cwd: '<%= env.DIR.web %>',
					src: '<%= env.PATTERN_SCREENSHOT %>',
					dest: '<%= env.DIR.web %>',
					ext: '.png',
					rename: function(dest, src) {
						path = src.split('/');
						name = path[path.length-1].split(".")
						name[0] = 'thumb';
						path[path.length-1] = name.join(".");
						return dest + '/' + path.join("/");
					},
				}]
			}
		},

		// Clean the project folders
		clean: {
			all: '<%= env.PATTERN_CLEAN_ALL %>',
			assets: '<%= env.PATTERN_CLEAN_ASSETS %>',
			build: '<%= env.PATTERN_CLEAN_BUILD %>'
		},

		// Local server
		connect: {
			options: {
				port: '<%= env.SERVER.port %>',
				protocol: '<%= env.SERVER.protocol %>',
				base: '<%= env.SERVER.base %>',
				livereload: '<%= env.SERVER.livereload %>',
				open: true
			},
			server: {

			}
		},

		// Watch files, reload the site with livereload
		watch: {
			options: {
				livereload: {
					port: '<%= env.SERVER.livereload %>'
				}
			},
			files: '<%= env.PATTERN_WATCH %>',
			tasks: ['default']
		},

		//Creates notifications after task are completed
		notify: {
			deploy: {
				options: {
					title: 'Deploy Completed',
					message: 'The site was successfully builded.',
				}
			},
			server: {
				options: {
					title: 'Server Running',
					message: 'Running on: <%= env.SERVER.protocol %>://<%= env.SERVER.hostname %>:<%= env.SERVER.port %>',
				}
			},
			zip: {
				options: {
					title: 'Zip Created',
					message: 'Zip files was successfully created.',
				}
			}
		},

		//Open Files
		open: {
			zipFolder:{
				path : '<%= env.DIR_ZIP_DEST %>',
				options:{
					delay: 2000
				}
			}
		}
	});

	// Grunt plugins load
	grunt.loadNpmTasks('grunt-config');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-cache-breaker');
	grunt.loadNpmTasks('grunt-phantomjs-screenshot');
	grunt.loadNpmTasks('grunt-open');

	// Custom Grunt plugins load
	grunt.registerMultiTask('dupeAssets', 'dupe assets', dupeAssets);
	grunt.registerMultiTask('zipAssets', 'zip assets', zipAssets);
	grunt.registerMultiTask('compileAssets', 'compile assets', compileAssets);

	// Setup enviroment variables
	var target = grunt.option('target') || 'dev';
	grunt.task.registerTask('disableVeevaTestMode', '', function() {
		grunt.config('veeva-test-mode-disabled', true);
	});

	// Tasks Grunt will run
	grunt.registerTask('default', ['config:'+target,'clean:all', 'assemble', 'copy:slideAssets', 'dupeAssets', 'compileAssets','copy:build', 'clean:build', 'cachebreaker', 'notify:deploy']);
	grunt.registerTask('server', ['default','connect','notify:server' , 'watch',]);
	grunt.registerTask('thumbs', ['phantomjs_screenshot:thumbs']);
	grunt.registerTask('zip', ['disableVeevaTestMode', 'default','clean:assets', 'thumbs', 'notify:zip', 'open:zipFolder', 'zipAssets']);

};