/**

  TODO:
  - set login as marionette.application

**/
define(['jquery', 'marionette', 'backbone', 'config', './base/login/lyt-login', 
  './base/header/lyt-header','./base/inscription/lyt-insc','./base/activation/lyt-activate','./base/grid/grid','./base/usercreation/lyt-createUser'],
  function($, Marionette, Backbone, config, LytLogin, LytHeader, LytInscription,LytActivation,grid,userCreation) {

'use strict';
return Marionette.AppRouter.extend({
  appRoutes: {
    'inscription' : 'inscription',
    'activation/:id': 'activation',
    'resetpassword' :'resetpassword',
    'newpassword/:id' : 'newpassword',
    'grid':'grid',
    'userCreation':'userCreation',
    '*route(/:page)': 'home'


  },

  execute: function(callback, args) {
    var _this = this;
    var page = args[0];
      $.ajax({
        context: this,
        cache:false,
        url: config.coreUrl + 'security/has_access' + '?nocache='+Date.now(),
      }).done(function() {
        window.app.user.fetch({
          success: function() {
            $('body').addClass('app');
            _this.insertHeader();
            callback.apply(_this, args);
          }
        });
      }).fail(function(msg) {
        $('body').removeClass('app');
        window.app.rootView.rgHeader.empty();
        window.app.rootView.rgMain.show(new LytLogin());
        var currentRoute = Backbone.history.getFragment();
        var ss = currentRoute.search('activation');
        var reset = currentRoute.search('resetpassword');
        var newpass = currentRoute.search('newpassword');

        if (currentRoute == 'inscription') {
          window.app.rootView.rgMain.show(new LytInscription());
          Backbone.history.navigate('inscription', {trigger: true});

        } else if (ss >= 0 || reset >= 0 || newpass >=0){
          callback.apply(this, args);
        }

        else {
          Backbone.history.navigate('login', {trigger: true});
        }
      });
  },

  insertHeader: function() {
    if (!window.app.rootView.rgHeader.hasView()) {
      window.app.rootView.rgHeader.show(
        new LytHeader({app: this.options.app}));
    }
  },


});
});
