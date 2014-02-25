'use strict';
App.BaseSectionComponent = Ember.Component.extend({
  section:null,
  isEditing:false,
  submitAttachment:function(data){
    var attachment =  {
      data: data,
      sectionid: this.get('section').get('id'),
      type:this.get('section').get('type')
    };
    var context = this;
    attachment = this.store.createRecord('attachment', attachment);
    this.store.find('section',this.get('section').get('id')).then(function(section){
      context.get('section.attachments').then(function(attachments){
        attachment.save().then(function(attachment){
          attachments.pushObject(attachment);
          section.save();
        });
      });
    });
  }
});
