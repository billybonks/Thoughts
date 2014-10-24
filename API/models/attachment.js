'use strict';
var DS = require('./../lib/ds');

module.exports = DS.Model.extend({
  data:DS.attr(),
  card:DS.belongsTo('card',{async:true}),
  tags:DS.hasMany('tag',{async:true}),
  type:DS.attr('string'),
  //FIXME:Need to use super
  getVectorData:function(){
    var data = this._clone(this.data);
    data = this._clearRelationships(data);
    delete data.id;
    return this._cleanNulls(data).data
  },
  //FIXME:Should override the update method
  parse:function(result){
    var attachmentRaw = result.node;
    var data = {};
    for (var key in attachmentRaw.data) {
        if (key === 'date_created' || key === 'date_modified') {
            continue;
        }
        if (attachmentRaw.data.hasOwnProperty(key))
            data[key] = attachmentRaw.data[key];
    }
    this.set('data',data);
    this.set('id',attachmentRaw.id)
    this.set('date_created', attachmentRaw.data.date_created);
    this.set('date_created', attachmentRaw.data.date_modified);
    for (var i = 0; i < this.relationshipIndex.length; i++) {
        relatedVector = result[this.relationshipIndex[i]];
        if (relatedVector) {
            this.parseRelatedVector(this.relationshipIndex[i], relatedVector)
        }
    }
  }
})
