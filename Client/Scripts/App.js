App = Ember.Application.create({

  ready: function () {
    var token = $.urlParam('token');
    if (token) {
      $.cookie(AppSettings.CookieName, token);
      window.location = 'http://'+AppSettings.domain+'/'
    }
    token = $.cookie(AppSettings.CookieName);
    if (!token) {
      $.cookie(AppSettings.CookieName, 'Guest');
    }
    App.ApplicationAdapter = DS.RESTAdapter.extend({
      //  namespace: 'api',
      host: AppSettings.WebserviceURL,
      headers: { 'Authorization': token },
      // defaultSerializer: 'App/appacitiveREST'
    });
  },
  customEvents: {
    "mouseover": "mouseOver"
  }
});

DragNDrop = Ember.Namespace.create();

DragNDrop.cancel = function(event) {
  console.log('cancel')
  event.preventDefault();
  return false;
};
DragNDrop.blank = function(){
  return true;
};

DragNDrop.DragAndDroppable = Ember.Mixin.create({
  layoutName:'DragAndDroppable',
  attributeBindings: 'draggable',
  dragEnter: DragNDrop.cancel,
  dragOver: DragNDrop.cancel,
  draggable: 'true',
  dragStart: DragNDrop.cancel,
  drop:DragNDrop.cancel
});


DragNDrop.DropTarget = Ember.Mixin.create({
  dragEnter: DragNDrop.blank,
  dragOver: DragNDrop.blank,
  dragStart: DragNDrop.blank,
  drop:DragNDrop.blank
});

App.PopupMixin = Ember.Mixin.create({
  actions:{
    close: function() {
      return this.send('closeModal');
    }
  }
});

App.OnErrorMixin = Ember.Mixin.create({
  OnError:function(context,model){
    var context = context;
    var model = model
    function onError(reason){
      context.send('error',reason);
      if(model){
        model.rollback();
      }
    }
    return onError;
  }
});

App.PopupOpenerMixin = Ember.Mixin.create({
  actions:{
    openModal:function(modalName,model,secondaryModel){
      return true;
    },
    openModalSource:function(modalName,model,secondaryModel){
      if(this.sendAction){
        return this.sendAction('openModal',modalName,model,secondaryModel);
      }
      else this.send('openModal',modalName,model,secondaryModel);
    }
  },
  openModalFunction:function(modalName,model,secondaryModel){
    if(this.sendAction){
      return this.sendAction('openModalSource',modalName,model,secondaryModel);
    }
    else this.send('openModalSource',modalName,model,secondaryModel);
  }
});

App.PluginPopupOpenerMixin = Ember.Mixin.create({
  actions:{
    openModalPlugin:function(modalName,model,secondaryModel){
      this.get('targetObject').openModalFunction.call(this.get('targetObject'),modalName,model,secondaryModel)
    }
  }
});

App.SubmitAttachmentMixin = Ember.Mixin.create({
  submitAttachment:function(data){
    var attachment =  {
      data: data,
      sectionid: this.get('model').get('id'),
      type:this.get('model').get('type')
    };
    if(this.get('targetObject')){
      this.get('targetObject').StartLoading();
    }
    var context = this;
    attachment = this.store.createRecord('attachment', attachment);
    this.store.find('card',this.get('model').get('id')).then(function(card){
      attachment.set('card',card);
      attachment.save().then(
        function(attachment){
          if(context.get('targetObject')){
            context.get('targetObject').StopLoading();
          }
          var attachments =card.get('attachments').then(function(attachments){
            attachments.pushObject(attachment);
            if(context.get('targetObject')){
              context.get('targetObject').FowardNotification('Attachment saved','success')
            }else{
              context.send('notification','Attachment saved','success')
            }
          });
        },
        function(error){
          if(context.get('targetObject')){
            context.get('targetObject').StopLoading();
          }
          attachment.rollback();
          if(context.get('targetObject')){
            context.get('targetObject').FowardNotification('Attachment couldnt be saved','danger')
          }else{
            context.send('notification','Attachment couldnt be saved','danger')
          }

        });;//.then(context.sendAction('modelSateChange',attachment.currentState));



    });
  },
  SaveAttachment:function(model){
    var context = this;
   // context.get('targetObject').StartLoading();
    model.save().then(function(att){
                        if(context.get('targetObject')){
                         // context.get('targetObject').StopLoading();
                          context.get('targetObject').FowardNotification('Attachment updated','success');
                        }else if(context.parentController){
                          context.parentController.Notify('Attachment updated','success')
                        }else{
                          context.send('notification','Attachment updated','success')
                        }

                      },
                      function(error){
                        if(context.get('targetObject')){
                         // context.get('targetObject').StopLoading();
                          context.get('targetObject').FowardNotification('Attachment couldnt be saved','danger')
                          context.get('targetObject').FowardNotification('Attachment updated','success');
                        }else if(context.parentController){
                          context.parentController.Notify('Attachment couldnt be saved','danger');
                        }else{
                          context.send('notification','Attachment couldnt be saved','danger')
                        }

                      })
  }
})

/*
App.ApplicationSerializer = DS.RESTSerializer.extend({
  serializeHasMany: function(record, json, relationship) {
    var key = relationship.key;

    // don't care which kind of hasMany relationship this is
    json[key] = get(record, key).mapBy('id');
  }
});*/