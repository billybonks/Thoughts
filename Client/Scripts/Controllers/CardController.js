App.CardController = Ember.ObjectController.extend({

  actions:{
  },
  IsRight:function(){
    console.log('right')
    console.log(this.get('section'))
    return true;
  }.property(),
  sortSomeAttachments:function(){
    console.log('sorting')
    var attachments = this.get('model').get('attachments');
    var tags = this.get('model').get('tags');
    var tit = this.get('model').get('title');
    console.log('sorting');
    for(var i = 0;i<attachments.length;i++){
      var a = attachments[i];
      if(a.type=="Link"){
        links.push(a)
      }
    }
    return '';
  }.observes('model.attachments.@each.type'),
  position:function(){
    return 'left:' + this.get('model').get('left') + 'px;top:' + this.get('model').get('top') + 'px';
  }.property('model.left'),




  /* linkCount: function () {
        this.get('model').get('test');
        var links = this.get('model').get('links');
        links.forEach(function (element) {
            console.log('lINK');
        });
        return links.length;
    }.property("model.links"),
    documentCount: function () {
        return this.get('model').get('documents').length;
    }.property("model.documents"),
    commentCount: function () {
        return this.get('model').get('comments').length;
    }.property("model.comments")


      sortAttachments:function(){


      if()
    }
  },
  */
});