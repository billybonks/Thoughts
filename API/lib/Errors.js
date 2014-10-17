exports.reject = function(reject){
  return function(error) {
    reject(error);
  }
};

exports.error = function(res, next) {
  var res = res;
  var next = next;
  function HandleError(error) {
    console.log('foward')
    console.log(error)
    if (error.message && error.statusCode) {
      res.status = error.statusCode;
      res.returnData = error.message;
    } else {
      res.status = 500;
      res.returnData = error;
    }
    next();
  }
  return HandleError;
};
