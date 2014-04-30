'use strict';
App.IndexController = Ember.Controller.extend({
  LoggedIn:function(){
    if(this.get('model.id') === 'Guest'){
      return false;
    }else{
      return true
    }
  }.property('model')
});