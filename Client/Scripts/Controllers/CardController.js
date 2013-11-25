App.CardController = Ember.ObjectController.extend({
  links:[{title:'Google',href:'www.google.co.za'},{title:'Facebook',href:'www.google.co.za'},{title:'Coursera',href:'www.google.co.za'},{title:'YouTube',href:'www.google.co.za'}],
  questions:[{question:'Why is the sky blue',answer:'Because of science'},{question:'Why do we need such obscure things',answer:'does it have something to do with why animals need to eat'}],
  documents:[{title:'Plants to grow',href:'',type:'spreadsheet'},{title:'Market Research',href:'',type:'presentation'},{title:'Thesus of love',href:'',type:'document'}],
  tasks:[{title:'Make a compost heap'},{title:'Task'},{title:'Fart'},{title:'Take a shower'}],
  actions:{
  },
  IsRight:function(){
    console.log('right')
    console.log(this.get('section'))
    return true;
  }.property(),
  sortSomeAttachments:function(){
    console.log('sorting')
    var attachments = this.get('model').get('attachments');
    var tags = this.get('model').get('tags');
    var tit = this.get('model').get('title');
    console.log('sorting');
    for(var i = 0;i<attachments.length;i++){
      var a = attachments[i];
      if(a.type=="Link"){
        links.push(a)
      }
    }
    return '';
  }.observes('model.attachments.@each.type'),
  position:function(){
    return 'left:' + this.get('model').get('left') + 'px;top:' + this.get('model').get('top') + 'px';
  }.property('model.left'),




  /* linkCount: function () {
        this.get('model').get('test');
        var links = this.get('model').get('links');
        links.forEach(function (element) {
            console.log('lINK');
        });
        return links.length;
    }.property("model.links"),
    documentCount: function () {
        return this.get('model').get('documents').length;
    }.property("model.documents"),
    commentCount: function () {
        return this.get('model').get('comments').length;
    }.property("model.comments")


      sortAttachments:function(){


      if()
    }
  },
  */
});