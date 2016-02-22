/**

  TODO:
  - error msg
  - autocomplete vincent plugin (bb collection)

**/
define(['marionette', 'backbone', 'sha1', 'config', 'jqueryui','i18n'],
function(Marionette, Backbone, JsSHA, config, $ui) {
  'use strict';
  return Marionette.LayoutView.extend({
    template: 'app/base/activation/tpl/tpl-activate.html',
    collection: new Backbone.Collection(),
    className: 'full-height',

events : {
    "click #btnInscription": "inscription"
  },
  initialize : function(options){
      this.url =config.coreUrl+"account/"+options.userID+"/activation";
      console.log(this.url)
      
  },

  onShow:function(){
    var _this = this;
    setTimeout(function(){
              _this.activation();
            }, 2000);
    this.$el.i18n();
  },

  activation:function () {
    $.ajax({
        url: this.url,
        success: function(data) {
          if (data =="success"){
            $("#activation").addClass("masqued");
            $("#activationInfos").removeClass("masqued");
            setTimeout(function(){
              Backbone.history.navigate('login', {trigger: true});
            }, 2000);
          }
        }
      });
  }
  });
});
