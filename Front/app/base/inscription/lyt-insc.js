/**

  TODO:
  - error msg
  - autocomplete vincent plugin (bb collection)

**/
define(['marionette', 'backbone', 'sha1', 'config', 'jqueryui','i18n'],
function(Marionette, Backbone, JsSHA, config, $ui) {
  'use strict';
  return Marionette.LayoutView.extend({
    template: 'app/base/inscription/tpl/tpl-insc.html',
    collection: new Backbone.Collection(),
    className: 'full-height',

events : {
    "click #btnInscription": "inscription"
  },
  inscription : function(){
    var name = $("input[name$='name']").val();
    var firstName = $("input[name$='firstName']").val();
    var mail = $("input[name$='mail']").val();
    var password = $("input[name$='password']").val();
    var password2 = $("input[name$='password2']").val();
    //var charte = $("input[name$='charte']").is(':checked');
    if ( name == "" || firstName =="" || mail == ""  || password == "" ) {alert("Merci de renseigner tous les champs");}
    else if (password!=password2){ alert("Merci de re-saisir votre mot de passe");} 
    else if( !this.validateEmail(mail)) { alert("Merci de saisir une adresse mail valide");}
    //else if (!charte){alert("Merci cocher la case relative &eacute; la charte");}
    else {
      var formVal = $("#formInscription").serialize();  
      var url ="http://localhost/portal/user/mail_send?"+ formVal;
      $.ajax({
        url: url,
        dataType: "json",
        success: function(data) {
          var result = data[0].result;
          if (result =="success"){
            $("#inscription").addClass("masqued");
            $("#inscriptionInfos").removeClass("masqued");
          }
         var tmp;
           }
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

  });
});
