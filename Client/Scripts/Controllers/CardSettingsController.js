App.CardSettingsController = Ember.ObjectController.extend(App.PopupMixin,{
  isOnMain:'No',
  embedd:'Yes',
  options:['Yes','No'],
  actions:{
    submit:function(){

    }
  },
  configuration:function(){
    var parentId = parseInt(this.get('secondaryModel.id'));
    var configs = this.get('model.configurations');
    return configs.find(function(item, index, enumerable){
      var f = item.get('for')
      if(f === parentId){
        return true;
      }
    },configs)
  }.property('model.configurations.@each.for')
});