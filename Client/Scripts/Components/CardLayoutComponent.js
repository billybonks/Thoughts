App.CardLayoutComponent = Ember.Component.extend({
  isEditing:false,
  IsLink:Ember.computed.equal('section.type', 'Links'),
  IsTask:Ember.computed.equal('section.type', 'Tasks'),
  IsDocument:Ember.computed.equal('section.type', 'Documents'),
  IsQuestion:Ember.computed.equal('section.type', 'Questions'),
  word:'lol',
  actions:{
    edit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    }
  },
  close:function(){
    this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
  }
})