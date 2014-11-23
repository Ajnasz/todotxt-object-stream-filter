module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		mochaTest: {
			teset: {
				options: {
					ui: 'bdd',
					reporter: 'spec'
				},
				src: ['test/*.js']
			}
		}
	});

	grunt.registerTask('default', ['mochaTest']);
};
