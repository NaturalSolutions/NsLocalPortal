

define(['marionette', 'backbone', 'sha1', 'config', 'jqueryui', 'sweetAlert','agGrid','i18n', './user-model',  'backbone-forms'],
    function(Marionette, Backbone, JsSHA, config, $ui,Swal,agGrid,i18n, UserModel,BackboneForm) {
      'use strict';
      return Marionette.LayoutView.extend({
        template: 'app/base/users/tpl/tpl-newuser.html',
        className: 'full-height',

        ui: {
            'form':'#form'
        },
        events : {
          'change input[name="confirmpassword"]' : 'checkPassWord',
          'click .js-newuser' : 'createUser'
        },

        initialize: function() {


    },

    onShow: function() {
      this.displayForm();
    },

    displayForm: function() {
      var self = this;
      var user = new UserModel();
      var form = new BackboneForm ({
          model: user
      }).render();
      $(self.ui.form).append(form.el);
      this.form = form ;


    },
    checkPassWord : function(e){
      var data = this.form.getValue();
      var password =  data.password;
      if (password == "") {
        this.simpleSweetAlert('Mot de passe non saisi','Merci de renseigner le mot de passe.', 'warning');
      }
      if (data.confirmpassword != password ) {
        this.simpleSweetAlert('Mot de passe différent','Merci de saisir le même mot de passe.', 'warning');
        $(e.target).val('');

      }

    },
    createUser : function(){
      var self = this;
      var errors = this.form.commit({ validate: true }); 
      console.log(errors);
      if( !errors ) {
        var password = this.form.model.get('password');
        this.form.model.set('password', this.pwd(password));
        this.form.model.set('confirmpassword', '');
        this.form.model.set('role', parseInt(this.form.model.get('role')));
        var url = config.coreUrl + 'account';   
        $.ajax({
          context: this,
          url: url,
          dataType: "json",
          data: {
            name: this.form.model.get('name'),
            firstName: this.form.model.get('firstName'),
            password : this.form.model.get('password'),
            mail : this.form.model.get('mail'),
            language : 'fr',
            organisation : '',
            updatenews :0,
            teamnews : 0,
            role : this.form.model.get('role')
          },
        }).done(function(data) {
            if(data=="success") {
              self.simpleSweetAlert('Nouveau compte','Compte utilisateur créé avec succès !', 'success');
              Backbone.history.navigate('#users', { trigger: true });  
            } 
            else if  (data=="exists") {
              self.simpleSweetAlert('Erreur de doublon','utilisateur existant avec la meme adresse email !', 'warning');
            } 
            else {
              self.simpleSweetAlert('Erreur','Erreur de creation d\'utilisateur !','warning');
            }
        }).fail(function() {
          self.simpleSweetAlert('Erreur','Echec de création d\'un nouvel utilisateur.','warning');
        });
      }
    },
    pwd: function(pwd) {

      pwd = window.btoa(unescape(decodeURIComponent( pwd )));
      var hashObj = new JsSHA('SHA-1', 'B64', 1);

      hashObj.update(pwd);
      pwd = hashObj.getHash('HEX');
      return pwd;
    },
    simpleSweetAlert : function(title,text,type){
      Swal({   title: title,   
        text: text,   
        type: type,
        showCancelButton: false
      });
    }
});
});




