'use strict';
App.ApplicationController = Ember.Controller.extend(App.PopupOpenerMixin, {
  currentDrag: null,
  menuOpen: false,
  notifications: Ember.A([]),
  actions: {
    ClearToken: function() {
      $.cookie(AppSettings.CookieName, '', {
        expires: -1
      });
      window.location = 'http://' + AppSettings.domain;
    },
    StartDrag: function() {
      return function(model) {
        this.set('currentDrag', model);
      };
    },
    OpenLoginModal: function() {
      Ember.Widgets.ModalComponent.popup({
        targetObject: this,
        confirm: "LoginConf",
        // cancel: "BaseModalCancel",
        // content: content,
        contentViewClass: App.LoginModalView,
        headerText: 'Login'
      });
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
