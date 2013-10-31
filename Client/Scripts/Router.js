﻿App.Router.map(function () {
    this.resource('settings', { path: '/settings' }, function () {
        this.route('profile');
    });
    this.resource('card', { path: '/card/:card_id' });
    this.resource('cards', { path: '/cards' }, function () {
        this.route('index');
    });
    this.resource('emails', { path: '/emils' }, function () {
        this.route('index');
    });
});

App.ApplicationRoute = Ember.Route.extend({
    model: function () {
        var sessionToken = $.cookie(AppSettings.CookieName);
        if (sessionToken) {
            App.ApplicationAdapter = DS.RESTAdapter.extend({
              //  namespace: 'api',
                host: AppSettings.WebserviceURL,
                headers: { 'Authorization': sessionToken }
            });
            m = this.store.find('application', sessionToken)
            return m;
        }
    },
    setupController: function (controller, application) {
        if (application) {
            if (application.id) {
                controller.set('model', application);
            } else {
                $.cookie(AppSettings.CookieName, '', { expires: -1 });
                window.location = window.location;
            }
        }
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