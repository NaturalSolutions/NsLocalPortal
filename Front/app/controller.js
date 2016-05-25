define(['marionette', 'config',
	'./base/home/lyt-home',
  './base/inscription/lyt-insc',
  './base/activation/lyt-activate',
  './base/resetPassword/lyt-resetPassword',
  './base/new-password/lyt-new-password'

], function(Marionette, config,
	LytHome,LytInscription,LytActivation,LytResetPass,LytNewPass

) {
  'use strict';
  return Marionette.Object.extend({

    initialize: function() {
      this.rgMain = this.options.app.rootView.rgMain;
      this.rgHeader = this.options.app.rootView.rgHeader;
      this.rgFooter = this.options.app.rootView.rgFooter;
    },

    home: function() {
      Backbone.history.navigate('');
      this.rgMain.show(new LytHome({app: this.options.app}));
    },

    inscription : function() {
      Backbone.history.navigate('');
      this.rgMain.show(new LytInscription({app: this.options.app}));
    },

    activation : function(id) {
      //Backbone.history.navigate('');
      this.rgMain.show(new LytActivation({userID: id}));
    },
    resetpassword :  function() {
      //Backbone.history.navigate('');
      this.rgMain.show(new LytResetPass({app: this.options.app}));
    },
    newpassword : function(id) {
      //Backbone.history.navigate('');
      this.rgMain.show(new LytNewPass({userID: id}));
    }

  });
});
