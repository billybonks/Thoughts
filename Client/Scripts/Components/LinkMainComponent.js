App.LinkMainComponent = Ember.Component.extend({
  isEditing:false,
  actions:{
    edit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      console.log(this.get('popup'))
    },
    menu:function(){
      console.log('menu')
    }
  },
});