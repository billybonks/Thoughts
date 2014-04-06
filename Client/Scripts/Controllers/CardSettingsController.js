App.CardSettingsController = Ember.ObjectController.extend(App.PopupMixin,{
  isOnMain:'No',
  embedd:'Yes',
  options:['Yes','No'],
  actions:{
    submit:function(){
      var context = this;
      var model = this.get('model')
      var configuration = this.get('configuration');
      if(this.get('isOnMain') == 'Yes'){
        model.set('onMainDisplay',true);
      }else{
        model.set('onMainDisplay',false);
      }
      if(this.get('embedd') === 'Yes'){
        configuration.set('embedded',true);
      }else{
        configuration.set('embedded',false);
      }
      console.log(configuration.get('configures'))
      configuration.get('configures').then(function(configures){
        configuration.set('configures',configures);
        model.save();
        configuration.save();
        context.send('close');
      })

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