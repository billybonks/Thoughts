App.ContextMenuView = Ember.View.extend({
   layoutName : 'contextMenu',
   contextMenu:function(event){
     console.log(event);
     return false;
   }
 })