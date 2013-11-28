module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    emberTemplates: {
      watch: {
        options: {
          amd: false,
          templateBasePath :"Templates/",
          templateFileExtensions :'.html',
        },
        files: {
          "Templates/result.js": 'Templates/**/*.html',//["Templates/application.html", "Templates/cards.html"]
          "../Deploy/templates.js": 'Templates/**/*.html'//["Templates/application.html", "Templates/cards.html"]
          //"path/to/another.js": ["path/to/sources/*.handlebars", "path/to/more/*.handlebars"]
        },

      }
    },
    concat: {
      options: {
        separator: '\n'
      },
      emberApp: {
        src:['Scripts/*.js','Scripts/Controllers/*.js','Scripts/Views/*.js','Scripts/Models/*.js','Scripts/Components/*.js'],
        dest: '../Deploy/emberApp.js'
      },
      css:{
        src:['Content/*.css'],
        dest:'../Deploy/style.css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks 'grunt-contrib-jshint'
  //grunt.loadNpmTasks 'grunt-contrib-less'
  //grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.registerTask('default', ['emberTemplates','concat']);

};