App.SectionController = Ember.ObjectController.extend({
  isEditing:false,
  IsLink:true,//Ember.computed.equal('section.type', 'Links'),
  IsTask:Ember.computed.equal('section.type', 'Tasks'),
  IsDocument:Ember.computed.equal('section.type', 'Documents'),
  IsQuestion:Ember.computed.equal('section.type', 'Questions'),
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