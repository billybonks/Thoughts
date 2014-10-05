'use strict';
var utils = require('./utils');
module.exports = function() {
    return function(req, res, next) {
      var routeName = req.path.split('/')[1];
        if (res.error) {

        } else if (res.payload) {
          var prefix =null
          var payload = res.payload;
          if(payload.getJSON){
            prefix = utils.toSingular(routeName)
            payload = payload.getJSON();
          }else if(payload.length){
            prefix = routeName;
            payload = utils.arrayToJSON(payload);
          }else{
            prefix = routeName;
            payload = utils.dictionaryToJSON(payload);
          }
          var ret = {}
          ret[prefix]= payload;
          res.json(200,ret)
        }else{
          res.json(res.status, res.returnData)
        }
    };
};
