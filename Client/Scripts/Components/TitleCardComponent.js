'use strict';
App.TitleCardComponent = Ember.Component.extend(App.PopupOpenerMixin,{
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
    return {model:this.get('model'),isMain:this.get('isMain')}
  }.property('model')
});