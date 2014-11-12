'use strict';
App.Router.map(function() {
  this.resource('settings', {
    path: '/settings'
  }, function() {
    this.route('profile');
  });
  this.resource('card', {
    path: '/card/:card_id'
  });
  this.resource('perspective', {
    path: '/perspective/:perspective_id'
  });
  this.resource('emails', {
    path: '/emails'
  }, function() {
    this.route('index');
  });
  this.resource('links', {
    path: '/links'
  }, function() {
    this.route('index');
  });
  this.resource('views', {
    path: '/views'
  });
  this.resource('template', {
    path: '/template/:template_id'
  });
  this.resource('templates', {
    path: '/templates'
  }, function() {
    this.route('index');
  });
});

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    this.store.pushMany('view',window.preload.views);
    var sessionToken = $.cookie(AppSettings.CookieName);
    var m = this.store.find('application', sessionToken)
    return m;
  },
  setupController: function(controller, model) {
    controller.SubscribeToContextMenuEvents();
    controller.set('model', model);
  }
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    var id = $.cookie(AppSettings.CookieName);
    var model = this.store.getById('application', id);
    return model;
  }
});

App.ViewsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('car');
  },
  setupController: function(controller, model) {
    var view = model.findBy('default', true)
    controller.set('content', model);
    controller.set('currentView', view);
    controller.set('loaded', true);
  }
});

App.TemplatesRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('template');
  }
});

App.TemplatesIndexRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('templates');
  }
});

App.EmailsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('email');
  }
});

App.EmailsIndexRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('email');
  }
});

App.SettingsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('setting', 0);
  },
  setupController: function(controller, model) {
    console.log(model)
  }
});

App.SettingsIndexRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('settings');
  }
});

App.CardRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    var views = this.store.all('view');
    var view =views.filter(function(item, index, enumerable){
      if(item.get('id') === model.get('id')){
        return true
      }
      return false;
    })
    if(view[0]){
      view = view[0]
    }else{
      view =this.store.createRecord('view',{
        id:model.get('id'),
        name:model.get('title'),
        deleted:false,
        templates:false,
        lastPage:0,
        root:model,
        loaded:true
      })
      view.get('cards').then(function(cards){
        model.get('children').then(function(children){
          cards.pushObjects(children);
        })
      })
    }
    controller.set('perspective',view);
    controller.set('views',views);

    //$(document).attr('title', model.get('title'));
  }
});

App.PerspectiveRoute = Ember.Route.extend({
  model:function(params){
    return this.store.getById('view',params.perspective_id)
  },
  setupController: function(controller, model) {
    var application = this.controllerFor("application");
    application.set('route', Ember.A([{name:model.get('name'),type:'perspective',id:model.get('id'),}]))
    var views = this.store.all('view');
    controller.set('views',views);
    controller.set('perspective',model);

    //$(document).attr('title', model.get('title'));
  }
});
//
Ember.Route.reopen({
  activate: function(router) {
    this._super(router)
    var controller = this.controllerFor();
    var title = '';
    var routeName = this.get('routeName')
    if (routeName === 'application') {
      title = 'Home'
    }
    if (routeName === 'settings') {
      title = 'Settings'
    }
    if (routeName === 'cards') {
      title = 'Cards'
    }
    if (title !== '') {
      $(document).attr('title', title)
    }
    //# Set page title
    //   name = this.parentState.get('name')
  }
})
