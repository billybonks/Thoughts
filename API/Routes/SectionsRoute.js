var ServiceModule = require('./ServiceModule.js')
var Stream = require('stream');
var AttatchmentRoute = require('./AttatchmentRoute.js')
module.exports = function(settings){

  function Section(settings){
    this.attachment = new AttatchmentRoute(settings);
  }
  /* ========================================================================================================
   *
   * Class Setup - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Section.prototype = new ServiceModule(settings);

  /* ========================================================================================================
   *
   * Read Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Section.prototype.GetSections=function(sectionIds){
    var GetSectionAttachments = this.GetSectionAttachments;
    var counter =0;
    var count = 0;
    var sections = {}
    var ret = []
    var emitter = new Stream();
    var nodeStream = this.GetNodes(sectionIds);

    nodeStream.once('GetNodes.done',function(results){

      count = results.length
      for(var i = 0;i < results.length;i++){
        var section = {
          id: results[i].n.id,
          type:results[i].n.data.type,
          position:results[i].n.data.position,
          title : results[i].n.data.title,
          attachments:[]
        };
        sections[section.id] = section;
        var attachmentStream = GetSectionAttachments(section.id);
        attachmentStream.on('GetSectionAttachments.done',function(results){
          var secID;
          for(var i = 0; i<results.length;i++){
            for(item in sections){
            }
            secID = results[i].section;
            if(results[i].id){
              sections[secID].attachments.push(results[i].id);
            }
          }
          console.log('push ' + secID)
          console.log(sections[secID])
          ret.push(sections[secID]);
          counter++;
          console.log(counter+'==='+count)
          if(counter===count){
            emitter.emit('data',ret)
          }
        });
      }
    });

    return emitter;
  }

  Section.prototype.GetSectionAttachments = function(sectionId){
    var query =  [
      'start section=node('+sectionId+')',
      'optional match (attachment)-[:Attached]->(section)',
      'Where not(has(attachment.isDeleted))',
      'return attachment'
    ];
    var emitter = new Stream();
    var queryStream = settings.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
      var ret = [];
      for(var i =0; i< results.length;i++){
        //section
        if(results[i].attachment){
          ret.push({id:results[i].attachment.id,data:results[i].attachment.data,section:sectionId});
        }else{
          ret.push({section:sectionId})
        }
      }
      emitter.emit('GetSectionAttachments.done',ret)
    });
    return emitter;
  }
  /* ========================================================================================================
   *
   * Write Methods - Keep in alphabetical order
   *
   * ===================================================================================================== */
  Section.prototype.CreateSection = function(title,type,position,cardId){
    var responseStream = new Stream();
    var query = 'CREATE (n:Section {data}) RETURN n';
    var variableHash = {data:{title:title,type:type,position:position}};
    var queryStream = settings.executeQuery(query,variableHash);
    var LinkCard = this.LinkCard;
    queryStream.once('data',function(results){

      var resultStream = LinkCard(results[0].n.id,cardId);
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

  Section.prototype.DeleteSection = function(sectionId){
    var query = ['START section=node('+sectionId+')',
                 'SET section.isDeleted = true'];
    var returnStream = new Stream();
    var queryStream = settings.executeQuery(query.join('\n'),{});
    queryStream.on('data',function(results){
      returnStream.emit('data',{})
    })
    return returnStream;
  }

  Section.prototype.DuplicateAndLink = function(section,cardId,token){
    var returnStream = new Stream();
    var resultStream = this.attachment.getAttachments(section.attachments);
    var CreateSection = this.CreateSection
    var context = this;
    var attRoute = this.attachment
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

  Section.prototype.LinkCard = function(sectiontId,cardId){
    var query =  [
      'START section=node('+sectiontId+'),card=node('+cardId+')',
      'MATCH (card:Card)',
      'CREATE section<-[r:Has]-card',
      'RETURN section'
    ];
    console.log('query')
    var queryStream = settings.executeQuery(query.join('\n'),{});
    return queryStream;
  }

  Section.prototype.UpdateSection = function(section,sectionID){
    var query =  [
      'START section=node('+sectionID+')',
      'Set section.title = {title},',
      'section.position  = {position},',
      'section.collapsed = {collapsed}',
      'RETURN section'
    ];
    var resultStream = new Stream();
    var queryStream = settings.executeQuery(query.join('\n'),section);
    queryStream.on('data',function(results){
      resultStream.emit('data',results);
    })
    return resultStream;
  }

  return new Section(settings);
}