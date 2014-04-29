'use strict';
App.TitleCardComponent = Ember.Component.extend(App.NewCardMixin,{
  showControlls:false,
  test:false,
  isLoading:false,
  actions:{
    Delete:function(){
      var context  = this;
      this.get('store').find('card', this.get('model').get('id')).then(function(rec){
        rec.deleteRecord();
        rec.save().then(function(){
                          context.sendAction('CreateNotification','Card deleted','success')
                        },
                        function(){
                          context.sendAction('CreateNotification','Error deleting card','danger')
                        });
      })
    },
    ToggleEdit:function(){
      console.log('editing')
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    },
    onShare:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    onAddSection:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    Save:function(){
      $(document).attr('title',this.get('model.title'));
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      this.get('store').find('Card',this.get('model.id')).then(function(card){
        card.save();
      });
    },
    SaveAsTemplate:function(){
      var template = {
        basedOff:this.get('model').get('id'),
      }
      template = this.store.createRecord('template', template);
      var context = this;
      var promise = template.save();
      promise.then(function(template){
        context.sendAction('CreateNotification','Template saved','success')
      },function(error){
        context.sendAction('CreateNotification','Template couldnt be saved','danger')
      });
    },
  },
  FowardNotification:function(message,level){
    this.sendAction('CreateNotification',message,level)
  },
  openPluginModal:function(modalName,model,secondaryModel){
    return this.sendAction('openModal',modalName,model,secondaryModel);
  },
  cool: function(){
    return text;
  }.property('model'),
  mouseLeave: function(ctx){
    this.set('showControlls',false);
  },
  mouseEnter: function(ctx){
    this.set('showControlls',true)
  },
  parent:function(){
    if(this.get('model.content')){
      return this.get('model.content');
    }else{
      return this.get('model');
    }

  }.property('model')
});