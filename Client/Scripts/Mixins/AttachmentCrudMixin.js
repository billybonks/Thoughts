App.SubmitAttachmentMixin = Ember.Mixin.create({
  submitAttachment: function(data) {
    var attachment = {
      data: data,
      card: this.get('model').get('id'),
      type: this.get('model').get('type')
    };
    if (this.get('targetObject')) {
      this.get('targetObject').StartLoading();
    }
    var context = this;
    attachment = this.store.createRecord('attachment', attachment);
    this.store.find('card', this.get('model').get('id')).then(function(card) {
      attachment.set('card', card);
      attachment.save().then(
        function(attachment) {
          card.set('date_modified', Date.now());
          card.save().then(function() {
            if (context.get('targetObject')) {
              context.get('targetObject').StopLoading();
            }
            var attachments = card.get('attachments').then(function(attachments) {
              attachments.pushObject(attachment);
              Bootstrap.NM.push('Attachment created', 'success');
            });
          });
        },
        function(error) {
          if (context.get('targetObject')) {
            context.get('targetObject').StopLoading();
          }
          attachment.rollback();
          Bootstrap.NM.push('Error creating attachment', 'danger');
        });;
    });
  },
  //FIXME: Somehow card isnt being registered dont understand the magic, added dirty fix
  SaveAttachment: function(model) {
    var context = this;
    if(!this.get('card')){
      this.set('card',model._data.card);
    }
    model.save().then(function(att) {
        context.get('card').set('date_modified', Date.now());
        context.get('card').save().then(function(card) {
          Bootstrap.NM.push('Attachment changes successfully changed', 'success');
        });
      },
      function(error) {
        Bootstrap.NM.push('Error saving attachment changes', 'success');
      })
  }
})
