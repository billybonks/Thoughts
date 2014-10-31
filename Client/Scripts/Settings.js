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
  },
  awsCreds:{accessKeyId:'AKIAJPZTGY334OGQSFGQ',secretAccessKey:'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'}

}
