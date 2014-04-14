'use strict';
App.LoginController = Ember.ObjectController.extend(App.PopupMixin,{
  actions:{
    LoginFacebook:function(){
      this.send('Login','facebook')
    },
    LoginGoogle:function(){
      this.send('Login','google')
    },
    LoginGithub:function(){
      this.send('Login','github')
    },
    Logintwitter:function(){
      this.send('Login','twitter')
    },
    Login:function(provider){
      window.location='https://'+window.location.host+':4730/auth/'+provider;
    }
  }
});