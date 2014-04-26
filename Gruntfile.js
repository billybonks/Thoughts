var fs =require('fs')

module.exports = function(grunt) {

  //prep
  var plugins = fs.readdirSync('Client/Plugins')
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
           template: "Client/Scripts/Components/RenderPluginComponent.mustache",
           dest: "Deploy/Client/Scripts/Components/RenderPluginComponent.js"},
          {data: 'plugins.json',
           template: "Client/Templates/Components/render-plugin.mustache",
           dest: "Deploy/Client/Templates/Components/render-plugin.html"},
          {data: 'plugins.json',
           template: "Client/Scripts/Controllers/CardFormController.mustache",
           dest: "Deploy/Client/Scripts/Controllers/CardFormController.js"}
        ]
      },
    },
    emberTemplates: {
      watch: {
        options: {
          amd: false,
          templateBasePath :"Client/Templates/",
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
            if(name.indexOf('Deploy/')> -1){
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
          "Deploy/Client/result.js": ['Client/Templates/**/*.html','Client/Plugins/**/Templates/*.html','Deploy/Client/Templates/Components/*.html'],//["Templates/application.html", "Templates/cards.html"]
          //"path/to/another.js": ["path/to/sources/*.handlebars", "path/to/more/*.handlebars"]
        },

      }
    },
    concat: {
      options: {
        separator: '\n'
      },
      emberApp: {
        src:['Client/Scripts/*.js','Client/Scripts/Controllers/*.js','Client/Scripts/Views/*.js','Client/Scripts/Models/*.js','Client/Scripts/Components/*.js','Client/Plugins/*/*.js'],
        dest: '../Deploy/emberApp.js'
      },
      css:{
        src:['Content/*.css'],
        dest:'../Deploy/style.css'
      }
    },
    copy: {
      client: {
        files: [
          {expand: true, src: ['Client/Scripts/**/*'], dest: 'Deploy/'},
          {expand: true, src: ['Client/fonts/*'], dest: 'Deploy/'},
          {expand: true, src: ['Client/Plugins/**/*'], dest: 'Deploy/'},
          {expand: true, src: ['Client/Content/*'], dest: 'Deploy/'}
        ]
      },
      api: {
        files: [
          {expand: true,cwd:'API/', src: ['**'], dest: 'Deploy/'}

        ]
      }
    },
    htmlbuild: {
      dev: {
        src:'Client/templateIndexDev.html',
        dest: 'Deploy/Client/index.html',
        options:{
          scripts: {
            plugins:'Deploy/Client/Plugins/*/*.js',
            base:'Deploy/Client/Scripts/*.js',
            external:'Deploy/Client/Scripts/External/*.js',
            controllers:'Deploy/Client/Scripts/Controllers/*.js',
            components:'Deploy/Client/Scripts/Components/*.js',
            models:'Deploy/Client/Scripts/Models/*.js',
            views:'Deploy/Client/Scripts/Views/*.js',
            templates:'Deploy/Client/Templates/result.js'
          },
          styles: {
            styles:'Deploy/Client/Content/*.css'
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
  grunt.registerTask('dev',['copy:client','mustache_render','emberTemplates','htmlbuild:dev']);
  grunt.registerTask('prod', [,'copy:client','copy:api','mustache_render','emberTemplates','concat','htmlbuild']);//,'jshint']);


};