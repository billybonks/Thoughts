App.SectionSettingsController = Ember.ObjectController.extend(App.PopupMixin,{
  options:['Yes','No'],
  actions:{
    Submit:function(){
      if(this.get('displayOnCard') === 'Yes'){
        this.set('model.displayOnCard',true);
      }else{
        this.set('model.displayOnCard',false);
      }
      this.get('model').save();
    }
  }
});