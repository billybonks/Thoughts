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
              if (context.get('targetObject')) {
                context.get('targetObject').FowardNotification('Attachment saved', 'success')
              } else {
                context.send('notification', 'Attachment saved', 'success')
              }
            });
          });
        },
        function(error) {
          if (context.get('targetObject')) {
            context.get('targetObject').StopLoading();
          }
          attachment.rollback();
          if (context.get('targetObject')) {
            context.get('targetObject').FowardNotification('Attachment couldnt be saved', 'danger')
          } else {
            context.send('notification', 'Attachment couldnt be saved', 'danger')
          }

        });; //.then(context.sendAction('modelSateChange',attachment.currentState));
    });
  },
  SaveAttachment: function(model) {
    var context = this;
    // context.get('targetObject').StartLoading();
    model.save().then(function(att) {
        model.get('card').then(function(card) {
          card.set('date_modified', Date.now());
          card.save().then(function(card) {
            if (context.get('targetObject')) {
              // context.get('targetObject').StopLoading();
              context.get('targetObject').FowardNotification('Attachment updated', 'success');
            } else if (context.parentController) {
              context.parentController.Notify('Attachment updated', 'success')
            } else {
              context.send('notification', 'Attachment updated', 'success')
            }
          });
        })
      },
      function(error) {
        if (context.get('targetObject')) {
          // context.get('targetObject').StopLoading();
          context.get('targetObject').FowardNotification('Attachment couldnt be saved', 'danger')
          context.get('targetObject').FowardNotification('Attachment updated', 'success');
        } else if (context.parentController) {
          context.parentController.Notify('Attachment couldnt be saved', 'danger');
        } else {
          context.send('notification', 'Attachment couldnt be saved', 'danger')
        }

      })
  }
})
