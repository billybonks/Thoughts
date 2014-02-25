var SectionsController = require('./../SectionController')();
module.exports = function (app) {
  'use strict';
  /* ========================================================================================================
   *
   * Section Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  app.get('/sections',function(req,res){
  var resultStream = SectionsController.GetSections(req.query.ids);
  resultStream.once('data',function(results){
    var ret = [];
    for(var section in results){
      ret.push(SectionsController.FormatObject(results[section],results[section].attachments));
    }
    res.json({sections:ret});
  });
});
};