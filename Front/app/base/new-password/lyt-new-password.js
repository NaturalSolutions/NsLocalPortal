/**

	TODO:
	- error msg
	- autocomplete vincent plugin (bb collection)

**/
define(['marionette', 'backbone', 'sha1', 'config', 'jqueryui','sweetAlert','i18n'],
function(Marionette, Backbone, JsSHA, config, $ui,Swal) {
  'use strict';
  return Marionette.LayoutView.extend({
    template: 'app/base/new-password/tpl/tpl-newpass.html',
    collection: new Backbone.Collection(),
    className: 'full-height',

    events: {
      'submit': 'send',
      'change #UNportal': 'checkUsername',
      'focus input': 'clear',
      'blur input': 'unBlur',
    },

    ui: {
      err: '#help-password',
      pwd: '#pwd-group',
      logo: '#logo',
      password : '#newpassword',
      confirmpass :'#confirmnewpassword'
    },

    pwd: function(pwd) {

      pwd = window.btoa(unescape(decodeURIComponent( pwd )));
      var hashObj = new JsSHA('SHA-1', 'B64', 1);

      hashObj.update(pwd);
      pwd = hashObj.getHash('HEX');
      return pwd;
    },

    initialize: function(options) {
      this.model = window.app.siteInfo;

      var tmp = this.model.get('label').split('^');
      if (tmp.length > 1) {
        this.model.set({'sup' : tmp[1]});
      }else {
        this.model.set({'sup' : ''});
      }
      this.model.set({'title' : tmp[0]});
      this.userID =  options.userID;
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
      //var imgLogoPrtal = this.model.get('imgLogoPortal');
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
      var user = this.collection.findWhere({fullname: $('#UNportal').val()});
      var url = config.coreUrl + 'account/updatepassword';
      var self = this;
      var password =  $(this.ui.password).val();
      var confirmpass =  $(this.ui.confirmpass).val();
      if (password == confirmpass) {
        $.ajax({
          context: this,
          type: 'POST',
          url: url,
          data: {
            id: _this.userID,
            password: this.pwd(password),
          },
        }).done(function(data) {
          var err = '';
          if(data=='ok'){
            $('#formNew').addClass('masqued');
            $('#msgNewPass').removeClass('masqued');
          } else {
            Swal({   title: "Error in updating password",   
              text: "An error is occured when updating password . Please retry or contact us at : contact@natural-solutions.eu",   
              type: 'error',
              confirmButtonColor: "#DD6B55",
              showCancelButton: false,      
              confirmButtonText: "Back to the authentication page",   
               }, function(){ 
                   Backbone.history.navigate('#login', { trigger: true });  
              });
          }            

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
        var invalidpass = 'passwords are not identical';
        if(locale == 'fr'){
              invalidpass = 'mots de passe non identiques' ;
          }
        this.fail('#pwd2-group', invalidpass);
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


  });
});
