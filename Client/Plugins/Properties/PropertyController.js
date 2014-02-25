'use strict';
App.PropertyController = Ember.ObjectController.extend({
    isNediting:false,
    isVediting:false,
    actions:{
      toggleV:function(){this.get('isVediting')? this.set('isVediting', false): this.set('isVediting', true);},
      toggleN:function(){this.get('isNediting')? this.set('isNediting', false): this.set('isNediting', true);},
    }
});