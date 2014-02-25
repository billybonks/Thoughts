//require staements
var ServiceModule = require('./ServiceModule.js')
var UserRoute = require('./UserRoute.js')
var Stream = require('stream');
var TagsRoute = require('./TagsRoute.js')

module.exports = function(settings){
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Template(settings){
    this.user = new UserRoute(settings);
    this.tags = new TagsRoute(settings);
    this.counter = 0;
  }

  Template.prototype = new ServiceModule(settings);

  //todo: return user and section
  Template.prototype.GetTemplates = function(auth){
    var query = ['match (template:Card)',
                 'where has(template.isTemplate)',
                 'return template']
    return settings.executeQuery(query.join('\n'),{})
  }

  Template.prototype.GetObject = function(template){
    return {
      id:template.id,
      title:template.data.title
    }
  }
  return new Template(settings)
}