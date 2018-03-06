

define(['marionette', 'backbone', 'sha1', 'config', 'jqueryui', 'sweetAlert','agGrid','i18n','sweetAlert'],
    function(Marionette, Backbone, JsSHA, config, $ui,Swal,agGrid,i18n) {
      'use strict';
      return Marionette.LayoutView.extend({
        template: 'app/base/users/tpl/tpl-users.html',
        className: 'full-height',

        ui: {
            'grid':'#myGrid'
        },
        events : {
          'click button.edit' : 'editUser',
          'click button.delete' : 'deleteUser'
        },

        initialize: function() {
            var self = this;
            this.columnDefs = [
            {headerName: "ID", field: "PK_id", width: 50},
            {headerName: "Nom", field: "Lastname", width: 150},
            {headerName: "Prénom", field: "Firstname", width: 150},
            {headerName: "Login", field: "Login", width: 150},
            {headerName: "Date de création", field: "CreationDate"},
            {headerName: "Date de mise à jour", field: "ModificationDate"},
            {headerName: "Editer",cellRenderer: function (params) { 
              return self.getBtn("edit"); 
            }, width: 100},
            {headerName: "Supprimer" ,cellRenderer: function (params) { 
              return self.getBtn("delete"); 
            }, width: 100}

            //,
            //{headerName: "Last Modification Date", field: "ModificationDate"}
            ];


            this.gridOptions = {
              columnDefs: this.columnDefs,
              rowSelection: 'single',
              rowData: this.rowData,
              rowSelection: 'multiple',
              enableColResize: true,
              enableSorting: true,
              enableFilter: true,
              debug: true,
              pageSize : 10,
              rowHeight: 40,
            //  rowModelType: 'pagination',
              rowBuffer: 10,
              //onSelectionChanged: self.onSelectionChanged

        };


    },
    getBtn : function(type){
      var element = document.createElement("span");
      var btn = document.createElement("button");

       if (type =='edit') {
        btn.className +=   "edit btn btn-success" ;
        element.className +=  "reneco reneco-edit";
         element.appendChild(document.createTextNode('Edit'));
      } else {
        btn.className +=   "btn btn-danger delete" ;
        element.className +=  "reneco reneco-trash";
      }
     btn.appendChild(element);
     return btn;
    },

    style: function() {
    },

    onShow: function() {
        var _this=this;
        $.get( config.coreUrl + 'userManagement', function( data ) {
            _this.gridOptions.rowData=data;
            console.log(data)
            _this.eGridDiv = document.querySelector('#myGrid');
            new agGrid.Grid(_this.eGridDiv, _this.gridOptions);
        });
    }
    ,
    onSelectionChanged : function(){
      var selectedRows = this.api.getSelectedRows();
      var id = selectedRows[0].PK_id;
      if(id) {
        alert(id);
      }
    },
    editUser : function(){
      var selectedRows = this.gridOptions.api.getSelectedRows();
      var id = selectedRows[0].PK_id;
      if(id) {
        Backbone.history.navigate('#users/' + id, { trigger: true });  
      }

    },
    deleteUser :  function(){
      var self= this;
      var selectedRows = this.gridOptions.api.getSelectedRows();
      var id = selectedRows[0].PK_id;
      if(id) {

          Swal({   title: "Suppression de compte",   
              text: "Etes vous sur(e) de bien vouloir supprimer ce compte utilisateur?",   
               type: 'warning',
               confirmButtonColor: "#DD6B55",
              showCancelButton: true,      
              confirmButtonText: "Oui",   
               }, function(){ 
                  var data = { method: 'delete', id : id };
                  var url = config.coreUrl + 'userDelete';
                  var request = $.post(url, data);
                  request.done(function(res){
                    if  (res=='ok') {
                      self.simpleSweetAlert('Suppression de compte','Compte utilisateur supprimé.','success');
                      self.gridOptions.api.updateRowData({remove: selectedRows});
                    }
                    
                  });
              }); 
      }
    },
    simpleSweetAlert : function(title, text,type){
      Swal({ title: title,   
        text: text,   
        type: type 
      });
    }
  })
  });