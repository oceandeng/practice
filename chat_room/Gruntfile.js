/* 
* @Author: ocean
* @Date:   2015-09-10 13:48:00
* @Last Modified by:   ocean_deng
* @Last Modified time: 2016-05-22 22:45:23
*/

'use strict';

module.exports = function(grunt){

	require('time-grunt')(grunt);
	
	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// require('jit-grunt')(grunt);

	var config = {
		static: 'static',
		style: 'static',
		app: ''
	}

	grunt.initConfig({
		config: config,

		//--- watch
		watch: {
			js: {
				files: ['<%= config.static%>/{,/*}*.js', '<%= config.static %>/{,/*}*.js'],
				options: {
					livereload: true
				}
			}
		},
		//--- nodemon
		nodemon:{
			dev:{
				options:{
					file:'app.js',
					args:[],
					ignoredFiles: ['README.md','node_modules/**','.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolder: ['./'],
					debug:true,
					delayTime:1,
					env:{
						PORT:3000
					},
					cwd:__dirname
				}
			}
		},
		//--- concurrent
		concurrent:{
			// miss uglify
			tasks:['nodemon', 'watch'],
			options:{
				logConcurrentOutput:true
			}
		},

		// -- copy
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: 'static/components/bootstrap/dist/fonts',
					src: ['**'],
					dest: 'build/fonts'
				}, {
					'build/index.html': 'static/index.html'
				}, {
					'build/favicon.ico': 'static/favicon.ico'
				}]
			}
		},
		useminPrepare: {
			html: 'static/index.html',
			options: {
				dest: 'build'
			}
		},
		usemin: {
			html: 'build/index.html'
		},
		clean: {
			main: ['.tmp', 'build']
		}
	});

	grunt.registerTask('default', [
		'concurrent'
	]);
	grunt.registerTask('build', [
		'clean',
		'copy',
		'useminPrepare',
		'concat',
		'uglify',
		'cssmin',
		'usemin'
	]);
};