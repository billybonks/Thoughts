App.Masonry = Ember.View.extend({
  layoutName: 'masonry',
  resize: function() {
    //console.log('activating masonry');

  }.observes('controller.reload'),
  didInsertElement: function() {
    //  this.get('controller').set('mason',this);
  /*  var $container = $('#mason');
    // initialize
    $container.masonry({
      itemSelector: '.qq'
    });*/
  }

});
