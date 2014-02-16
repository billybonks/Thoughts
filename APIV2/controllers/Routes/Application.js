var ApplicationRoute = require('./../Application')();
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Application Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */

  app.get('/applications/:id',function (req,res){
    var application = ApplicationRoute;
   // var cards = CardsRoute;
    application.GetApplication(req.headers.authorization).on('data', function (results) {
      if(results.length > 0){
        var node = results[0].n;
        var retApp = application.FormatApplicationObject(node);
        /*cards.GetTemplates(req.headers['authorization']).on('data',function(templates){

          res.json({applications:retApp,templates:templates})
        })*/
        res.json({applications:retApp});

      }else{
        res.json({applications:{}});
      }
    });
  });

};