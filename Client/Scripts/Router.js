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
});

App.ApplicationRoute = Ember.Route.extend({
    model: function () {
        var sessionToken = $.cookie(AppSettings.CookieName);
        m = this.store.find('application', sessionToken)
        return m;
    },
  setupController: function(controller, model) {
    controller.SubscribeToContextMenuEvents();
    controller.set('model', model);
  }
});

App.CardsRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('card');
    }
});

App.CardsIndexRoute = Ember.Route.extend({
    model: function () {
        return this.modelFor('cards');
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

App.LinksRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('link');
    }
});

App.LinksIndexRoute = Ember.Route.extend({
    model: function () {
        return this.modelFor('links');
    }
});