App.CardSettingsController = Ember.ObjectController.extend(App.PopupMixin,{
  options:['Yes','No'],
  positions:function(){
    var l = this.get('secondaryModel.sections.length');
    var ret = []
    for(var i =0;i<l;i++){
      ret.push(i);
    }
    return ret;
  }.property('secondaryModel.@each.sections'),
  actions:{
    Submit:function(){
      if(this.get('displayOnCard') === 'Yes'){
        this.set('model.displayOnCard',true);
      }else{
        this.set('model.displayOnCard',false);
      }
      this.get('model').save();
      this.send('close')
    }
  }
});