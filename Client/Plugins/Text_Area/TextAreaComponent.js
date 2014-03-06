'use strict';
App.TextAreaComponent = App.BaseSectionComponent.extend({
  text:null,
  newText:null,
  hasText: Ember.computed.gt('data.length',0),
  isEditing:false,
  actions:{
    ToggleEdit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    },
    NewMultiLineText:function(){
      console.log(this.get('data'));
      var data = {
        value:this.get('newText'),
      }
      this.submitAttachment(data);
      this.set('text',this.get('newText'));
    },
  Update:function(){
      var data = {
        value:this.get('text'),
      }
      //updateAttachment
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    }
  },
})