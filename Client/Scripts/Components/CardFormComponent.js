App.CardFormComponent = Ember.Component.extend({
  title:null,
  description:null,
  store: null,
  actions:{
    Submit: function(){
      var card = this.store.createRecord('card', {
        title: this.get('title'),
        description: this.get('description'),
        left:0,
        top:0
      });
      card.save();
      this.set('title','');
      this.set('description','');
    }
  },
});