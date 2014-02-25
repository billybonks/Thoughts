
//require staements
var controller = require('./controller.js');
var Stream = require('stream');

module.exports = function(){
  'use strict';
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  function SectionController(){
  }

  SectionController.prototype = new controller();

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  SectionController.prototype.GetSections=function(sectionIds){
    var context = this.GetSectionAttachments;
    var counter =0;
    var count = 0;
    var sections = {};
    var ret = [];
    var emitter = new Stream();
    var nodeStream = this.GetNodes(sectionIds);
    this.BuildStartStatement(sectionIds);
    var query = [this.BuildStartStatement(sectionIds),
                 'Optional Match (attachment)-[a:Attached]->(section)',
                 'return section,attachment'];
    console.log(query.join('\n'));
    this.executeQuery(query.join('\n'),{}).on('data',function(results){
      console.log(results);
      var sections = [];
      for(var i = 0;i<results.length;i++){
        var sectionId = results[i].section.id;
        if(!(sectionId in sections)){
          sections[results[i].section.id] = {
            id : results[i].section.id,
            data : results[i].section.data,
            attachments:[]
          };
        }
        var attachmentId = results[i].attachment.id;
        if(!(attachmentId in sections[sectionId].attachments)){
          sections[sectionId].attachments[attachmentId] = { id : attachmentId, data : results[i].attachment.data};
        }
      }
      emitter.emit('data',sections);
    });
    return emitter;
  };

  SectionController.prototype.GetSectionAttachments = function(sectionId){
    var query =  [
      'start section=node('+sectionId+')',
      'optional match (attachment)-[:Attached]->(section)',
      'Where not(has(attachment.isDeleted))',
      'return attachment'
    ];
    var emitter = new Stream();
    var queryStream = this.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
      var ret = [];
      for(var i =0; i< results.length;i++){
        //section
        if(results[i].attachment){
          ret.push({id:results[i].attachment.id,data:results[i].attachment.data,section:sectionId});
        }else{
          ret.push({section:sectionId});
        }
      }
      emitter.emit('GetSectionAttachments.done',ret);
    });
    return emitter;
  };

  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  SectionController.prototype.FormatObject = function(section,attachments){
    section = {
      id: section.id,
      type:section.data.type,
      position:section.data.position,
      title : section.data.title,
      attachments:[]
    };
    for(var aID in attachments){
      section.attachments.push(aID);
    }
    return section;
  };

  return new SectionController();
};
