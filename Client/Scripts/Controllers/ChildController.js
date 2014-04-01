'use strict';
App.ChildController = Ember.ObjectController.extend({
  isEditing:false,
  isImage:Ember.computed.equal('model.type', 'Image'),
  isList:Ember.computed.equal('model.type', 'List'),
  isProperties:Ember.computed.equal('model.type', 'Properties'),
  isTasks:Ember.computed.equal('model.type', 'Tasks'),
  isText_Area:Ember.computed.equal('model.type', 'Text_Area'),
  isTitled_Notes:Ember.computed.equal('model.type', 'Titled_Notes'),
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
    },
    modelSateChange:function(state){
      console.log(state);
    }
  },
  close:function(){
    this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
  },
  chevron:function(){
    var model = this.get('model');
    if(model.get('collapsed')){
      return 'glyphicon glyphicon-chevron-up';
    }else{
      return 'glyphicon glyphicon-chevron-down';
    }
  }.property('model.collapsed'),
  card2:function(){
    return this.get('card');
  }.property('this')

});