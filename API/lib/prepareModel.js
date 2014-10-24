'use strict';
var utils = require('./utils');
module.exports = function() {
    return function(req, res, next) {
        console.log(req.path.split('/')[1])
        if (req.method === 'POST' || req.method === 'PUT') {
            var routeName = req.path.split('/')[1];
            routeName = utils.toSingular(routeName);
            try{
              var Model = utils.modelFor(routeName);
              var model = new Model();
              model.update(req.body[routeName]);
              console.log(req.body[routeName])
              req.model = model;
              console.log('PARAMS')
              console.log(req.params)
              if (req.params) {
                  if (req.params.id)
                      model.set('id', req.params.id);
              }
            }catch(e){

            }finally{
              next();
            }
        } else {
            next();
        }
    };
};
