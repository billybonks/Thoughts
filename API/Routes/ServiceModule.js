//require staements
module.exports = function(settings){
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function ServiceModule(){
    this.id = '';
    this.token = ''
    console.log('service module creating')
  }
  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  ServiceModule.prototype.proccessRequestVariables=function(req){
    console.log('processing Vars')
    this.id = req.params.id;
    this.token = req.headers['authorization'];
  }

  return new ServiceModule();
}