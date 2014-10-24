'use strict';
App.Query = Ember.View.extend({
  templateName:'query',
  actions:{
    deleteQ:function(query){
      this.sendAction('deleteQuery',query);
    }
  }
});
