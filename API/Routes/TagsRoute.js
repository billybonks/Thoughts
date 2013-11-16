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

  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Tag.prototype.CreateTag=function (title,description,target){

  }
  return new Tag();
}