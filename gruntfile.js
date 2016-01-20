var timer = require("grunt-timer");

module.exports = function(grunt) {
  timer.init(grunt);
  grunt.initConfig({
    clean: {
      browserify: ['spec/spec-bundle.js']
    },
    // sass: {
    //   dist: {
    //     options: {
    //       style: 'expanded',
    //       require: 'susy'
    //     },
    //     files: [{
    //       src: ['sass/style.scss'],
    //       dest: 'css/style.css'
    //     }]
    //   }
    // },
    // jshint: {
    //   all: ['gruntfile.js', 'lib/**/*.js', 'spec/*.js'],
    //   options: {
    //       jshintrc: '.jshintrc',
    //       ignores: [],
    //       additionalSuffixes: ['.js']
    //   }
    // },
    browserify: {
      test: {
        src: ['spec/*.js'],
        dest: 'spec/spec-bundle.js'
      }
    },
    jasmine: {
      test: {
        options: {
          specs: 'spec/spec-bundle.js'
        }
      }
    },
    githooks: {
      all: {
        'pre-commit': 'test'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-githooks');

  grunt.registerTask('default', ['clean:browserify', 'browserify:test']);
  grunt.registerTask('test', ['clean:browserify', 'jshint', 'browserify:test', 'jasmine:test']);
  grunt.registerTask('scss', ['sass']);
};
