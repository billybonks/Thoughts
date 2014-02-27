var Stream = require('stream');
var neo4j = require('neo4j-js');
var controller = require('./controller.js');

module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function TagsController(){
  }
  TagsController.prototype = new controller();
  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */


  return new TagsController();
};