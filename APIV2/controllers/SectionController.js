
//require staements
var controller = require('./controller.js');
var AttachmentController = require('./AttachmentController')();
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
    console.log(sectionIds);
    var context = this;
    var counter =0;
    var count = 0;
    var sections = {};
    var ret = [];
    var emitter = new Stream();
    var query = [this.BuildStartStatement(sectionIds,'section'),
                 'Where not(has(section.isDeleted))',
                 'Optional Match (attachment)-[a:Attached]->(section)',
                 'return section,attachment'];
    this.executeQuery(query.join('\n'),{}).on('data',function(results){
      var sections = [];
      var sectionIds=[]
      count=results.length;
      for(var i = 0;i<count;i++){
        var sectionId = results[i].section.id;
        if(!(sectionId in sections)){
          sections[results[i].section.id] = {
            id : results[i].section.id,
            data : results[i].section.data,
            attachments:[]
          };
          sectionIds.push(results[i].section.id);
        }
        if(results[i].attachment){
          var attachmentId = results[i].attachment.id;
          if(!(attachmentId in sections[sectionId].attachments)){
            sections[sectionId].attachments[attachmentId] = { id : attachmentId, data : results[i].attachment.data};
          }
        }
      }
      console.log(sections);
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
          // ret.push({section:sectionId});
        }
      }
      emitter.emit('data',ret);
    });
    return emitter;
  };

  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  SectionController.prototype.CreateSection = function(title,type,position,cardId){
    var responseStream = new Stream();
    var query = 'CREATE (n:Section {data}) RETURN n';
    var variableHash = {data:{title:title,type:type,position:position}};
    var queryStream = this.executeQuery(query,variableHash);
    var context = this;
    queryStream.once('data',function(results){

      var resultStream = context.LinkCard.call(context,results[0].n.id,cardId);
      resultStream.on('data',function(results){
        console.log(results[0])
        var data = results[0].section.data;
        var section =
            {
              id:results[0].section.id,
              type:data.type,
              position:data.position,
              card:cardId,
              title:data.title
              //get payloads code
            }
        responseStream.emit('data',section)
      })
    })
    return responseStream;
  }

  SectionController.prototype.DeleteSection = function(sectionId){
    var query = ['START section=node('+sectionId+')',
                 'SET section.isDeleted = true'];
    var returnStream = new Stream();
    var queryStream = this.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
      returnStream.emit('data',{})
    })
    return returnStream;
  }

  SectionController.prototype.DuplicateAndLink = function(section,cardId,token){
    var returnStream = new Stream();
    console.log('lllllllllllllllllll');
    console.log(section);
    var resultStream = AttachmentController.getAttachments(section.attachments);
    var CreateSection = this.CreateSection
    var context = this;
    var attRoute = AttachmentController
    resultStream.on('data',function(attachments){
      resultStream = CreateSection.call(context,section.title,section.type,section.position,cardId);
      resultStream.on('data',function(section){
        var counter = 0;
        var attachmentIds = []
        for(var i = 0;i<attachments.length;i++){
          resultStream = attRoute.createAttachment.call(attRoute,attachments[i].data,token,[],section.id)
          resultStream.on('data',function(result){
            counter++;
            attachmentIds.push(result.id)
            if(counter === attachments.length){
              returnStream.emit('data',{})
              console.log(section.id)
            }
          })
        }
      })


    })
    return returnStream;
  }

  SectionController.prototype.LinkCard = function(sectiontId,cardId){
    var query =  [
      'START section=node('+sectiontId+'),card=node('+cardId+')',
      'MATCH (card:Card)',
      'CREATE section<-[r:Has]-card',
      'RETURN section'
    ];
    console.log('query')
    var queryStream = this.executeQuery(query.join('\n'),{});
    return queryStream;
  }

  SectionController.prototype.UpdateSection = function(section,sectionID){
    var query =  [
      'START section=node('+sectionID+')',
      'Set section.title = {title},',
      'section.position  = {position},',
      'section.collapsed = {collapsed}',
      'RETURN section'
    ];
    var resultStream = new Stream();
    var queryStream = this.executeQuery(query.join('\n'),section);
    queryStream.on('data',function(results){
      resultStream.emit('data',results);
    })
    return resultStream;
  }
  /* ========================================================================================================
   *
   * Helper Methods - Keep in alphabetical order
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
