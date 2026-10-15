(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Basic data logic in Product Full view
    var FVBasicData = {
        /**
         * Initializes the Basic data module.
         * Sets up event handlers and initializes DataTables.
         */
        initialize: function () {
            console.log("init!")
            this.datatableInit();
        },

        /**
         * Initializes the DataTable for the Basic data descriptions table.
         * Handles table initialization and DataTable configuration.
         */
        datatableInit: function () {
            var $table = $('#datatable-desc');

            if ($.fn.DataTable.isDataTable($table)) {
                $table.DataTable().destroy();
            }

            $table.css('width', '100%');

            $table.dataTable({
                dom: 't',
                paging: false,
                searching: false,
                info: false,
                ordering: true,
                order: [],
                autoWidth: false,
                columnDefs: [
                    {
                        orderable: false,
                        targets: [3, 4]
                    }
                ]
            });
        }
    };

    App.FVBasicData = FVBasicData;

})(jQuery);