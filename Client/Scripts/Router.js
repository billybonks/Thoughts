App.Router.map(function () {
    this.resource('settings', { path: '/settings' }, function () {
        this.route('profile');
    });
    this.resource('idea', { path: '/idea/:idea_id' });
    this.resource('ideas', { path: '/ideas' }, function () {
        this.route('index');
    });
    this.resource('emails', { path: '/emils' }, function () {
        this.route('index');
    });
});

App.ApplicationRoute = Ember.Route.extend({
    model: function () {
        App.ApplicationAdapter = DS.FixtureAdapter.extend();
        /*var sessionToken = $.cookie(AppSettings.CookieName);
        if (sessionToken) {
             /*DS.RESTAdapter.extend({
                namespace: 'api',
                host: AppSettings.WebserviceURL,
                headers: { 'AccessToken': sessionToken }
            });*/
        m = this.store.find('application', 'ED1FE4C627DAC6514F953909E1F24DBF')//sessionToken)
            return m;
        //}
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

App.IdeasRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('idea');;
    }
});

App.IdeasIndexRoute = Ember.Route.extend({
    model: function () {
        return this.modelFor('ideas');;
    }
});

App.EmailsRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('email');;
    }
});

App.EmailsIndexRoute = Ember.Route.extend({
    model: function () {
        return this.modelFor('email');;
    }
});