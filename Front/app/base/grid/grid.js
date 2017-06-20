

define(['marionette', 'backbone', 'sha1', 'config', 'jqueryui', 'sweetAlert','agGrid','i18n'],
    function(Marionette, Backbone, JsSHA, config, $ui,Swal,agGrid,i18n) {
      'use strict';
      return Marionette.LayoutView.extend({
        template: 'app/base/grid/tpl/tpl-grid.html',
        className: 'full-height',

        ui: {
            'grid':'#myGrid'
        },

        initialize: function() {
            this.columnDefs = [
            {headerName: "ID", field: "PK_id"},
            {headerName: "Login", field: "Login"},
            {headerName: "Lastname", field: "Last Name"},
            {headerName: "Firstname", field: "First Name"},
            {headerName: "Creation Date", field: "CreationDate"},
            {headerName: "Last Modification Date", field: "ModificationDate"}
            ];


            this.gridOptions = {
              columnDefs: this.columnDefs,
              rowData: this.rowData,
              rowSelection: 'multiple',
              enableColResize: true,
              enableSorting: true,
              enableFilter: true,
              enableRangeSelection: true,
              suppressRowClickSelection: true,
              debug: true,
              pageSize : 10,
              rowHeight: 30,
            //  rowModelType: 'pagination',
            rowBuffer: 10,

        };


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


}
)
  }
  )
;