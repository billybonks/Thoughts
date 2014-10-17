'use strict';
App.TitleCardComponent = Ember.Component.extend(App.NewCardMixin, {
  showControlls: false,
  isLoading: false,
  tags: [],
  actions: {
    Delete: function() {
      var context = this;
      this.get('store').find('card', this.get('model').get('id')).then(function(rec) {
        rec.deleteRecord();
        rec.save().then(function() {
            context.transitionTo('cards.index');
            context.sendAction('CreateNotification', 'Card deleted', 'success');
          },
          function() {
            context.sendAction('CreateNotification', 'Error deleting card', 'danger');
          });
      })
    },
    ToggleEdit: function() {
      var context = this;
      this.get('model.tags').then(function(tags) {
        context.set('tags',[])
        tags.forEach(function(tag) {
          context.get('tags').push(tag.get('title'))
        })
        context.get('isEditing') ? context.set('isEditing', false) : context.set('isEditing', true);
      });
    },
    onShare: function() {
      this.get('section') ? this.set('section', false) : this.set('section', true);
    },
    onAddSection: function() {
      this.get('section') ? this.set('section', false) : this.set('section', true);
    },
    //FIXME:calling custom routes to remove/add tags
    Save: function() {
      var context = this;
      $(document).attr('title', this.get('model.title'));
      this.get('store').find('Card', this.get('model.id')).then(function(card) {
        card.get('tags').then(function(tags){
          card.save().then(function() {
          /*  var usedIndexs = [];
            var found =[];
            var updatedTags = context.get('updatedTags');
            var remaining = context.get('tagger').getCurrentVal();
            if(remaining){
              updatedTags.push(remaining);
            }
            tags.filter(function(tag,index){
              for(var i =0;i<updatedTags.length;i++){
                if(updatedTags[i] === tag.get('title')){
                  found.push(index);
                  usedIndexs.push(i);
                }
              }
            })
            var removedTags = [];
            var newtags = [];
            var f = 0;
            for(var i = 0; i< found.length;i++){
              if(found[i]-i > 0){
                for(f;f < found;f++){
                  removedTags.push(tags.objectAt(f).get('title'))
                }
              }
              f=found[i]+1;
            }
            for(f;f < tags.get('length');f++){
              removedTags.push(tags.objectAt(f).get('title'))
            }*/
            context.get('isEditing') ? context.set('isEditing', false) : context.set('isEditing', true);
          });
        })
      });
    },
    SaveAsTemplate: function() {
      var template = {
        basedOff: this.get('model').get('id'),
      }
      template = this.store.createRecord('template', template);
      var context = this;
      var promise = template.save();
      promise.then(function(template) {
        context.sendAction('CreateNotification', 'Template saved', 'success')
      }, function(error) {
        context.sendAction('CreateNotification', 'Template couldnt be saved', 'danger')
      });
    },
    EditCardSetting: function() {
      var configuration = this.GetConfiguration();
      var content = {
        embedded: configuration.get('embedded'),
        isOnMain: this.get('model.onMainDisplay')
      }
      if (typeof content.isOnMain === 'undefined') {
        content.isOnMain = false;
      }
      var header = this.get('model.title') + ' Properties'
      this.set('modal', Ember.Widgets.ModalComponent.popup({
        targetObject: this,
        confirm: "SaveConfiguration",
        content: content,
        contentViewClass: Ember.View.extend({
          templateName: 'popups/cardSettings',
        }),
        headerText: header
      }));
    },
    SaveConfiguration: function() {
      var content = this.get('modal.content');
      var context = this;
      var model = this.get('model')
      var configuration = this.GetConfiguration();
      model.set('onMainDisplay', content.isOnMain);
      configuration.set('embedded', content.embedded);
      console.log(configuration.get('configures'))
      configuration.get('configures').then(function(configures) {
        configuration.set('configures', configures);
        model.save();
        configuration.save();
      })
    }
  },
  GetConfiguration: function() {
    var parentId = parseInt(this.get('parent.id'));
    var configs = this.get('model.configurations');
    return configs.find(function(item, index, enumerable) {
      var f = item.get('for')
      if (f === parentId) {
        return true;
      }
    }, configs)
  },
  Notify: function(message, level) {
    this.FowardNotification(message, level);
  },
  FowardNotification: function(message, level) {
    this.sendAction('CreateNotification', message, level)
  },
  openPluginModal: function(modalName, model, secondaryModel) {
    return this.sendAction('openModal', modalName, model, secondaryModel);
  },
  cool: function() {
    return text;
  }.property('model'),
  mouseLeave: function(ctx) {
    this.set('showControlls', false);
  },
  mouseEnter: function(ctx) {
    this.set('showControlls', true)
  },
  GetParent: function() {
    if (this.get('model.content')) {
      return this.get('model.content');
    } else {
      return this.get('model');
    }

  },
  configuration: function() {
    var parentId = parseInt(this.get('model.id'));
    var configs = this.get('model.configurations');
    return configs.find(function(item, index, enumerable) {
      var f = item.get('for')
      if (f === parentId) {
        return true;
      }
    }, configs)
  }.property('model.configurations.@each.for'),
  didInsertElement: function() {
    var context = this;
    console.log('did Insert for ' + this.get('model.id'))
  }
});
