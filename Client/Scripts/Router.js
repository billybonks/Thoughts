'use strict';
App.Router.map(function () {
  this.resource('settings', { path: '/settings' }, function () {
    this.route('profile');
  });
  this.resource('card', { path: '/card/:card_id' });
  this.resource('cards', { path: '/cards' }, function () {
    this.route('index');
  });
  this.resource('emails', { path: '/emails' }, function () {
    this.route('index');
  });
  this.resource('links', { path: '/links' }, function () {
    this.route('index');
  });
  this.resource('template', { path: '/template/:template_id' });
  this.resource('templates', { path: '/templates' }, function () {
    this.route('index');
  });
});

App.ApplicationRoute = Ember.Route.extend({
  actions: {
    openModal: function(modalName, model,secondaryModel) {
      var controller = this.controllerFor(modalName)
      controller.set('model', model);
      if(secondaryModel){
        controller.set('secondaryModel', secondaryModel);
      }
      return this.render(modalName, {
        into: 'application',
        outlet: 'modal'
      });
    },

    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    },
    error:function(reason){
      this.get('controller').get('errors').pushObject('something bad happend')
      console.log('ERRRRRRORRRRR');
    }
  },
  model: function () {
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
  model: function () {
    return this.modelFor('cards');
  }
});

App.CardsRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('card');
  },

});

App.CardsIndexRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('cards');
  },
  setupController: function(controller, model) {

    var ret =this.store.all('template').map(function(item, index, enumerable){
      return {id:item.get('id'),title:item.get('title')}
    });
    ret.push({title:'None',id:-1})
    ret.sort(function compare(a, b) {
      if (a.id<b.id){
        return -1;
      }
      if (a.id>b.id){
        return 1;
      }
      // a must be equal to b
      return 0;
    })
    controller.set('content',model);
    controller.set('templateArr',ret);
  }
});

App.TemplatesRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('template');
  }
});

App.TemplatesIndexRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('templates');
  }
});

App.EmailsRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('email');
  }
});

App.EmailsIndexRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('email');
  }
});

App.SettingsRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('setting',0);
  },
  setupController: function(controller, model) {
    console.log(model)
  }
});

App.SettingsIndexRoute = Ember.Route.extend({
  model: function () {
    console.log('QQQQQQQ')
    return this.modelFor('settings');
  }
});

App.CardRoute = Ember.Route.extend({
  actions: {
    openModal: function(modalName, model) {
      return true
    },

    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    },
  },
  setupController: function(controller, model) {
    var ret =this.store.all('template').map(function(item, index, enumerable){
      return {id:item.get('id'),title:item.get('title')}
    });
    ret.push({title:'None',id:-1})
    ret.sort(function compare(a, b) {
      if (a.id<b.id){
        return -1;
      }
      if (a.id>b.id){
        return 1;
      }
      // a must be equal to b
      return 0;
    })
    controller.set('content',model);
    controller.set('templateArr',ret);
  }
});

