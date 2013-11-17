//require staements
var seviceModule = require('./ServiceModule.js')

module.exports = function(settings){

  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function Tag(){
  }

  Tag.prototype = new seviceModule(settings);

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  Tag.prototype.TagExists= function (title){

  }
  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Tag.prototype.CreateAndTagEntity=function (title,description,target){
    var createTagQuery = 'CREATE (n:Tag {data}) RETURN n';
    var newCardHash = {data:{title:title,description:description}};
  }

  Tag.prototype.TagEntity=function (nodeId,tags){

  }
  return new Tag();
}