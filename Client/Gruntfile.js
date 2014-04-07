var fs =require('fs')

module.exports = function(grunt) {

  //prep
  var plugins = fs.readdirSync('Plugins')
  var ret = {plugins:[],barsStart:'{{',barsEnd:'}}'}

  for(var i = 0; i<plugins.length;i++){
    ret.plugins.push({name:plugins[i],nameLower:plugins[i].toLowerCase()})
  }
  var result = fs.writeFileSync('plugins.json', JSON.stringify(ret))
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
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
           template: "Scripts/Components/RenderPluginComponent.mustache",
           dest: "Scripts/Components/RenderPluginComponent.js"},
          {data: 'plugins.json',
           template: "Templates/Components/render-plugin.mustache",
           dest: "Templates/Components/render-plugin.html"},
          {data: 'plugins.json',
           template: "Scripts/Controllers/CardFormController.mustache",
           dest: "Scripts/Controllers/CardFormController.js"}
        ]
      },
    },
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
            if(name.indexOf('Plugins/')> -1){
              var path = name.split('/');
              var name = path[path.length-1]
              if(name.indexOf('-') > -1){
                name = 'components/'+name
              }
            }
            return name;
          }
        },
        files: {
          "Templates/result.js": ['Templates/**/*.html','Plugins/**/Templates/*.html'],//["Templates/application.html", "Templates/cards.html"]
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
            models:'Scripts/Models/*.js',
            views:'Scripts/Views/*.js',
            templates:'/Templates/result.js'
          },
          styles: {
            styles:'Content/*.css'
          }
        }
      }
    },
    jshint: {
      files: ['Scripts/Components/*.js','Scripts/Views/*.js', 'Scripts/Controllers/*.js', 'Scripts/Models/*.js','Scripts/Router.js','Scripts/Settings.js','Plugins/**/*.js'],
      ignores:['plugins.json'],
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
  grunt.registerTask('default', ['mustache_render','emberTemplates','concat','copy','htmlbuild']);//,'jshint']);

};