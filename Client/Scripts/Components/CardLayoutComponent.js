App.CardLayoutComponent = Ember.Component.extend({
  isEditing:false,
  word:'lol',
  actions:{
    edit:function(){
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    }
  },
  close:function(){
    this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
  }
})