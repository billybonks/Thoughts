App.CardSectionComponent = App.BaseSectionComponent.extend({
  willInsertElement:function(){
    var context = this;
    this.get('model.attachments').then(function(att){
     var card =  context.store.find('card',att.objectAt(0).get('data.cardid')).then(function(result){
      context.set('card',result)
    });
    })

  },
});