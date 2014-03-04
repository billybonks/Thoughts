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
  openPopup:false,
  SubscribePopup:function(context,content){
    Ember.subscribe(this.toString(), {
      after: function(name, timestamp, payload) {
        context.get('openPopup')? context.set('openPopup', false): context.set('openPopup', true);
        if(content){
          context.get(content)? context.set(content, false): context.set(content, true);
        }
      }
    });
  },
  TogglePopup:function(content){
    this.get('openPopup')? this.set('openPopup', false): this.set('openPopup', true);
    if(content){
      this.get(content)? this.set(content, false): this.set(content, true);
    }
  }
});
                                    /*
App.ApplicationSerializer = DS.RESTSerializer.extend({
  serializeHasMany: function(record, json, relationship) {
    var key = relationship.key;

    // don't care which kind of hasMany relationship this is
    json[key] = get(record, key).mapBy('id');
  }
});*/