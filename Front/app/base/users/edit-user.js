

define(['marionette', 'backbone', 'sha1', 'config', 'jqueryui', 'sweetAlert','agGrid','i18n', './user-model',  'backbone-forms'],
  function(Marionette, Backbone, JsSHA, config, $ui,Swal,agGrid,i18n, UserModel,BackboneForm) {
    'use strict';
    return Marionette.LayoutView.extend({
      template: 'app/base/users/tpl/tpl-edituser.html',
      className: 'full-height',

    ui: {
      'form':'#form'
    },
    events : {
      'change input[name="confirmpassword"]' : 'checkPassWord',
      'click .js-edituser' : 'editUser'
    },

    initialize: function(options) {

        var self=this;
        var data = { method: 'get', id : options.id };
        var request = $.get( config.coreUrl + 'getuser', data);
        request.done(function(res){
          var user = new UserModel();
          user.set('name', res.lastname);
          user.set('firstName', res.firstname);
          user.set('mail', res.fullname);
          user.set('role', res.role);
          self.displayForm(user);
        });
        this.userId = parseInt(options.id);
    },
    onShow: function() {

    },

    displayForm: function(user) {
      var self = this;
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

    editUser : function(){
      var self = this;
      var errors = this.form.commit({ validate: true }); 
      console.log(errors);
      if( !errors ) {
        var password = this.form.model.get('password');
        this.form.model.set('password', this.pwd(password));
        this.form.model.set('confirmpassword', '');
        var url = config.coreUrl + 'userUpdate';
        $.ajax({
          context: this,
          url: url,
          type : 'Post',
          dataType: "json",
          data: {
            name: this.form.model.get('name'),
            firstName: this.form.model.get('firstName'),
            password : this.form.model.get('password'),
            mail : this.form.model.get('mail'),
            role : this.form.model.get('role'),
            id : this.userId,
            language : 'fr',
            organisation : '',
            updatenews :0,
            teamnews : 0
          },
        }).done(function(data) {
            if(data=="ok") {
              self.simpleSweetAlert('Mise à jour du compte','Compte utilisateur mis à jour avec succès !', 'success');
              Backbone.history.navigate('#users', { trigger: true });  
            } 
            else {
              self.simpleSweetAlert('Erreur','Echec de mise à jour du compte utilisateur','warning');
            }
        }).fail(function() {
          self.simpleSweetAlert('Erreur','Echec de mise à jour du compte utilisateur','warning');
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




