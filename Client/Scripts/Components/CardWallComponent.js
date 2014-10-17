App.CardWallComponent = Ember.Component.extend(App.NewCardMixin,{
  views:null,
  actions: {
    loadMore: function() {
      this.loadMoreCards();
    },
  },
  modelChanged:function(){
    if(!this.get('model.loaded')){
        this.loadMoreCards();
    }
  }.observes('model.id'),
  loadMoreCards:function(){
    var context = this;
    var xhr = new XMLHttpRequest();

    xhr.open('GET', window.AppSettings.WebserviceURL + '/views/more?id=' + this.get('model.id') + '&page=' + (this.get('model.lastPage') + 1));
    xhr.onreadystatechange = handler;
    xhr.responseType = 'json';
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', window.AppSettings.token);
    xhr.send();

    function handler() {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          var response = context.store.pushMany('card', this.response.cards);
          context.get('model.cards').pushObjects(response);
          if (response.length < 10) {
            context.set('model.loaded', true)
          }
        }
      }
    }
  },
  viewClass:function(){
    return 'row sidebarObject sidebarButton';
  }.property('views'),
  Notify: function(message, level) {
    this.send('notification', message, level);
  },
});
