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

Ember.Handlebars.registerHelper("debug", function (optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
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
/*
App.ApplicationSerializer = DS.RESTSerializer.extend({
  serializeHasMany: function(record, json, relationship) {
    var key = relationship.key;

    // don't care which kind of hasMany relationship this is
    json[key] = get(record, key).mapBy('id');
  }
});*/