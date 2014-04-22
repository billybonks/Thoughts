'use strict';
App.CardController = Ember.ObjectController.extend(App.PopupOpenerMixin,{
  //currentRouteName: Em.computed.alias('controllers.application.currentRouteName'),
  currentPath: Em.computed.alias('controllers.application.currentPath'),
  needs:'application',
  actions:{
    CreateNotification:function(message,level){
      this.send('notification',message,level);
    },
    Delete:function(){
      this.get('store').find('card', this.get('model').get('id')).then(function(rec){
        rec.deleteRecord();
        rec.save();
      });
    },
    ToggleEdit:function(){
      console.log('editing')
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    },
    Share:function(){
    },
    CreateSection: function(){
      console.log(this.get('model').get('id'))
      var section = this.store.createRecord('section', {
        title: 'tester',
        type : 'Links',
        position:'0'
      });
      section.save().then(function(section){
        this.get('model.sections').then(function(sections){
          sections.push(section);
        })
        this.get('model').save();
      });
    }
  },
  display:function(){
    if(this.get('parentController.templates')){
      if(this.get('model.isTemplate')){
        return true;
      }
    }else{
      if(this.get('model.isTemplate')){
        return false;
      }else{
        return true;
      }
    }
  }.property('parentController.templates'),
  close:function(card){
    console.log('card closing');
  },
  IsRight:function(){
    console.log('right')
    console.log(this.get('section'))
    return true;
  }.property(),
  sortSomeAttachments:function(){
  var attachments = this.get('model').get('attachments');
  var tags = this.get('model').get('tags');
  var tit = this.get('model').get('title');
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