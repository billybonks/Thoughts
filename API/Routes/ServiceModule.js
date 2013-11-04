module.exports = function(settings){

  function ServiceModule(){
    this.id = '';
    this.token = ''
    console.log('service module creating')
  }

  ServiceModule.prototype.proccessRequestVariables=function(req){
    console.log('processing Vars')
    this.id = req.params.id;
    this.token = req.headers['authorization'];
  }

  return new ServiceModule();
}