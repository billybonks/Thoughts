var rsvp = require('rsvp');
module.exports = function(callback){
  var context = this;
  return new rsvp.Promise(function(resolve, reject) {
    callback.call(context,resolve,reject)
  });
};
