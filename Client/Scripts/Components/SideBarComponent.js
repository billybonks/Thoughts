App.SideBarComponent = Ember.Component.extend({
  Active:false,
  CurrentForm:'',
  Card:false,
  Link:false,
  actions:{
    NewCard: function(){
      this.get('Active') ? this.set('Active',false) : this.set('Active',true)
      this.set('Card',true);
      this.set('Link',false);
    },
    NewLink: function(){
      this.get('Active') ? this.set('Active',false) : this.set('Active',true)
      this.set('Card',false);
      this.set('Link',true);
    }
  },
  DisplayForm:function(){
    if(this.get('Active')){
      return "display:block;";
    }else{
      return "display:none;" ;
    }
  }.property('Active')
});