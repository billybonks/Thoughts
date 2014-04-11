module.exports = function () {

  return  function TryParseInt(str,defaultValue){
    var retValue = defaultValue;
    if(str!=null){
      if(str.length>0){
        if (!isNaN(str)){
          retValue = parseInt(str);
        }
      }
    }
    return retValue;
  }
};
