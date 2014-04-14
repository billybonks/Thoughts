exports.Handle404 = function (stream,object,id) {
  var data={statusCode:404,message:"Could not find "+object +" : "+id};
  stream.emit('error',data);
};

exports.Handle500 = function (stream,method,error) {
  var data={statusCode:500,message:"Internal Server error on : "+method,error:error};
  stream.emit('error',data);
};

exports.Handle505 = function(stream,method){
  setTimeout(function() {
    var error = {statusCode:500,message :'unauthorized access on method :' +method};
    stream.emit('error',error);
  }, 100);
};

exports.FowardError = function(stream){
  stream.on('error',
  function(error){
    stream.emit(error);
  });
  return stream;
};

exports.FowardErrorToBrowser = function(res,next){
   var res = res;
   var next = next;
  function HandleError(error){
    res.status=error.statusCode;
    res.returnData=error.message;
    next();
  }
  return HandleError;
};

exports.HandleResponse= function(inStream,outStream,method){
  inStream.on('data',function(data){
    outStream.emit('data',data);
  }).on('error',function(error){
    var data={statusCode:500,message:"Internal Server error on : "+method,error:error};
    outStream.emit('error',data);
  })
}


