define(['marionette', 'config',
	'./base/home/lyt-home',
  './base/inscription/lyt-insc',
  './base/activation/lyt-activate',
  './base/resetPassword/lyt-resetPassword',
  './base/new-password/lyt-new-password',
  './base/usercreation/lyt-createUser',
  './base/users/users',
  './base/users/new-user',
  './base/users/edit-user'

], function(Marionette, config,
	LytHome,LytInscription,LytActivation,LytResetPass,LytNewPass,UserCreation,users,NewUser,EditUser

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
    users: function() {
      var userRoleId = window.app.user.get('role');
      if (userRoleId == 1) {
        Backbone.history.navigate('users');
        this.rgMain.show(new users({app: this.options.app}));
      } else {
        alert('non autorisé');
        Backbone.history.navigate(config.defaultUrlRedirection , {trigger: true});
      }  
    },
    userCreation: function() {
      Backbone.history.navigate('lyt-createUser');
      this.rgMain.show(new UserCreation({app: this.options.app}));
    },
    inscription : function() {
      if(config.autoregistration) {
        Backbone.history.navigate('');
        this.rgMain.show(new LytInscription({app: this.options.app}));
      } else {
         Backbone.history.navigate(config.defaultUrlRedirection , {trigger: true});
      }
    },
    activation : function(id) {
      //Backbone.history.navigate('');
      this.rgMain.show(new LytActivation({userID: id}));
    },
    resetpassword :  function() {
      //Backbone.history.navigate('');
      if(config.resetpassword) {
        this.rgMain.show(new LytResetPass({app: this.options.app}));
      } else {
         Backbone.history.navigate(config.defaultUrlRedirection , {trigger: true});
      }
    },
    newpassword : function(id) {
      //Backbone.history.navigate('');
      if(config.resetpassword) {
        this.rgMain.show(new LytNewPass({userID: id}));
      }
    },
    newuser : function(){
      var userRoleId = window.app.user.get('role');
      if (userRoleId == 1) {
        this.rgMain.show(new NewUser());
      } else {
        alert('non autorisé');
        Backbone.history.navigate(config.defaultUrlRedirection , {trigger: true});
      }

    },
    edituser : function(id) {
      var userRoleId = window.app.user.get('role');
      if (userRoleId == 1) {
        this.rgMain.show(new EditUser({id:id}));
      } else {
        alert('non autorisé');
        Backbone.history.navigate(config.defaultUrlRedirection , {trigger: true});
      }
    }
  });
});
