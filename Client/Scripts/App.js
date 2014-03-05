App = Ember.Application.create({

  ready: function () {
    var token = $.urlParam('token');
    if (token) {
      $.cookie(AppSettings.CookieName, token);
      window.location = 'http://'+AppSettings.domain+'/'
    }
    token = $.cookie(AppSettings.CookieName);
    if(!token){
      window.location = 'http://'+AppSettings.domain+'/login.html'
    }

    App.ApplicationAdapter = DS.RESTAdapter.extend({
      //  namespace: 'api',
      host: AppSettings.WebserviceURL,
      headers: { 'Authorization': token },
      // defaultSerializer: 'App/appacitiveREST'
    });
  }
});

DragNDrop = Ember.Namespace.create();

DragNDrop.cancel = function(event) {
  console.log('cancel')
  event.preventDefault();
  return false;
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

App.PopupMixin = Ember.Mixin.create({
  actions:{
    close: function() {
      return this.send('closeModal');
    }
  }
});

App.PopupOpenerMixin = Ember.Mixin.create({
  actions:{
    openModal:function(modalName,model){
      return true;
    },
    openModalSource:function(modalName,model){
      if(this.sendAction){
        return this.sendAction('openModal',modalName,model);
      }
      else this.send('openModal',modalName,model);
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
    var context = this;
    attachment = this.store.createRecord('attachment', attachment);
    this.store.find('section',this.get('model').get('id')).then(function(section){
      context.get('model.attachments').then(function(attachments){
        attachment.save().then(function(attachment){
          attachments.pushObject(attachment);
          section.save();
        });
      });
    });
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