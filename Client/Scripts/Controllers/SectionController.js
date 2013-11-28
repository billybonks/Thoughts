App.SectionController = Ember.ObjectController.extend({
  isEditing:false,
  IsLink:Ember.computed.equal('model.type', 'Links'),
  IsTask:Ember.computed.equal('model.type', 'Tasks'),
  IsDocument:Ember.computed.equal('model.type', 'Documents'),
  IsQuestion:Ember.computed.equal('model.type', 'Questions'),
  IsRight:function(){
    var t = this.get('section').get('position') % 2;
    console.log(t);
    if(this.get('section').get('position') % 2 === 0){

    }
  }.property('section.position'),
  actions:{
    edit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    }
  },
  close:function(){
    this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
  }
});