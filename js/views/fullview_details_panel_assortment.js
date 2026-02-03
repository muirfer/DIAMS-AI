(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Assortments logic in Product Full view
    var FVAssortment = {
        /**
         * Initializes the Assortment module.
         * Sets up event handlers and initializes DataTables.
         */
        initialize: function () {
            this.datatableInit();
            $(".assDesc").css("width", "60%")
        },
        /**
         * Initializes the DataTable for the Assortment table.
         * Handles table initialization, DOM manipulation, and DataTable configuration.
         */
        datatableInit: function () {
            $('.datatable-assort').dataTable({
                dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p'
            });
        },

        /**
         * Show more JDA
         */
        showMoreJDA: function () {
            if ($(".hCluster").is(":visible")) {
                $(".hCluster").hide(300);
                $("#expJdaIcon").removeClass("fa-chevron-up")
                $("#expJdaIcon").addClass("fa-chevron-down")
            } else {
                $(".hCluster").show(300);
                $("#expJdaIcon").removeClass("fa-chevron-down")
                $("#expJdaIcon").addClass("fa-chevron-up")
            }
        },

        /**
         * Switch assortment view
         */
        switchAssortmentView: function (tableId, showAll) {
            if (showAll) {
                //switch to 'all' view
                $('#' + tableId + ' tbody tr').show();
            } else {
                //switch to 'selected' view
                $('#' + tableId + ' tbody tr').each(function () {
                    if ($(this).find('input[type="checkbox"]').is(':checked')) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }
        },

        /**
         * Select all
         */
        selectAll: function (element) {
            const baseId = element.id.substring(0, 9);

            for (let i = 1; i < 40; i++) {
                elemToUpdate = $("#" + baseId + "_" + i);
                elemToUpdate.prop("checked", element.checked);
            }
        }
    };

    App.FVAssortment = FVAssortment;

})(jQuery);