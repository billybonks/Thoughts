App.ContextMenuView = Ember.View.extend({
   layoutName : 'contextMenu',
   contextMenu:function(event){
     console.log()
     var payload = {
       type:this.get('target'),
       x:event.clientX,
       y:event.clientY
     }
     Em.instrument("contextMenu.open",payload,function(){},this)
     return false;
   }
 })