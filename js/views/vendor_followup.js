(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Vendor Follow-up logic
    var VendorFollowUp = {
        /**
         * Initializes the Vendor Follow-up module.
         * Sets up event handlers and initializes DataTables.
         */
        initialize: function () {
            this.datatableInit();
        },
        /**
         * Initializes the DataTable for the Vendor Follow-up table.
         * Handles table initialization, DOM manipulation, and DataTable configuration.
         */
        datatableInit: function () {
            var $table = $('#datatable-default');

            if ($.fn.DataTable.isDataTable($table)) {
                $table.DataTable().destroy();
            }

            $table.on('init.dt', function () {
                var $wrapper = $table.closest('.dataTables_wrapper');

                // Filter
                var $filter = $wrapper.find('.dataTables_filter');
                $filter.parent().removeClass("col-lg-6").addClass("col-lg-12");
                $filter.css("text-align", "right");
                $('#searchDiv').append($filter.detach());

                // Length
                var $len = $wrapper.find('.dataTables_length');
                var $select = $len.find('select');

                // Move and re-init Select2
                $select.detach().show().addClass("custom-select form-control");
                $('#divPag').append($select);

                if ($.isFunction($.fn['select2'])) {
                    $select.select2({
                        theme: 'bootstrap',
                        minimumResultsForSearch: -1
                    });
                }

                // Remove original container (Row)
                $len.parent().parent().remove();

                // Pagination
                var $pag = $wrapper.find('.paging_simple_numbers');
                $('#fPag').append($pag.detach());
            });

            $table.dataTable({
                dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p'
            });
        },

        // Helper methods for data operations (Placeholders)
        getItems: function () {
            console.log("getItems called - Refreshing data...");
        },

        clearFilters: function () {
            console.log("clearFilters called - Resetting filters...");
        },

        exportExcel: function () {
            console.log("exportExcel called - Downloading report...");
        }

    };

    App.VendorFollowUp = VendorFollowUp;

})(jQuery);
