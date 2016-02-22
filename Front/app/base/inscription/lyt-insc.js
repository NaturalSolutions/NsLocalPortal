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
  onShow: function() {
       this.$el.i18n();
  },
  inscription : function(){
    var locale = config.language;
    var name = $("input[name$='name']").val();
    var firstName = $("input[name$='firstName']").val();
    var mail = $("input[name$='mail']").val();
    var password = $("input[name$='password']").val();
    var password2 = $("input[name$='password2']").val();
    var organisation   =  $("input[name$='organisation']").val();
    //var charte = $("input[name$='charte']").is(':checked');
    var fillFields ='Please fill in all fields';
    var mailadr = 'Please re-enter your password';
    var validmailadr = 'Please fill in a valid email adress';
    if (locale  =='fr') {
      fillFields = 'Merci de renseigner tous les champs';
       mailadr = 'Merci de re-saisir votre mot de passe';
      validmailadr = 'Merci de saisir une adresse mail valide';
    }

    if ( name == "" || firstName =="" || mail == ""  || password == "" ) {alert(fillFields);}
    else if (password!=password2){ alert(mailadr);} 
    else if( !this.validateEmail(mail)) { alert(validmailadr);}
    //else if (!charte){alert("Merci cocher la case relative &eacute; la charte");}
    else {
      //var formVal = $("#formInscription").serialize();
      var formVal = {
        'password' : this.pwd(password),
        'firstName' : firstName,
        'mail' : mail,
        'name' : name,
        'organisation' : organisation
      }; 

      console.log(formVal.password)
      var url =config.coreUrl+"account";
      $.ajax({
        url: url,
        data : formVal,
        dataType: "json",
        success: function(data) {
          if (data =="success"){
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

  pwd: function(pwd) {

      pwd = window.btoa(unescape(decodeURIComponent( pwd )));
      var hashObj = new JsSHA('SHA-1', 'B64', 1);

      hashObj.update(pwd);
      pwd = hashObj.getHash('HEX');
      return pwd;
    },


  });
});
