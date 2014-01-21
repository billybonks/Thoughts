var ServiceModule = require('./ServiceModule.js')
var Stream = require('stream');

module.exports = function(settings){

  function Section(settings){

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
            emitter.emit('GetSections.done',ret)
          }
        });
      }
    });

    return emitter;
  }

  Section.prototype.GetSectionAttachments = function(sectionId){
    var query =  [
      'start section=node('+sectionId+')',
      'match (attachment:Attachment)-[Attached?]->(section)',
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
              //get payloads code
            }
        responseStream.emit('data',section)
      })
    })
    return responseStream;
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
  Section.prototype.UpdateSection = function(section){

  }

  return new Section(settings);
}