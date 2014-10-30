window.loader = {
  getViews:function(){
    var context = this;
    return new Promise(function(resolve, reject) {
      $.ajax({
        type: "GET",
        url: window.AppSettings.WebserviceURL + '/views',
        headers: {
          Authorization: window.AppSettings.token
        },
        success: function(data, status, jqXHR) {
          resolve(data.views);
        },
        error: function(jqXHR, satus, error) {
          reject(error);
        }
      });
    });
  },
  getTemplates:function(){
    var context = this;
    return new Promise(function(resolve, reject) {
      $.ajax({
        type: "GET",
        url: window.AppSettings.WebserviceURL + '/views', 
        headers: {
          Authorization: window.AppSettings.token
        },
        success: function(data, status, jqXHR) {
          resolve(data.views);
        },
        error: function(jqXHR, satus, error) {
          reject(error);
        }
      });
    });
  }
}
