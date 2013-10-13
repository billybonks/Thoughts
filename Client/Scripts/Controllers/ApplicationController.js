App.ApplicationController = Ember.Controller.extend({
    currentDrag: null,
    word2:'null',
    actions: {
        LoginPopup: function () {
            $('#LoginOptions').bPopup();
        },
        LoginFacebook: function () {
            AppSettings.OAuthRedirect(AppSettings.FacebookOAuthURL)
        },
        LoginGoogle: function () {
            AppSettings.OAuthRedirect(AppSettings.GoogleOAuthURL)
        },
        LoginGithub: function () {
            AppSettings.OAuthRedirect(AppSettings.GithubOAuthURL)
        },
        LoginTwitter: function () {
            console.log('Twitter');
        },
        ClearToken: function () {
            $.cookie(AppSettings.CookieName, '', { expires: -1 });
        },
        StartDrag:  function(){
            return function (model) {
                this.set('currentDrag', model);
            }
        },
    },
    MouseMove: function (application) {
        var name = "Mozilla";
        var controller = application;
         function mouseMove (event) {
             console.log(controller.get('currentDrag'));
             console.log(application.get('currentDrag'));
         }
         return mouseMove;
    }
});