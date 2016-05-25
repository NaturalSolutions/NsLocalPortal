/**

	TODO:
	- header class hide : see router.js & app.js

**/

define(['marionette', 'config','i18n'],
function(Marionette, config) {
  'use strict';
  return Marionette.LayoutView.extend({
    template: 'app/base/header/tpl-header.html',
    className: 'header',
    events: {
      'click #logout': 'logout',
      'click #pipefy' : 'pipefyform',
      'click .pipefyclose' :'closeform'
    },

    ui: {
      'user': '#user',
      'pypefy' : '#pipefy',
      'pypefypanel' :'div.supportpanel'
    },

    initialize: function() {
      this.model = window.app.user;
    },

    logout: function() {
      $.ajax({
        context: this,
        cache: false,
        url: config.coreUrl + 'security/logout?nocache=' + Date.now(),
      }).done(function() {
        Backbone.history.navigate('login', {trigger: true});
      });
    },

    onShow: function() {
      console.log(this.model);
      var name = this.model.get('firstname') + ' ' + this.model.get('lastname');
      this.ui.user.html(name);
      this.$el.i18n();
    },
    pipefyform : function(e){
      // check id div is not integrated add it
      var frmisinserted  = this.$el.find('.supportpanel').length;
      if (!frmisinserted) {
        this.insertForm();
      } else {
        this.controlformdisplay();
      }
      
    },
    closeform : function(){
      $('div.supportpanel').animate({ "right": "-=560px" }, "slow" ).addClass('hidden');
    },
    insertForm : function(){
      var frm = '<div class="supportpanel hidden">'
      frm +='<iframe width="560" height="580" src="https://beta.pipefy.com/public_form/49561?embedded=true" frameborder="0" id="iframe"></iframe>'
      frm+='<a class="pipefyclose"><span class="reneco reneco-close"></span></a> </div>';
      this.$el.append(frm);
      this.controlformdisplay();
    },
    controlformdisplay : function(){
      var frmpanel = this.$el.find('.supportpanel')[0];
      var notdisplayed = $(frmpanel).hasClass('hidden');
      if(notdisplayed){
        $(frmpanel).removeClass('hidden').animate({ "right": "+=560px" }, "slow" );

      } else {
        this.closeform();
      }
    }
  });
});
