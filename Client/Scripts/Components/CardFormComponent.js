App.CardFormComponent = Ember.Component.extend({
  title:null,
  description:null,
  store: null,
  actions:{
    Submit: function(){
      var tags = this.get('tagger').getTags()
      var card = this.store.createRecord('card', {
        title: this.get('title'),
        description: this.get('description'),
        left:0,
        top:0,
        tagsIn : tags
      });
      card.save();
      this.set('title','');
      this.set('description','');

    }
  },
});