App.BaseSectionComponent = Ember.Component.extend({
  section:null,
  isEditing:false,
  submitAttachment:function(data){
    var attachment =  {
      data: data,
      sectionid: this.get('section').get('id'),
      type:this.get('section').get('type')
    }
    var attachment = this.store.createRecord('attachment', attachment);
    attachment.save();
  }
});

