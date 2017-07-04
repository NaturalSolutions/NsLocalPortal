define([
	'backbone'
], function(Backbone) {

  'use strict';

  return Backbone.Model.extend({
    schema: {
      name: {
        type: 'Text',
        title: 'Nom',
        editorClass: 'form-control',
        validators: ['required'],
        inputAttrs : {'tabindex' : '1'}
      },
      firstName: {
        type: 'Text',
        title: 'Prénom',
        editorClass: 'form-control',
        validators: ['required'],
        inputAttrs : {'tabindex' : '2'}
      },
      password: {
        type: 'Password',
        title: 'Mot de passe',
        editorClass: 'form-control',
        validators: ['required'],
        inputAttrs : {'tabindex' : '3'}
      },
      confirmpassword: {
        type: 'Password',
        title: 'Confirmer le mot de passe',
        editorClass: 'form-control',
        validators: ['required'],
        inputAttrs : {'tabindex' : '4'}
      },
      mail: {
        title: 'Email',
        editorClass: 'form-control',
        validators: ['email'],
        inputAttrs : {'tabindex' : '5'}
      },
      role : {
        title: 'Role',
        type: 'Select',
        editorClass: 'form-control',
        validators: ['required'],
        options: [{ val: 0, label: '' }, { val: 1, label: 'Administrateur' }, { val: 3, label: 'Utilisateur' },{ val: 5, label: 'Lecteur' }]
      }
    }
  });
});

