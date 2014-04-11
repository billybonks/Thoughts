
//require staements
var controller = require('./Controller.js');
var Stream = require('stream');
module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Template(){
  }

  Template.prototype = new controller();


  //todo: return user and section
  Template.prototype.GetTemplates = function(auth){
    var query = ['match (template:Card)',
                 'where template.isTemplate = true',
                 'AND not(has(template.isDeleted))',
                 'return template'];
    return this.executeQuery(query.join('\n'),{});
  };

  Template.prototype.GetObject = function(template){
    return {
      id:template.id,
      title:template.data.title
    };
  };
  return new Template();
};
