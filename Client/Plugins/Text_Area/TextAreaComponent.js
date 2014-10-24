'use strict';
App.TextAreaMainComponent = App.BaseSectionComponent.extend({
  newText: null,
  hasText: Ember.computed.gt('data.length', 0),
  isEditing: false,
  actions: {
    ToggleEdit: function() {
      this.get('isEditing') ? this.set('isEditing', false) : this.set('isEditing', true);
    },
    NewMultiLineText: function() {
      if (this.get('newText')) {
        var data = {
          value: this.get('newText'),
        }
        this.submitAttachment(data);
      //  this.set('text', this.get('newText'));
      }
    },
    Update: function() {
      this.SaveAttachment(this.get('data').objectAt(0));
      this.get('isEditing') ? this.set('isEditing', false) : this.set('isEditing', true);
    },
    help:function(){
      Ember.Widgets.ModalComponent.popup({
        targetObject: this,
        content: {},
        contentViewClass:Ember.View.extend({
          templateName:'markdownHelp',
        }),
        headerText:'Markdown Help'
      })
    }
  },
  willInsertElement: function(event) {
    var context = this;

  },
  didInsertElement: function(event) {
    console.log('will');
    /*  this.get('model.attachments').forEach(function(att){
      console.log(att.value)
    })*/
  },
  text: function() {
    var converter = new Markdown.Converter();
    if (this.get('data').objectAt(0).get('data.value')) {
      return converter.makeHtml(this.get('data').objectAt(0).get('data.value'));
    }
    return '';
  }.property('data.@each.data.value')
})
