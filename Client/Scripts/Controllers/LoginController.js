'use strict';
App.LoginController = Ember.ObjectController.extend(App.PopupMixin,{
  actions:{
    LoginFacebook:function(){
      this.send('Login','facebook')
    },
    LoginGoogle:function(){
    },
    LoginGithub:function(){
    },
    Logintwitter:function(){
    },
    Login:function(provider){
      window.location='http://'+window.location.host+':4730/auth/'+provider;
    }
  }
});