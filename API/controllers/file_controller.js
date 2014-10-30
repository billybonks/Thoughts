var Controller = require('./controller.js');
var error = require('./../lib/Errors.js').reject;
var Promise = require('./../lib/promise');
var Model = require('./../models/file');
var utils = require('./../lib/utils');
var uuid = require('node-uuid');
var nconf = require('nconf');

module.exports = Controller.extend({
  createFile:function(user,file){
    var context = this;
    return Promise.call(this, function(resolve, reject) {
      var regex = /^data:.+\/(.+);base64,(.*)$/;
      var matches = file.data.match(regex);
      var ext = matches[1];
      var data = matches[2];

      var buffer = new Buffer(data, 'base64');
      var name = uuid.v4() + '.'+file.name+'.' + ext;
      var suffix = '/users/'+ user.id;
      var path = nconf.get('filestore')+suffix
      mkpath.sync(path);
      fs.writeFile( path + '/' + name, buffer, function(err, written, buffer) {
        file.set('url',nconf.get('fileserver')+'/'+suffix+name);
        resolve(file);
      });
    });
  },
  deleteFile:function(){

  },
  updateFile:function(){

  }
});
