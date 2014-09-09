"use strict"; // jshint ;_;
(function($) {
  var Tagger = function(element, options) {
    this.$element = $(element);
    this.initilizeElement();
    this.source = options.source;
    this.displayPath = options.displayPath || '';
    this.processReturn = options.processReturn || function(object) {
      return object
    };
    this.context = options.context || this;
    this.tagAdded = options.tagAdded || function() {},
    this.tagRemoved = options.tagRemoved || function() {},
    //  this.getTags = this.getTags;
    options.source = $.proxy(this.sourceWrapper, this);
    options.updater = options.updater || $.proxy(this.updater, this);
    //this.$element.typeahead(options);
    this.property = options.property || "";
    this.cache = [];
  }



  Tagger.prototype = {

    constructor: Tagger

    ,
    initilizeElement: function() {
      var taggerWrapper = jQuery('<div></div>', {
        class: 'taggerWrapper'
      });
      var taggerClip = jQuery('<div></div>', {
        class: 'taggerClip'
      });
      taggerWrapper.append(taggerClip);
      var width = this.$element.css('width');
      taggerWrapper.css('width', width)
      this.$element.css('width', '60%')
      var $elementClone = this.$element.clone();
      this.$element.replaceWith(taggerWrapper);
      taggerClip.append($elementClone);
      this.$element = $elementClone;
      this.$element.on('keyup', $.proxy(this.keydown, this));
    }

    ,
    updater: function(item) {
      var itemObj = this.cache[item] || item;
      var $tag = $('<span class="label label-success" style="margin-left:5px;">' + item + '<i class="icon-remove"></i></span>');
      $tag.data('itemObj', itemObj);
      $tag.find('.icon-remove').bind('click', this, function(e) {
        e.data.$element.focus();
        $(this).parent().remove();
      });
      $tag.insertBefore(this.$element)
      return itemObj;
    }

    ,
    keydown: function(e) {
      console.log(e.keyCode);
      var value = this.$element.val();
      switch (e.keyCode) {
        case 32: // Space
          if (value === ' ') {
            break;
          }
          value = value.replace(' ', '');
          var item = this.updater(value);
          this.$element.val('');
          e.stopImmediatePropagation();
          this.tagAdded.call(this.context, item);
          break;
        case 8: //Backspace
          var data = this.$element.siblings().last().data().itemObj;
          if (value === '') {
            this.$element.siblings().last().remove();
          }
          this.tagRemoved.call(this.context, data)
          break;
      }
    }


    //did something wich may not be good
    //added proccess to the tagger obj and i retrive it async at the proccess method
    ,
    sourceWrapper: function(query, process) {
      this.callback = process
      $.isFunction(this.source) ? this.source(query, $.proxy(this.process, this)) : this.process(this.source);
    }

    ,
    process: function(items) {
      this.cache = {};
      var ret = []
      for (var counter = 0; counter < items.length; counter++) {
        var item = items[counter]
        this.cache[item] = item;
        if (this.property !== "") {
          ret[counter] = item[this.property];
        } else
          ret[counter] = item;
      }

      this.callback(ret);
    }

    ,
    getTags: function() {
      var siblings = this.$element.siblings('span.label');
      var ret = new Array(siblings.length);
      for (var counter = 0; counter < siblings.length; counter++) {
        ret[counter] = this.processReturn($(siblings.get(counter)).data("itemObj"));
      }
      return ret;
    }

    ,
    getCurrentVal: function() {
      return this.$element.val();
    }
  },
  $.fn.tagger = function(options) {
    this.tagger = new Tagger(this, options);
    return this;
  }
})(window.jQuery);
