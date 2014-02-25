'use strict';
App.SideBarComponent = Ember.Component.extend({
  Active:false,
  CurrentForm:'',
  card:false,
  link:false,
  actions:{
    NewCard: function(){
      this.get('Active') ? this.set('Active',false) : this.set('Active',true);
      this.set('card',true);
      this.set('link',false);
    },
    NewLink: function(){
      this.get('Active') ? this.set('Active',false) : this.set('Active',true);
      this.set('card',false);
      this.set('link',true);
    }
  },
  DisplayForm:function(){
    if(this.get('Active')){
      return 'display:block;';
    }else{
      return 'display:none;';
    }
  }.property('Active')
});