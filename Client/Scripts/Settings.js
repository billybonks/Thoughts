window.AppSettings =
  {
    WebserviceURL: 'http://localhost:4730',
    BaseOAuthURL: 'http://localhost:23224/api/AuthorizationUrl?',
    FacebookOAuthURL: 'http://localhost:23224/api/AuthorizationUrl?OAuthProvider=facebook',
    GithubOAuthURL: 'http://localhost:23224/api/AuthorizationUrl?OAuthProvider=github',
    TwitterOAuthURL: 'http://localhost:23224/api/AuthorizationUrl?OAuthProvider=twitter',
    GoogleOAuthURL: 'http://localhost:23224/api/AuthorizationUrl?OAuthProvider=google',
    domain:'localhost'
    CookieName: 'App',
    OAuthRedirect: function (url) {
    $.ajax({
    settings: {
    async: false
  },
    url: url,
      context: this,
        success: function (data, textStatus, jqXHR) {
          window.location = data;
        },
          dataType: "json",
            type: "GET"
});
}

}