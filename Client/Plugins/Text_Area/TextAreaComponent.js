'use strict';
App.TextAreaMainComponent = App.BaseSectionComponent.extend({
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
      this.SaveAttachment(this.get('data').objectAt(0));
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    }
  },
  willInsertElement:function(event){
    console.log('will');
    /*  this.get('model.attachments').forEach(function(att){
      console.log(att.value)
    })*/
      },
  didInsertElement:function(event){
    console.log('will');
    /*  this.get('model.attachments').forEach(function(att){
      console.log(att.value)
    })*/
  },
  text:function(){
    var converter = new Markdown.Converter();
    if(this.get('data').objectAt(0).get('data.value')){
      return converter.makeHtml(this.get('data').objectAt(0).get('data.value'));
    }
    return '';
  }.property('data.@each.data.value')
})