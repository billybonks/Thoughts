var fs = require('fs')

module.exports = function(grunt) {

  //prep
  var plugins = fs.readdirSync('Client/Plugins')
  var ret = {
    plugins: [],
    barsStart: '{{',
    barsEnd: '}}'
  }

  for (var i = 0; i < plugins.length; i++) {
    ret.plugins.push({
      name: plugins[i],
      nameLower: plugins[i].toLowerCase()
    })
  }
  var result = fs.writeFileSync('plugins.json', JSON.stringify(ret))
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    mustache_render: {
      options: {
        // Task global options go here
      },
      dev: {
        options: {
          // Target specific options go here
        },
        files: [{
            data: 'plugins.json',
            template: "Client/Scripts/Components/RenderPluginComponent.mustache",
            dest: "Deploy/Client/Scripts/Components/RenderPluginComponent.js"
          }, {
            data: 'plugins.json',
            template: "Client/Templates/components/render-plugin.mustache",
            dest: "Deploy/Client/Templates/Components/render-plugin.html"
          }
          /*,
          {data: 'plugins.json',
           template: "Client/Scripts/Controllers/CardFormController.mustache",
           dest: "Deploy/Client/Scripts/Controllers/CardFormController.js"}*/
        ]
      },
      prod: {
        options: {
          // Target specific options go here
        },
        files: [{
            data: 'plugins.json',
            template: "Client/Scripts/Components/RenderPluginComponent.mustache",
            dest: "Temp/Client/Scripts/Components/RenderPluginComponent.js"
          }, {
            data: 'plugins.json',
            template: "Client/Templates/components/render-plugin.mustache",
            dest: "Temp/Client/Templates/Components/render-plugin.html"
          }
          /*,
          {data: 'plugins.json',
           template: "Client/Scripts/Controllers/CardFormController.mustache",
           dest: "Deploy/Client/Scripts/Controllers/CardFormController.js"}*/
        ]
      },
    }, //Ember.TEMPLATES["r
    emberTemplates: {
      dev: {
        options: {
          amd: false,
          templateBasePath: "Client/Templates/",
          templateFileExtensions: '.html',
          templateName: function(name) {
            if (name.indexOf('views/') > -1) {
              return name.replace('views/', '')
            }
            if (name.indexOf('Plugins/') > -1) {
              var path = name.split('/');
              var name = path[path.length - 1]
              if (name.indexOf('-') > -1) {
                name = 'components/' + name
              }
            }
            if (name.indexOf('Deploy/') > -1) {
              var path = name.split('/');
              var name = path[path.length - 1]
              if (name.indexOf('-') > -1) {
                name = 'components/' + name
              }
            }

            return name;
          }
        },
        files: {
          "Deploy/Client/result.js": ['Client/Templates/**/*.html', 'Client/Plugins/**/Templates/*.html', 'Deploy/Client/Templates/Components/*.html'], //["Templates/application.html", "Templates/cards.html"]
          //"path/to/another.js": ["path/to/sources/*.handlebars", "path/to/more/*.handlebars"]
        },
      },
      prod: {
        options: {
          amd: false,
          templateBasePath: "Client/Templates/",
          templateFileExtensions: '.html',
          templateName: function(name) {
            console.log(name)
            if (name.indexOf('views/') > -1) {
              return name.replace('views/', '')
            }
            if (name.indexOf('Plugins/') > -1) {
              var path = name.split('/');
              var name = path[path.length - 1]
              if (name.indexOf('-') > -1) {
                name = 'components/' + name
              }
            }
            if (name.indexOf('Deploy/') > -1) {
              var path = name.split('/');
              var name = path[path.length - 1]
              if (name.indexOf('-') > -1) {
                name = 'components/' + name
              }
            }
            if (name.indexOf('Temp/') > -1) {
              var path = name.split('/');
              var name = path[path.length - 1]
              if (name.indexOf('-') > -1) {
                name = 'components/' + name
              }
            }
            return name;
          }
        },
        files: {
          "Deploy/Client/result.js": ['Client/Templates/**/*.html', 'Client/Plugins/**/Templates/*.html', 'Temp/Client/Templates/Components/*.html'], //["Templates/application.html", "Templates/cards.html"]
          //"path/to/another.js": ["path/to/sources/*.handlebars", "path/to/more/*.handlebars"]
        },
      }
    },
    concat: {
      options: {
        separator: '\n'
      },
      emberApp: {
        src: ['Temp/Client/Scripts/*.js', 'Temp/Client/Scripts/Mixins/*.js', 'Temp/Client/Scripts/Controllers/*.js', 'Temp/Client/Scripts/Components/*.js', 'Temp/Client/Scripts/Views/*.js', 'Temp/Client/Scripts/Models/*.js', 'Temp/Client/Plugins/*/*.js'],
        dest: 'Temp/emberApp.js'
      },
      css: {
        src: ['Content/*.css'],
        dest: 'Deploy/Client/style.css'
      },
      libs: {
        src: ['Temp/Client/Scripts/External/*.js'],
        dest: 'Deploy/Client/libs.js'
      }
    },
    uglify: {
      prod: {
        files: {
          'Deploy/Client/emberapp.min.js': ['Temp/emberApp.js']
        }
      }
    },
    copy: {
      client: {
        files: [{
          expand: true,
          src: ['Client/Scripts/**/*'],
          dest: 'Deploy/'
        }, {
          expand: true,
          src: ['Client/fonts/*'],
          dest: 'Deploy/'
        }, {
          expand: true,
          src: ['Client/Plugins/**/*'],
          dest: 'Deploy/'
        }, {
          expand: true,
          src: ['Client/Content/*'],
          dest: 'Deploy/'
        }]
      },
      temp: {
        files: [{
          expand: true,
          src: ['Client/Scripts/**/*'],
          dest: 'Temp/'
        }, {
          expand: true,
          src: ['Client/Plugins/**/*'],
          dest: 'Temp/'
        }, {
          expand: true,
          src: ['Client/Content/*'],
          dest: 'Temp/'
        }, {
          expand: true,
          src: ['Client/fonts/*'],
          dest: 'Temp/'
        }, {
          expand: true,
          src: ['Client/Content/*'],
          dest: 'Deploy/'
        }, {
          expand: true,
          src: ['Client/fonts/*'],
          dest: 'Deploy/'
        }, ]
      },
      api: {
        files: [{
            expand: true,
            cwd: 'API/',
            src: ['**'],
            dest: 'Deploy/'
          }

        ]
      }
    },
    htmlbuild: {
      dev: {
        src: 'Client/templateIndexDev.html',
        dest: 'Deploy/Client/index.html',
        options: {
          scripts: {
            plugins: 'Deploy/Client/Plugins/*/*.js',
            base: 'Deploy/Client/Scripts/*.js',
            external: 'Deploy/Client/Scripts/External/*.js',
            controllers: 'Deploy/Client/Scripts/Controllers/*.js',
            components: 'Deploy/Client/Scripts/Components/*.js',
            models: 'Deploy/Client/Scripts/Models/*.js',
            views: 'Deploy/Client/Scripts/Views/*.js',
            mixins: 'Deploy/Client/Scripts/Mixins/*.js',
            templates: 'Deploy/Client/Templates/result.js'
          },
          styles: {
            styles: 'Deploy/Client/Content/*.css'
          }
        }
      },
      prod: {
        src: 'Client/templateIndexProd.html',
        dest: 'Deploy/Client/index.html',
        options: {
          scripts: {
            app: 'Deploy/Client/emberApp.min.js',
            templates: 'Deploy/Client/result.js',
            libs: 'Deploy/Client/libs.js'
          },
          styles: {
            css: 'Deploy/Client/style.css',
          }
        }
      }
    },
    jshint: {
      files: ['Scripts/Components/*.js', 'Scripts/Views/*.js', 'Scripts/Controllers/*.js', 'Scripts/Models/*.js', 'Scripts/Router.js', 'Scripts/Settings.js', 'Plugins/**/*.js'],
      ignores: ['plugins.json'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    clean: {
      client: {
        src: ['Deploy/Client'],
        force: true
      },
      temp: {
        src: ['Temp'],
        force: true
      }
    },
  });

  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks 'grunt-contrib-jshint'
  //grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-mustache-render');
  grunt.registerTask('dev', ['clean:client', 'copy:client', 'mustache_render:dev', 'emberTemplates:dev', 'htmlbuild:dev']);
  grunt.registerTask('prod', ['clean:client', 'clean:temp', 'copy:temp', 'mustache_render:prod', 'emberTemplates:prod', 'concat','uglify:prod','htmlbuild:prod']); //, 'concat', 'htmlbuild']); //,'jshint']);
  grunt.registerTask('api', ['copy:api'])

};
