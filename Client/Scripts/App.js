App = Ember.Application.create({

  ready: function() {
    App.ApplicationAdapter = DS.RESTAdapter.extend({
      //  namespace: 'api',
      host: AppSettings.WebserviceURL,
      headers: {
        'Authorization': AppSettings.token
      },
      // defaultSerializer: 'App/appacitiveREST'
    });
  },
  customEvents: {
    "mouseover": "mouseOver"
  }
});

App.initializer({
  name: "loadToken",
  initialize: function() {
      var token ;
      var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
      if (results) {
        token= results[1]
      } else {
        token= null;
      }
      if (token) {
        $.cookie(AppSettings.CookieName, token);
        window.location = 'http://' + AppSettings.domain + '/'
      }
      token = $.cookie(AppSettings.CookieName);
      if (!token) {
        $.cookie(AppSettings.CookieName, 'Guest');
      }
      AppSettings.token = token
    }
});

App.initializer({
  name: "preload",
  initialize: function() {
    App.deferReadiness();
    window.loader.getViews().then(function(views){
      preload = {views:views};
      App.preload =preload;
      App.advanceReadiness();
    })
  }
});

Ember.Handlebars.helper('currentContext', function(currentView, view,options) {
  if(currentView.get('id') === view.get('id')){
    return options.fn(this);
  }else {
    return options.inverse(this);
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
