var Controller = require('./controller.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise');
var Model = require('./../models/view');
var utils = require('./../lib/utils');
var ViewController = require('./view_controller.js');

module.exports = Controller.extend({
  needs: ['view'],
  viewController: new ViewController(),
  search:function(user,query){
    var buffer = new Buffer(query, 'base64');
    var view = buffer.toString();
    var model = new Model();
    model.update(JSON.parse(view));
    this.viewController.loadPage2(model,0,user)
  }

});
