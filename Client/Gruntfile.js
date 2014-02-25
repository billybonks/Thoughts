var fs =require('fs')

module.exports = function(grunt) {

  var plugins = fs.readdirSync('C:/Users/bonks/Documents/GitHub/Thoughts/Client/Plugins')
  var ret = {plugins:[]}

  for(var i = 0; i<plugins.length;i++){
    ret.plugins.push({name:plugins[i]})
  }
  var result = fs.writeFileSync('plugins.json', JSON.stringify(ret))

  console.log(ret)
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    emberTemplates: {
      watch: {
        options: {
          amd: false,
          templateBasePath :"Templates/",
          templateFileExtensions :'.html',
          templateName: function(name) {

            if(name.indexOf('views/')> -1){
              return name.replace('views/','')
            }
            return name;
          }
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
        src:['Scripts/*.js','Scripts/Controllers/*.js','Scripts/Views/*.js','Scripts/Models/*.js','Scripts/Components/*.js','Plugins/*/*.js'],
        dest: '../Deploy/emberApp.js'
      },
      css:{
        src:['Content/*.css'],
        dest:'../Deploy/style.css'
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, src: ['Scripts/External/*'], dest: '../Deploy/External'},
          {expand: true, src: ['fonts/*'], dest: '../Deploy/fonts'}
        ]
      }
    },
    htmlbuild: {
      dist: {
        src:'templateIndex.html',
        dest: '../Deploy/index.html',
        options: {
          scripts: {
            'scripts':'../Deploy/*.js'
          },
          styles: {
            'styles':'../Deploy/*.css'
          }
        }
      },
      dev: {
        src:'templateIndexDev.html',
        dest: 'index.html',
        options:{
          scripts: {
            plugins:'Plugins/*/*.js',
            base:'Scripts/*.js',
            external:'Scripts/External/*.js',
            controllers:'Scripts/Controllers/*.js',
            components:'Scripts/Components/*.js',
            models:'Scripts/models/*.js',
            views:'Scripts/views/*.js',
            templates:'/Templates/result.js'
          },
          styles: {
            styles:'Content/*.css'
          }
        }
      }
    },
    mustache_render: {
      options: {
        // Task global options go here
      },
      your_target: {
        options: {
          // Target specific options go here
        },
        files : [
          {data: 'plugins.json',
           template: "Scripts/Controllers/SectionController.mustache",
           dest: "Scripts/Controllers/SectionController.js"}
        ]
      },
    },
    jshint: {
      files: ['Scripts/Components/*.js','Scripts/Views/*.js', 'Scripts/Controllers/*.js', 'Scripts/Models/*.js','Scripts/Router.js','Scripts/Settings.js','Plugins/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
  });

  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks 'grunt-contrib-jshint'
  //grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-mustache-render');
  grunt.registerTask('default', ['emberTemplates','concat','copy','htmlbuild','mustache_render','jshint']);

};