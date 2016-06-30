/**

	TODO:
	- error msg
	- autocomplete vincent plugin (bb collection)

**/
define(['marionette', 'backbone', 'sha1', 'config', 'jqueryui', 'sweetAlert','i18n'],
function(Marionette, Backbone, JsSHA, config, $ui,Swal) {
  'use strict';
  return Marionette.LayoutView.extend({
    template: 'app/base/login/tpl/tpl-login.html',
    collection: new Backbone.Collection(),
    className: 'full-height',

    events: {
      'submit': 'login',
      'change #UNportal': 'checkUsername',
      'click  #UNportal' : 'clearField',
      'focus input': 'clear',
      'blur input': 'unBlur',
      'click #resetpassword' : 'resetPass'
    },

    ui: {
      err: '#help-password',
      pwd: '#pwd-group',
      logo: '#logo',
      email : '#UNportal',
      passwd : '#password'
    },

    pwd: function(pwd) {

      pwd = window.btoa(unescape(decodeURIComponent( pwd )));
      var hashObj = new JsSHA('SHA-1', 'B64', 1);

      hashObj.update(pwd);
      pwd = hashObj.getHash('HEX');
      return pwd;
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
          $(this.ui.email).attr("placeholder", "adresse email");
          $(this.ui.passwd).attr("placeholder", "mot de passe");
      }
	  var isMobile = window.matchMedia("only screen and (max-width: 760px)");
      if (isMobile.matches) {
          Swal({
              title: 'Mobile compatibility',
              text: 'This application is not adapted to mobile browsers yet',
              type: 'warning',
              showCancelButton: false,
              confirmButtonColor: 'rgb(221, 107, 85)',
              confirmButtonText: 'OK',
              closeOnConfirm: true
          });
		  $('.sweet-alert.showSweetAlert.visible').css('margin-left', '0px;');
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
        //this.fail('#login-group', invalidUser);
        $(this.ui.email).val(invalidUser);
        $(this.ui.email).css('color', 'red');
      }
    },

    login: function(elt) {
      var locale = config.language;
      var _this = this;
      elt.preventDefault();
      elt.stopPropagation();
      var user = this.collection.findWhere({fullname: $('#UNportal').val()});
      var url = config.coreUrl + 'security/login';
      var self = this;

      if (user) {
        $.ajax({
          context: this,
          type: 'POST',
          url: url,
          data: {
            userId: user.get('PK_id'),
            password: this.pwd($('#password').val()),
          },
        }).done(function() {
          $('.login-form').addClass('rotate3d');
          window.app.user.set('name', $('#UNportal').val());

          setTimeout(function() {
            Backbone.history.navigate('', {trigger: true});
          }, 500);

        }).fail(function() {
          var invalidPass = 'Invalid password';
          if(locale == 'fr'){
              invalidPass = 'Mot de passe invalide' ;
          }
          this.fail('#pwd-group', invalidPass);
          this.shake();
		      $(this.ui.passwd).val('');
        });
      } else {
        var invalidUser = 'Invalid email adress';
        if(locale == 'fr'){
              invalidUser = 'Adresse email invalide' ;
          }
        //this.fail('#login-group', invalidUser);
        $(this.ui.email).val(invalidUser);
        $(this.ui.email).css('color', 'red');
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
    resetPass : function(){
      // get current email adress
      window.app.currentUserEmail = $('#UNportal').val();
      // navigate to reset pass page
      Backbone.history.navigate('#resetpassword', {trigger: true});
    },
    clearField : function(){
        $(this.ui.email).val('');
        $(this.ui.email).css('color', 'white');
    }

  });
});
