App = Ember.Application.create({

  ready: function() {
    var token = this.getTokenFromUrl('token');
    if (token) {
      $.cookie(AppSettings.CookieName, token);
      window.location = 'http://' + AppSettings.domain + '/'
    }
    token = 'cfcd208495d565ef66e7dff9f98764da'//$.cookie(AppSettings.CookieName);
    if (!token) {
      $.cookie(AppSettings.CookieName, 'Guest');
    }
    App.ApplicationAdapter = DS.RESTAdapter.extend({
      //  namespace: 'api',
      host: AppSettings.WebserviceURL,
      headers: {
        'Authorization': token
      },
      // defaultSerializer: 'App/appacitiveREST'
    });
  },
  getTokenFromUrl: function(name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results) {
      return results[1]
    } else {
      return null;
    }
  },
  customEvents: {
    "mouseover": "mouseOver"
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
