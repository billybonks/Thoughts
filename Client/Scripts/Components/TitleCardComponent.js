'use strict';
App.TitleCardComponent = Ember.Component.extend(App.PopupOpenerMixin,{
    isImage:Ember.computed.equal('model.type', 'Image'),
    isList:Ember.computed.equal('model.type', 'List'),
    isProperties:Ember.computed.equal('model.type', 'Properties'),
    isTasks:Ember.computed.equal('model.type', 'Tasks'),
    isText_Area:Ember.computed.equal('model.type', 'Text_Area'),
    isTitled_Notes:Ember.computed.equal('model.type', 'Titled_Notes'),
  showControlls:false,
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
    }
  },
  mouseLeave: function(ctx){
    this.set('showControlls',false);
  },
  mouseEnter: function(ctx){
    this.set('showControlls',true)
  }
});