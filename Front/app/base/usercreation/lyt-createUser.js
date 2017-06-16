/**

  TODO:
  - error msg
  - autocomplete vincent plugin (bb collection)

**/
define(['marionette', 'underscore','backbone', 'sha1', 'config', 'jqueryui', 'sweetAlert', 'ajaxChimp', 'i18n'],
function(Marionette,_, Backbone, JsSHA, config, $ui, Swal, ajaxChimp) {
  'use strict';
  return Marionette.LayoutView.extend({
    template: 'app/base/usercreation/tpl/tpl-createUser.html',
    collection: new Backbone.Collection(),
    className: 'full-height',

events : {
    "click #btnCreation": "creation",
    "click .homeNav" : "goHome",
    "click .required" : "removeError"
  },
  
  ui: {
      'nameField':  'input[name$="name"]',
      'firstname' : 'input[name$="firstName"]',
      'emailAdr' : '#formInscription input[name$="mail"]',
      'password'  : 'input[name$="password"]',
      'confirmpass' : 'input[name$="password2"]',
      'organisation' : 'input[name$="organisation"]',
  },
  onShow: function() {
      var locale = config.language;
       this.$el.i18n();
       if(locale == 'fr'){
          $(this.ui.nameField).attr("placeholder", "Nom");
          $(this.ui.firstname).attr("placeholder", "Prénom");
          $(this.ui.emailAdr).attr("placeholder", "adresse email");
          $(this.ui.password).attr("placeholder", "mot de passe");
          $(this.ui.confirmpass).attr("placeholder", "confirmer");
          $(this.ui.organisation).attr("placeholder", "entreprise ou organisation");
          //$("#password").attr("placeholder", "mot de passe");
      }
  },
  creation : function(){
    var locale = config.language;
    var name = $(this.ui.nameField).val();
    var firstName = $(this.ui.firstname).val();
    var mail = $(this.ui.emailAdr).val();
    var password = $(this.ui.password).val();
    var password2 = $(this.ui.confirmpass).val();
    var organisation   =  $(this.ui.organisation).val();
    var language = $('#language').val();
    var role = $('#role').val();
    var fillFields ='Please fill in all fields';
    var mailadr = 'Please re-enter the password';
    var validmailadr = 'Please fill in a valid email adress';
    if (locale  =='fr') {
      fillFields = 'Merci de renseigner tous les champs';
       mailadr = 'Merci de re-saisir le mot de passe';
      validmailadr = 'Merci de saisir une adresse mail valide';
    }

    if( mail == "") {
      $(this.ui.emailAdr).addClass('error');
    } 

    if (password == "") {
      $(this.ui.password).addClass('error');
    }
    if (password2 == "") {
      $(this.ui.confirmpass).addClass('error');
    }

    if (password!=password2){ 
      Swal({
          title: 'Password confirmation required',
          text: mailadr,
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: 'rgb(147, 14, 14)',
          confirmButtonText: 'OK',
          closeOnConfirm: true,
        });

    } 
    if( !this.validateEmail(mail)) {
      Swal({
          title: 'Invalid email adress',
          text: validmailadr,
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: 'rgb(147, 14, 14)',
          confirmButtonText: 'OK',
          closeOnConfirm: true,
        });

   }
    else {
      var formVal = {
        'password' : this.pwd(password),
        'firstName' : firstName,
        'mail' : mail,
        'name' : name,
        'organisation' : organisation,
        'language' : language,
        'role' : role
      }; 

      var url =config.coreUrl+"userInsert";
      $.ajax({
        url: url,
        data : formVal,
        dataType: "json",
        success: function(data) {
          $("#createUser").addClass("masqued");
          if (data =="success"){
            $("#createUserInfos").removeClass("masqued");

            Swal({   title: "New User",   
              text: "Un nouvel utilisateur a été créé.",   
               type: 'success',
               confirmButtonColor: "#419641",
              showCancelButton: false,      
              confirmButtonText: "Back to the authentication page",   
               }, function(){ 
                   Backbone.history.navigate('#login', { trigger: true });  
              });  

          } else if (data =="exists"){
            
            $("#createUserErrorInfos").removeClass("masqued");
            Swal({   title: "Existe déjà",   
              text: "Cet utilisateur existe déjà !",   
              type: 'error',
              confirmButtonColor: "#DD6B55",
              showCancelButton: false,      
              confirmButtonText: "Back to the authentication page",   
               }, function(){ 
                   Backbone.history.navigate('#login', { trigger: true });  
              });  

          }
         else {

            Swal({   title: "Error",   
              text: "Error saving new user.",   
              type: 'error',
              confirmButtonColor: "#DD6B55",
              showCancelButton: false,      
              confirmButtonText: "Back to the authentication page",   
               }, function(){ 
                   Backbone.history.navigate('#login', { trigger: true });  
              });  
          }
         }
      }).fail(function() {
           $("#createUser").addClass("masqued");
           $("#createUserError").removeClass("masqued");
      });

    }
  },
  validateEmail : function($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if( !emailReg.test( $email ) ) {
      return false;
    } else {
      return true;
    }
  },

  pwd: function(pwd) {

      pwd = window.btoa(unescape(decodeURIComponent( pwd )));
      var hashObj = new JsSHA('SHA-1', 'B64', 1);

      hashObj.update(pwd);
      pwd = hashObj.getHash('HEX');
      return pwd;
    },
  goHome : function()  {
    Backbone.history.navigate('', {trigger: true});
  },
  removeError : function(e) {
    $(e.target).removeClass('error');
  }

  });
});
