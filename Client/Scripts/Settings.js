'use strict';
window.AppSettings = {
  WebserviceURL: 'https://localhost:4730',
  domain: window.location.host,
  CookieName: 'App',
  OAuthRedirect: function(url) {
    $.ajax({
      settings: {
        async: false
      },
      url: url,
      context: this,
      success: function(data, textStatus, jqXHR) {
        window.location = data;
      },
      dataType: 'json',
      type: 'GET'
    });
  }

}
