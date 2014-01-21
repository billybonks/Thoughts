App.BaseSectionComponent = Ember.Component.extend({
  section:null,
  submitAttachment:function(data){
    var attachment =  {
      data: data,
      sectionid: this.get('section').get('id')
    }
    var attachment = this.store.createRecord('attachment', attachment);
    attachment.save();
  }
});

