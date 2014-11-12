App.PerspectiveController = Ember.ArrayController.extend({
  needs:['application'],
  application: Em.computed.alias('controllers.application'),
  onCardsLoaded:function(){
    var cards = this.get('perspective.cards').getEach('id');
    var parents = this.get('perspective.cards').getEach('parent');
    console.log('cards')
  }.observes('perspective.cards.length'),
});
