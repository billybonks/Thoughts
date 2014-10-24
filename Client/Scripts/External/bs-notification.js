!function(){Bootstrap.NotificationsView=Ember.CollectionView.extend({classNames:["notifications"],attributeBindings:["style"],contentBinding:"Bootstrap.NM.content",showTime:2e3,fadeInTime:500,fadeOutTime:3e3,showTimeTimeoutId:null,itemViewClass:Ember.View.extend({classNames:["alert","notification"],template:Ember.Handlebars.compile("{{view.content.message}}"),classNameBindings:["alertType"],isVisible:!1,alertType:function(){return this.get("content").get("classType")}.property("content"),didInsertElement:function(){return this.$().fadeIn(this.get("fadeInTime"))}}),contentChanged:function(){return this.get("content").length>0?this.resetShowTime():void 0}.observes("content.length"),resetShowTime:function(){var a=this;return this.$().css({display:"block"}),this.$().is(":animated")&&this.$().stop().animate({opacity:"100"}),null!=this.showTimeTimeoutId&&clearTimeout(this.showTimeTimeoutId),this.showTimeTimeoutId=setTimeout(function(){return a.fadeOut(a)},this.showTime)},fadeOut:function(a){return a.$().fadeOut(a.fadeOutTime,function(){return a.get("content").clear()})},mouseEnter:function(){return this.$().is(":animated")?this.$().stop().animate({opacity:"100"}):void 0},mouseLeave:function(){return this.resetShowTime()}}),Ember.Handlebars.helper("bs-notifications",Bootstrap.NotificationsView),Bootstrap.NM=Bootstrap.NotificationManager=Ember.Object.create({content:Ember.A(),push:function(a,b){var c;return b=null!=b?b:b="info",c=Bootstrap.Notification.create({message:a,type:b}),this.get("content").pushObject(c)}}),Bootstrap.Notification=Ember.Object.extend({classType:function(){return null!=this.type?"alert-"+this.type:null}.property("type").cacheable()})}.call(this);
