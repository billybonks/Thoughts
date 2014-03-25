'use strict';
App.LoginController = Ember.ObjectController.extend(App.PopupMixin,{
  actions:{
    LoginFacebook:function(){
      this.send('Login','facebook')
    },
    LoginGoogle:function(){
    },
    LoginGithub:function(){
      this.send('Login','github')
    },
    Logintwitter:function(){
    },
    Login:function(provider){
      window.location='http://'+window.location.host+':4730/auth/'+provider;
    }
  }
});