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
          headers: { 'Authorization': token }
        });
      }
    });


//App.BoardController = new BoardController();

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