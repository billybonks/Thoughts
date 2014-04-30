'use strict';
App.TitleCardComponent = Ember.Component.extend(App.NewCardMixin,{
  showControlls:false,
  test:false,
  isLoading:false,
  actions:{
    Delete:function(){
      var context  = this;
      this.get('store').find('card', this.get('model').get('id')).then(function(rec){
        rec.deleteRecord();
        rec.save().then(function(){
                          context.sendAction('CreateNotification','Card deleted','success')
                        },
                        function(){
                          context.sendAction('CreateNotification','Error deleting card','danger')
                        });
      })
    },
    ToggleEdit:function(){
      console.log('editing')
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
    },
    onShare:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    onAddSection:function(){
      this.get('section') ? this.set('section',false):this.set('section',true);
    },
    Save:function(){
      $(document).attr('title',this.get('model.title'));
      this.get('isEditing')? this.set('isEditing', false): this.set('isEditing', true);
      this.get('store').find('Card',this.get('model.id')).then(function(card){
        card.save();
      });
    },
    SaveAsTemplate:function(){
      var template = {
        basedOff:this.get('model').get('id'),
      }
      template = this.store.createRecord('template', template);
      var context = this;
      var promise = template.save();
      promise.then(function(template){
        context.sendAction('CreateNotification','Template saved','success')
      },function(error){
        context.sendAction('CreateNotification','Template couldnt be saved','danger')
      });
    },
    EditCardSetting:function(){
      var configuration = this.GetConfiguration();
      var content = {
        embedded :configuration.get('embedded'),
        isOnMain :this.get('model.onMainDisplay')
      }
      if(typeof content.isOnMain ==='undefined' ){
        content.isOnMain = false;
      }
      var header = this.get('model.title') + ' Properties'
      this.set('modal',Ember.Widgets.ModalComponent.popup({
        targetObject: this,
        confirm: "SaveConfiguration",
        content: content,
        contentViewClass:Ember.View.extend({
          templateName:'cardSettings',
        }),
        headerText:header
      }));
    },
    SaveConfiguration:function(){
      var content = this.get('modal.content');
      var context = this;
      var model = this.get('model')
      var configuration = this.GetConfiguration();
      model.set('onMainDisplay',content.isOnMain);
      configuration.set('embedded',content.embedded);
      console.log(configuration.get('configures'))
      configuration.get('configures').then(function(configures){
        configuration.set('configures',configures);
        model.save();
        configuration.save();
      })
    }
  },
  GetConfiguration:function(){
    var parentId = parseInt(this.get('parent.id'));
    var configs = this.get('model.configurations');
    return configs.find(function(item, index, enumerable){
      var f = item.get('for')
      if(f === parentId){
        return true;
      }
    },configs)
  },
  FowardNotification:function(message,level){
    this.sendAction('CreateNotification',message,level)
  },
  openPluginModal:function(modalName,model,secondaryModel){
    return this.sendAction('openModal',modalName,model,secondaryModel);
  },
  cool: function(){
    return text;
  }.property('model'),
  mouseLeave: function(ctx){
    this.set('showControlls',false);
  },
  mouseEnter: function(ctx){
    this.set('showControlls',true)
  },
  GetParent:function(){
    if(this.get('model.content')){
      return this.get('model.content');
    }else{
      return this.get('model');
    }

  },
    configuration:function(){
      var parentId = parseInt(this.get('model.id'));
      var configs = this.get('model.configurations');
      return configs.find(function(item, index, enumerable){
        var f = item.get('for')
        if(f === parentId){
          return true;
        }
      },configs)
    }.property('model.configurations.@each.for')
});