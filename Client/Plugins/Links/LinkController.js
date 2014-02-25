'use strict';
App.LinkController = Ember.Controller.extend({
  isEditing:false,
  actions: {
    del: function () {
      var model = this.get('model');
      model.deleteRecord();
      model.save();
    },
    edit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      }
    },
})