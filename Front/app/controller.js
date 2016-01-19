define(['marionette', 'config',
	'./base/home/lyt-home',
  './base/inscription/lyt-insc'
], function(Marionette, config,
	LytHome,LytInscription

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
      this.rgMain.show(new LytHome({app: this.options.app}));
    }

  });
});
