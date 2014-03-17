'use strict';
App.ApplicationController = Ember.Controller.extend(App.PopupOpenerMixin,{
    currentDrag: null,
    menuOpen:false,
    actions: {
        ClearToken: function () {
            $.cookie(AppSettings.CookieName, '', { expires: -1 });
        },
        StartDrag:  function(){
            return function (model) {
                this.set('currentDrag', model);
            };
        },
    },
    MouseMove: function (application) {
        var controller = application;
         function mouseMove (event) {
             console.log(controller.get('currentDrag'));
             console.log(application.get('currentDrag'));
         }
         return mouseMove;
    },
   SubscribeToContextMenuEvents:function(){
      Em.subscribe('contextMenu.open',this.get('MouseMove')(this.get('model')));
   },
   ToggleContextMenu: function (model) {
      return {
        before: function(name, timestamp, event) {
        },
        after: function(name, timestamp, event, beforeRet) {
        }
      };
   },
   SetContextType: function (model) {
      return {
        before: function(name, timestamp, event) {
        },
        after: function(name, timestamp, event, beforeRet) {
        }
      };
   }
});