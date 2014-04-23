'use strict';
var uuid = require('node-uuid');
module.exports = function () {

  return  function(req, res, next) {
    req.id = uuid.v4();
    next();
  };
};
