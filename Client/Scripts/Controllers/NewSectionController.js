'use strict';
App.NewSectionController = Ember.ObjectController.extend({
  types:['Links','Documents','Questions','Tasks','Properties','TextArea','Card'],
  selectedType:null,
  actions:{
    Submit: function(){
      console.log(this.get('model.id'));
      var section = this.store.createRecord('section', {
        title: this.get('newTitle'),
        type : this.get('selectedType'),
        position:this.get('model.sections.length')
      });
      var card = this.get('model');
      section.set('card',card);
      this.get('model.sections').then(function(sections){
        section.save().then(function(section){
          sections.pushObject(section);
          card.save();
        });
      });
      this.send('close')
    },
    close: function() {
      return this.send('closeModal');
    }
  }
});