'use strict';
window.AppSettings =
  {
    WebserviceURL: 'http://localhost:4730',
    domain:'localhost',
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
          dataType: 'json',
            type: 'GET'
});
}

}