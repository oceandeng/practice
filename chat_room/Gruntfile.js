/* 
* @Author: ocean
* @Date:   2015-09-10 13:48:00
* @Last Modified by:   ocean
* @Last Modified time: 2016-04-21 19:35:51
*/

'use strict';

module.exports = function(grunt){

	require('time-grunt')(grunt);
	require('jit-grunt')(grunt);

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
		}
	});

	grunt.registerTask('default', [
		'concurrent'
	]);
	grunt.registerTask('build', [
		'uglify'
	]);
};