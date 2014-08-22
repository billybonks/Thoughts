App.TitledNoteComponent = Ember.Component.extend(App.SubmitAttachmentMixin,DragNDrop.DragAndDroppable,{
  actions: {
    UpdateTitledNote: function() {
      this.SaveAttachment(this.get('item'));
      this.get('isEditingAnswer') ? this.set('isEditingAnswer', false) : this.set('isEditingAnswer', true);
    },
    ToggleNote: function() {
      this.get('displayAnswer') ? this.set('displayAnswer', false) : this.set('displayAnswer', true);
    },
    ToggleEditNote: function() {
      this.get('isEditingAnswer') ? this.set('isEditingAnswer', false) : this.set('isEditingAnswer', true);
    }
  },
  text: function() {
    var converter = new Markdown.Converter();
    if (this.get('item.data.answer')) {
      return converter.makeHtml(this.get('item.data.answer'));
    }
    return ''; //model.data.answer
  }.property('item.data.answer'),
  dragStart: function(event) {
    console.log('dragStart');
    var model = this.get('model')
    var dataTransfer = event.originalEvent.dataTransfer;
    dataTransfer.setData('Type', 'Attachment');
    dataTransfer.setData('AttachmentType', 'TitledNote');
    dataTransfer.setData('id', model.get('id'));
  }
})
