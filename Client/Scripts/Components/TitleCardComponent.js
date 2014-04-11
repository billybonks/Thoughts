'use strict';
App.TitleCardComponent = Ember.Component.extend(App.PopupOpenerMixin,{
  showControlls:false,
  test:false,
  actions:{
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
    onShare:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    onAddSection:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    Save:function(){
      console.log(this.get('model.title'));
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
  cardFormPackage:function(){
    var cardPackage = {}
    cardPackage.parent = this.get('model');
    cardPackage.embedded = this.get('isMain') ? false : true;
    cardPackage.onMainDisplay = false;
    return cardPackage;
  }.property('model')
});