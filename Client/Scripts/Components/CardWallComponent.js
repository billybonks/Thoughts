App.CardWallComponent = Ember.Component.extend(App.PopupMixin,App.NewCardMixin,{
  isRoot:false,
  actions: {
    loadMore: function() {
      this.loadMoreCards();
    },
    advancedSearch: function(){
      var content ={
        objects:['attachment','tag','title'],
        actions:['isEqual','contains'],
        queries:[]
      }
      var model = this.OpenModal( this.get('onAdvanced'),null,content,App.AdvancedSearch,'Advanced Search');
      this.set('advancedSearch',model)
    }
  },
  modelChanged:function(){
    if(!this.get('model.loaded')){
        this.loadMoreCards();
    }
  }.observes('model.id'),
  embedded:function(){
    return false;
  },
  breadcrumbs:function(key, value){
    if (arguments.length > 1) {
      // > 1 args = this is a `set`
      return value;
    } else {
      // otherwise this is a `get`
      var context = this;
      value = null;
      var parents = [];
      if(!this.get('currentPath')){
        this.set('currentPath',Ember.A([]))
      }
      if(this.get('model.root') && this.get('currentPath.length')<=1){
          this.get('model.root').then(function(root){
            context.buildCrumb(root)
          })

      }else{
        return this.get('currentPath');
      }
      return this.get('currentPath');
    }
  }.property('model'),
  buildCrumb:function(card){
    this.get('currentPath').push({name:card.get('title'),type:'card',id:card.get('id')})
  },
  onAdvanced:function(content){
    //FIXME: Can be improved
    var query =this.get('advancedSearch')._childViews[1].getQuery();
    view = {name:'search',
            templates:content.templates,
            deleted:content.trashed,
            query:query}
    if(content.fview){
      view.root = this.get('model.root')
    }
    var b64 = btoa(JSON.stringify(view))
    this.executeSearch(b64)
  },
  executeSearch:function(query){
    $.ajax({
      type: "GET",
      url: window.AppSettings.WebserviceURL + '/search?query='+query,
      headers: {
        Authorization: window.AppSettings.token
      },
      success: function(data, status, jqXHR) {
      //  resolve(data.views);
      },
      error: function(jqXHR, satus, error) {
      //  reject(error);
      }
    });
  },
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
          context.set('model.lastPage',context.get('model.lastPage') + 1)
          var response = context.store.pushMany('card', this.response.cards);
          //
          if (response.length < 10) {
            context.set('model.loaded', true)
          }
          context.get('model.cards').then(function(cards){
            Promise.all(cards.getEach('children')).then(function(cardsChildren){
              Promise.all(response.getEach('children')).then(function(newCardsChildren){
                var cardsIds = cards.getEach('id');
                var newCardsIds = response.getEach('id');
                var duplicates =  _.intersection(cardsIds,newCardsIds);
                //remove Duplicates

                //find children in new card set
                context.findAllEmbeddedChildren(newCardsIds,newCardsChildren).then(function(embeddedChildren){
                  context.removeChildren(response,embeddedChildren);
                   context.findAllEmbeddedChildren(cardsIds,newCardsChildren).then(function(embeddedChildren){
                     context.removeChildren(response,embeddedChildren);
                     context.get('model.cards').pushObjects(response);
                   });
                });
              });
            });
          });
        }
      }
    }
  },
  findAllEmbeddedChildren:function(cardIds,children){
    var context = this;
    return new Promise(function(resolve,reject){
      ret = Ember.A();
      var promises = [];
      for(var i = 0;i<children.length;i++){
        var ids = children[i].getEach('id');
        var found =  _.intersection(ids,cardIds);
        for(f = 0; f<found.length;f++){
          child = children[i].findBy('id',found[f]);
          promises.push(context.isEmbedded(child));
        }
      }
      Promise.all(promises).then(function(embeddedChildren){
        resolve(embeddedChildren);
      })
    });
  },
  isEmbedded:function(child){
    return new Promise(function(resolve,reject){
      child.get('configurations').then(function(childConfigs){
        if(childConfigs.objectAt(0).get('embedded')){
          resolve(child);
        }else{
          resolve();
        }

      });
    });
  },
  removeChildren:function(response,children){
    for(var i = 0;i<children.length;i++){
      if(children[i]){
        response.removeObject(children[i])
      }
    }
  },
  onCardAdded:function(card){
    var context = this;
    this.get('model.cards').then(function(cards){
      var root = context.get('model.root');
      if(root){
        if(cards.get('length')>2){
          cards.insertAt(1,card)
        }else{
          cards.pushObject(card)
        }
      }else{
        if(cards.get('length')>1){
          cards.insertAt(0,card)
        }else{
          cards.pushObject(card)
        }
      }
    })
  },
  onCardDeleted:function(card){
    var context = this;
    this.get('model.cards').then(function(cards){
      var root = context.get('model.root');
      if(root){
        root.then(function(root){
          if(root.id === card.id){
            var views =context.store.all('view');
            var view = views.findBy('default', true)
            view.get('cards').then(function(viewCards){
              viewCards.removeObject(card);
              context.sendAction('transition',view)
            })
          }else{
            cards.removeObject(card)
          }
        })
      }else{
        cards.removeObject(card)
      }
    })
  },
  viewClass:function(){
    return 'row sidebarObject sidebarButton';
  }.property('views'),
  onCards:function(){
  /*  var $container = $('#mason');
    var $Qarrd = $('.title-card');
    // initialize
    $container.masonry({
      columnWidth: 100,
      itemSelector: '.title-card'
    });*/
  },
  GetParent:function(){
    var context = this;
    return new Promise(function(resolve, reject) {
      var parent = context.get('model.root');
      if(parent){
        parent.then(function(root){
          resolve(root);
        })
      }else{
        resolve(null)
      }
    });
    return
  },
  willInsertElement:function(){
    if(!this.get('model.loaded')){
        this.loadMoreCards();
    }
  },
  didInsertElement:function(){
    console.log('Q')
  }
});
