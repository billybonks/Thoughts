App.SectionFormComponent = Ember.Component.extend({
  types:['Links','Documents','Questions','Tasks'],
  selectedType:null,
  actions:{
    Submit: function(){
      console.log(this.get('card').get('id'))
      var section = this.store.createRecord('section', {
        title: this.get('title'),
        type : this.get('selectedType'),
        position:this.get('card').get('sections.length')
      });
      section.set('card',this.get('card'));
      section.save();
    }
  }
});