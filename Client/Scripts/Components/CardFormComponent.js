App.CardFormComponent = Ember.Component.extend({
  title:null,
  description:null,
  actions:{
    Submit: function(){
      var card = this.store.createRecord('idea', {
        title: this.get('title'),
        description: this.get('description'),
        left:0px,
        top:0px
        user:null//current user
      });
      this.set('title','');
      this.set('description','');
    }
  },
});