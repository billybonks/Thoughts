App.SectionMainComponent = Ember.Component.extend({
  word:'lol',
  IsLink:Ember.computed.equal('section.type', 'Links'),
  IsTask:Ember.computed.equal('section.type', 'Tasks'),
  IsDocument:Ember.computed.equal('section.type', 'Documents'),
  IsQuestion:Ember.computed.equal('section.type', 'Questions'),
  IsRight:function(){
    var t = this.get('section').get('position') % 2;
    console.log(t);
    if(this.get('section').get('position') % 2 === 0){

    }
  }.property('section.position'),
  actions:{
    edit:function(){
      console.log('editing')
    }
  }
});