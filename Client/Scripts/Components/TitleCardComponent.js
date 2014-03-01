'use strict';
App.TitleCardComponent = Ember.Component.extend({
  actions:{
    onDelete:function(){
    },
    onShare:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    onEdit:function(){
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
  }
});