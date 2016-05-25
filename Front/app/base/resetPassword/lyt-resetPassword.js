/**

	TODO:
	- error msg
	- autocomplete vincent plugin (bb collection)

**/
define(['marionette', 'backbone', 'sha1', 'config', 'jqueryui','i18n'],
function(Marionette, Backbone, JsSHA, config, $ui) {
  'use strict';
  return Marionette.LayoutView.extend({
    template: 'app/base/resetPassword/tpl/tpl-resetPass.html',
    collection: new Backbone.Collection(),
    className: 'full-height',

    events: {
      'submit': 'send',
      'change #UNportal': 'checkUsername',
      'focus input': 'clear',
      'blur input': 'unBlur',
       'click .homeNav' : 'goHome'
    },

    ui: {
      err: '#help-password',
      pwd: '#pwd-group',
      logo: '#logo',
    },


    initialize: function() {
      this.model = window.app.siteInfo;

      var tmp = this.model.get('label').split('^');
      if (tmp.length > 1) {
        this.model.set({'sup' : tmp[1]});
      }else {
        this.model.set({'sup' : ''});
      }
      this.model.set({'title' : tmp[0]});
    },

    unBlur: function(){
      this.$el.find('.blur').removeClass('da');
    },

    clear: function(evt) {
      this.$el.find('.blur').addClass('da');

      var group = $(evt.target).parent();
      group.removeClass('has-error');
      group.find('.help-block').text('');

    },

    style: function() {
      var _this = this;
      var imgBackPortal = this.model.get('imgBackPortal');
      var imgLogoPrtal = this.model.get('imgLogoPortal');
      var logo = 'url(data:image/png;base64,' + imgBackPortal + ')';
      $(this.$el[0]).css('background', logo + ' center center no-repeat');
      //var bg = 'url(data:image/png;base64,' + imgLogoPrtal + ')';
      //this.ui.logo.css('background', bg + 'center center no-repeat');
      this.ui.logo.css({
        'background-size': 'contain',
      });

      $(this.$el[0]).css({
        'background-position': 'center',
        'background-attachment': 'fixed',
        'background-size': 'cover',
      });
    },

    onShow: function() {
      var locale = config.language;
      this.style();
      var ctx = this;
      this.collection.url = config.coreUrl + 'user';
      this.collection.fetch({
        success: function(data) {
          ctx.users = [];
          data.each(function(m) {
            ctx.users.push(m.get('fullname'));
          });
/*
          $('#UNportal').autocomplete({
            source: function(request, response) {
              var exp = '^' + $.ui.autocomplete.escapeRegex(request.term);
              var matcher = new RegExp(exp, 'i');
              response($.grep(ctx.users, function(item) {
                return matcher.test(item);
              }));
            },
          });*/
        },
      });
      this.$el.i18n();
      if(locale == 'fr'){
          $("#UNportal").attr("placeholder", "adresse email");
          $("#password").attr("placeholder", "mot de passe");
      }
      if(window.app.currentUserEmail){
        if(window.app.currentUserEmail !='Invalid email adress'){
           $('#emailreset').val(window.app.currentUserEmail);
        }
       
      }
       
    },

    checkUsername: function() {
      var locale = config.language;
      var user = this.collection.findWhere({fullname: $('#UNportal').val()});
      if (!user) {
        var invalidUser = 'Invalid email adress';
        if(locale == 'fr'){
              invalidUser = 'Adresse email invalide' ;
          }
        this.fail('#login-group', invalidUser);
      }
    },

    send: function(elt) {
      var locale = config.language;
      var _this = this;
      elt.preventDefault();
      elt.stopPropagation();
      var email  =   $('#emailreset').val();
      var user = this.collection.findWhere({fullname: email});
      var url = config.coreUrl + 'account/newpassword';
      var self = this;
      if (user) {
        $.ajax({
          context: this,
          type: 'POST',
          url: url,
          data: {
            mail : email
          },
        }).done(function() {
            /*
          $('.login-form').addClass('rotate3d');
          window.app.user.set('name', $('#UNportal').val());

          setTimeout(function() {
            Backbone.history.navigate('', {trigger: true});
          }, 500);
          */
          $('#formReset').addClass('masqued');
          $('#msgResetPass').removeClass('masqued');

        }).fail(function() {
          var invalidPass = 'Invalid password';
          if(locale == 'fr'){
              invalidPass = 'Mot de passe invalide' ;
          }
          this.fail('#pwd-group', invalidPass);
          this.shake();
		  $('#password').val('');
        });
        
      } else {
        var invalidUser = 'Invalid email adress';
        if(locale == 'fr'){
              invalidUser = 'Adresse email invalide' ;
          }
        this.fail('#login-group', invalidUser);
        this.shake();
      }
    },

    fail: function(elt, text) {
      $(elt).addClass('has-error');
      $(elt + ' .help-block').text(text);
    },

    shake: function() {
      $('.login-form').addClass('animated shake');
      setTimeout(function() {
        $('.login-form').removeClass('animated shake');
      }, 1000);
    },
    goHome : function()  {
        Backbone.history.navigate('', {trigger: true});
    }


  });
});
