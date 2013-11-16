App.LinkMainComponent = Ember.Component.extend({
  isEditing:false,
  word:'???',
  actions:{
    edit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      console.log(this.get('popup'))
    }
  },
  editz:function(){
    this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
  }
});