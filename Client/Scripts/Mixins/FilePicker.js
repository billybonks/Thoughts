Ember.FilePicker = Ember.View.extend({
init: function() {
    this._super();
    this.on("change", this, this._whatTheBug);
  },
  _whatTheBug:function(param){
    console.log('bug');
    console.log(param);
  }
})