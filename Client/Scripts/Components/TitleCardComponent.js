'use strict';
App.TitleCardComponent = Ember.Component.extend(App.NewCardMixin, {
  showControlls: false,
  isLoading: false,
  classNames:['title-card'],
  tags: [],
  actions: {
    toggleTagView:function(tag){
      console.log(tag)
    },
    Delete: function() {
      var context = this;
      this.get('store').find('card', this.get('model').get('id')).then(function(rec) {
        rec.deleteRecord();
        rec.save().then(function() {
            context.sendAction('cardDeleted',rec);
            Bootstrap.NM.push('Card successfully deleted', 'success');
          },
          function() {
            Bootstrap.NM.push('Error deleting card', 'danger');
          });
      })
    },
    restore:function(){
      var context = this;
      this.get('model').set('restore',true);
      this.get('store').find('card', this.get('model').get('id')).then(function(rec) {
          rec.save().then(function() {
            context.set('model.restore',false);
            context.set('model.isTrashed',false);
            context.sendAction('cardDeleted',rec);
            Bootstrap.NM.push('Card successfully restored', 'success');
          },
          function() {
            Bootstrap.NM.push('Error restoring card', 'danger');
          });
      });
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
            context.get('isEditing') ? context.set('isEditing', false) : context.set('isEditing', true);
            var origTags = tags.getEach('id');
            context.store.find('tag',{names:context.get('updatedTags')}).then(function(result){
                 var updatedTags=result.getEach('id');
                 var intersection = _.intersection(origTags,updatedTags);
                 var add = _.difference(updatedTags,origTags);
                 var remove = _.difference(origTags,intersection);
                 if(add.length>0){
                  $.ajax({
                    url: window.AppSettings.WebserviceURL+'/addTags',
                    type: 'PUT',
                    success: function(){
                      var toAdd = Em.A([]);
                      _.each(add,function(id){
                        toAdd.pushObject(context.get('store').getById('tag',id));
                      })
                      tags.pushObjects(toAdd);
                    },
                    data: {tags:add,entity:context.get('model.id')},
                    dataType: 'JSON'
                  });
                 }
                if(remove.length > 0){
                  $.ajax({
                    url: window.AppSettings.WebserviceURL+'/removeTags',
                    type: 'PUT',
                    success: function(){
                      var toRemove = Em.A([]);
                      _.each(remove,function(id){
                        toRemove.pushObject(context.get('store').getById('tag',id));
                      })
                      tags.removeObjects(toRemove);
                    },
                    data: {tags:remove,entity:context.get('model.id')},
                    dataType:'JSON'
                  });
                }
              },function(error){
                Bootstrap.NM.push('Error saving tags', 'danger');
              });

          },
          function(error){
            Bootstrap.NM.push('Error saving changes', 'danger');
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
  embedded:function(){
      if(this.get('isRoot')){
        return false;
      }else{
        return true;
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
    var context = this;
  return new Promise(function(resolve, reject) {
    if (context.get('model.content')) {
      resolve(context.get('model.content'))
    } else {
      resolve(context.get('model'))
    }
  });
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
    this.get('parentView').onCards();
  }
});
