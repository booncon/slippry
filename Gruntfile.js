'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/slippry.js'
      ]
    },
    sass: {
      dist: {
        options: {
          style: 'nested',
          compass: true,
          'sourcemap=none': true
        },
        files: {
          'dist/slippry.css': [
            'src/slippry.scss'
          ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/slippry.min.js': [
            'src/slippry.js'
          ]
        },
        options: {
          sourceMap: false,
          preserveComments: 'some'
        }
      }
    },
    watch: {
      sass: {
        options: {
          style: 'nested',
          compass: true,
          'sourcemap=none': true
        },
        files: [
          'src/*.scss'
        ],
        tasks: ['sass']
      },
      js: {
        files: [
          '<%= jshint.all %>'
        ],
        tasks: ['jshint', 'uglify']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          'dist/slippry.css',
          'dist/slippry.min.js',
          'demo/index.html'
        ]
      }
    },
    clean: {
      dist: [
        'assets/css/main.min.css',
        'assets/js/scripts.min.js'
      ]
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Register tasks
  grunt.registerTask('default', [
    'clean',
    'sass',
    'uglify'
  ]);
  grunt.registerTask('dev', [
    'watch'
  ]);
};