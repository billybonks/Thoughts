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
  var stream = stream;
  console.log('prepping error bugout')
  function OnError (error){
    console.log('fowarding error')
    stream.emit('error',error);
  }
  return OnError;
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
    console.log('handling done');
    console.log(data);
    outStream.emit('data',data);
  }).on('error',function(error){
    var data={statusCode:500,message:"Internal Server error on : "+method,error:error};
    console.log('handling Error');
    console.log(data);
    outStream.emit('error',data);
  })
}


