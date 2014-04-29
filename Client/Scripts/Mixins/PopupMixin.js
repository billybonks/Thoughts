App.PopupMixin = Ember.Mixin.create({
  actions:{
    close: function() {
      return this.send('closeModal');
    }
  }
});