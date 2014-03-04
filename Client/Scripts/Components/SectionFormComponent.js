'use strict';
App.SectionFormComponent = Ember.Component.extend({
  types:['Links','Documents','Questions','Tasks','Properties','TextArea','Card'],
  selectedType:null,
  actions:{
    Submit: function(){
      console.log(this.get('card').get('id'));
      var section = this.store.createRecord('section', {
        title: this.get('title'),
        type : this.get('selectedType'),
        position:this.get('card').get('sections.length')
      });
      var card = this.get('card');
      section.set('card',this.get('card'));
      this.get('card.sections').then(function(sections){
        section.save().then(function(section){
          sections.pushObject(section);
          card.save();
        });
      });
      Ember.instrument('popup.close', {}, function() {
      });
    }
  }
});