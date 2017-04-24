/**

  TODO:
  - error msg
  - autocomplete vincent plugin (bb collection)

**/
define(['marionette', 'underscore','backbone', 'sha1', 'config', 'jqueryui', 'sweetAlert', 'ajaxChimp', 'i18n'],
function(Marionette,_, Backbone, JsSHA, config, $ui, Swal, ajaxChimp) {
  'use strict';
  return Marionette.LayoutView.extend({
    template: 'app/base/inscription/tpl/tpl-insc.html',
    collection: new Backbone.Collection(),
    className: 'full-height',

events : {
    "click #btnInscription": "inscription",
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
      'updatenews' : '#formInscription input[name$="updatenews"]',
      'teamnews' : '#formInscription input[name$="teamnews"]',
  },
  onShow: function() {
      var locale = config.language;
       this.$el.i18n();
       if(locale == 'fr'){
          $(this.ui.nameField).attr("placeholder", "votre nom");
          $(this.ui.firstname).attr("placeholder", "votre prénom");
          $(this.ui.emailAdr).attr("placeholder", "votre adresse email");
          $(this.ui.password).attr("placeholder", "votre mot de passe");
          $(this.ui.confirmpass).attr("placeholder", "confirmer");
          $(this.ui.organisation).attr("placeholder", "votre entreprise ou organisation");
          //$("#password").attr("placeholder", "mot de passe");
      }
  },
  inscription : function(){
    var locale = config.language;
    var name = $(this.ui.nameField).val();
    var firstName = $(this.ui.firstname).val();
    var mail = $(this.ui.emailAdr).val();
    var password = $(this.ui.password).val();
    var password2 = $(this.ui.confirmpass).val();
    var organisation   =  $(this.ui.organisation).val();
    var language = $('#language').val();
    var updatenews = 0 ;   
    var teamnews  = 0 ;  
    if($(this.ui.updatenews).is(":checked")) {updatenews = 1}
    if($(this.ui.teamnews).is(":checked")) {teamnews = 1}  
    var fillFields ='Please fill in all fields';
    var mailadr = 'Please re-enter your password';
    var validmailadr = 'Please fill in a valid email adress';
    if (locale  =='fr') {
      fillFields = 'Merci de renseigner tous les champs';
       mailadr = 'Merci de re-saisir votre mot de passe';
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

    /*if ( mail == ""  || password == "" ) {

        Swal({
          title: 'Fields infos required',
          text: fillFields,
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: 'rgb(147, 14, 14)',
          confirmButtonText: 'OK',
          closeOnConfirm: true,
        });
    }*/
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
    //else if (!charte){alert("Merci cocher la case relative &eacute; la charte");}
    else {
      //var formVal = $("#formInscription").serialize();
      var formVal = {
        'password' : this.pwd(password),
        'firstName' : firstName,
        'mail' : mail,
        'name' : name,
        'organisation' : organisation,
        'updatenews' : updatenews,
        'teamnews' :teamnews,
        'language' : language
      }; 

      var url =config.coreUrl+"account";
      $.ajax({
        url: url,
        data : formVal,
        dataType: "json",
        success: function(data) {
          $("#inscription").addClass("masqued");
          if (data =="success"){
            //$("#inscriptionInfos").removeClass("masqued");

            Swal({   title: "Registration",   
              text: "Your registration has been taken into account. An email will be sent to you to confirm your registration.",   
               type: 'success',
               confirmButtonColor: "#419641",
              showCancelButton: false,      
              confirmButtonText: "Back to the authentication page",   
               }, function(){ 
                   Backbone.history.navigate('#login', { trigger: true });  
              });  

          } else if (data =="exists"){
            
            //$("#inscripErrorInfos").removeClass("masqued");
            Swal({   title: "Registration",   
              text: "You are already registred!",   
              type: 'error',
              confirmButtonColor: "#DD6B55",
              showCancelButton: false,      
              confirmButtonText: "Back to the authentication page",   
               }, function(){ 
                   Backbone.history.navigate('#login', { trigger: true });  
              });  

          }
         else {

            Swal({   title: "Registration",   
              text: "Error saving registration. Please contact us at : contact@natural-solutions.eu",   
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
           $("#inscription").addClass("masqued");
           $("#inscripError").removeClass("masqued");
      });
      // send data for mailchimp : */


      if(updatenews || teamnews ) {
            // set mailchimp form values
            $('#mce-FNAME').val(firstName);
            $('#mce-LNAME').val(name);
            $('#mce-EMAIL').val(mail);
            $('#mce-COMPANY').val(organisation);
            $('#mce-UPDATENEWS').val(updatenews);
            $('#mce-TEAMNEWS').val(teamnews);
          
          $(function(){
          $('#formMailchimp').ajaxChimp({
            url: 'http://natural-solutions.us7.list-manage.com/subscribe/post?u=1a9b21fb9d9d31564dd16e46e&amp;id=4d77f8fa4d',
            callback: function(response) {
              console.log('result');
              console.log(response);
            }
          });
           });

          $('#mc-embedded-subscribe').click();
      }
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
