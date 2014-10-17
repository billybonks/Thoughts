'use strict';
App.ApplicationController = Ember.Controller.extend(App.PopupOpenerMixin, {
  currentDrag: null,
  menuOpen: false,
  notifications: Ember.A([]),
  actions: {
    Logout: function() {
      $.cookie(AppSettings.CookieName, '', {
        expires: -1
      });
      window.location = 'http://' + AppSettings.domain;
    },
    defaultPerspective: function() {
      var views =this.store.all('view');
      var view = views.findBy('default', true)
      this.transitionTo('perspective',view)
    },
    LoginFacebook: function() {
      this.send('Login', 'facebook')
    },
    LoginGoogle: function() {
      this.send('Login', 'google')
    },
    LoginGithub: function() {
      this.send('Login', 'github')
    },
    Logintwitter: function() {
      this.send('Login', 'twitter')
    },
    Login: function(provider) {
      window.location = 'https://' + window.location.host + ':4730/auth/' + provider;
    }

  },
  MouseMove: function(application) {
    var controller = application;

    function mouseMove(event) {
      console.log(controller.get('currentDrag'));
      console.log(application.get('currentDrag'));
    }
    return mouseMove;
  },
  SubscribeToContextMenuEvents: function() {
    Em.subscribe('contextMenu.open', this.get('MouseMove')(this.get('model')));
  },
  ToggleContextMenu: function(model) {
    return {
      before: function(name, timestamp, event) {},
      after: function(name, timestamp, event, beforeRet) {}
    };
  },
  SetContextType: function(model) {
    return {
      before: function(name, timestamp, event) {},
      after: function(name, timestamp, event, beforeRet) {}
    };
  }
});
