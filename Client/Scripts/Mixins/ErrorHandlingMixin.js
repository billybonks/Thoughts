App.OnErrorMixin = Ember.Mixin.create({
  OnError:function(context,model){
    var context = context;
    var model = model
    function onError(reason){
      context.send('error',reason);
      if(model){
        model.rollback();
      }
    }
    return onError;
  }
});