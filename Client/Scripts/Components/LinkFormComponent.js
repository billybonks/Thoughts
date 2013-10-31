App.LinkFormComponent = Ember.Component.extend({
  link:null,
  actions:{
      Submit: function(){
        //title to be set server side
        var link = this.store.createRecord('link', {
          link: this.get('link')
        });
        this.set('title','');
        this.set('description','');
      }
  }
});