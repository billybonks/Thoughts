App.QuestionMainComponent = Ember.Component.extend({
  layoutName:'cardview',
  title:'Questions',
  actions:{
  },
  willInsertElement:function(){
    console.log('setting Up');
    console.log(this.get('layoutName'));
    this.set('layoutName','cardview');
  }
});