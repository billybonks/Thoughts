App.SectionController = Ember.ObjectController.extend({
  isEditing:false,
  isLink:Ember.computed.equal('model.type', 'Links'),
  isTask:Ember.computed.equal('model.type', 'Tasks'),
  isDocument:Ember.computed.equal('model.type', 'Documents'),
  isQuestion:Ember.computed.equal('model.type', 'Questions'),
  isProperty:Ember.computed.equal('model.type', 'Properties'),
  isTextArea:Ember.computed.equal('model.type', 'TextArea'),
  isCard:Ember.computed.equal('model.type', 'Card'),
  isCollapsed:Ember.computed.bool('model.collapsed'),
  actions:{
    ToggleEdit:function(){

      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    },
    deleteSection:function(){
      var model = this.get('model');
      model.deleteRecord();
      model.save()
    },
    collapse:function(){
      var model = this.get('model');
      model.get('collapsed')? model.set('collapsed', false): model.set('collapsed', true);
      model.save();
      return false;
    },
    UpdateSection:function(){
      this.get('model').save();
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    }
  },
  close:function(){
    this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
  },
  chevron:function(){
    var model = this.get('model');
    if(model.get('collapsed')){
      return "glyphicon glyphicon-chevron-up"
    }else{
      return "glyphicon glyphicon-chevron-down"
    }
  }.property('model.collapsed')

});