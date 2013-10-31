App = Ember.Application.create({

    ready: function () {
        var token = $.urlParam('token');
        if (token) {
            $.cookie(AppSettings.CookieName, token);
            window.location = 'http://localhost/'
        }
        token = $.cookie(AppSettings.CookieName);
      if(!token){
        window.location = 'http://localhost/login.html'
      }
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