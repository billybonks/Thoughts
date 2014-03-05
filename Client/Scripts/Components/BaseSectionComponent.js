'use strict';
App.BaseSectionComponent = Ember.Component.extend(App.PopupOpenerMixin,App.SubmitAttachmentMixin,{
  section:null,
  isEditing:false,
});
