(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Array to track selected rows/statuses
    App.MessageTypes = [
        { id: 1, type: "btn-primary" },
        { id: 2, type: "btn-warning" },
        { id: 3, type: "btn-danger" }
    ];

    // Module for handling Message Support logic
    var SupportMessage = {
        /**
         * Initializes the Message Support module.
         * Sets up event handlers and initializes DataTables.
         */
        initialize: function () {
            this.datatableInit();
        },
        /**
         * Initializes the DataTable for the Message Support.
         * Handles DataTable initialization, including customizing the table layout,
         * adding search functionality, and setting up pagination.
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
                dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p',
                aaSorting: [
                    [5, 'desc']
                ]
            });
        },

        /**
         * Toggles selection of a message type button.
         * Changes button visual style (Primary <-> Default).
         * @param {HTMLElement} btn - The button clicked.
         */
        selectMessageType: function (btn, btnId) {
            let level = App.MessageTypes.find(item => item.id === btnId);

            //update buttons
            $(".btnPR").removeClass("btn-primary btn-warning btn-danger");
            $(".btnPR").addClass("btn-default");
            $(".btnPR").css("color", "black");
            $(btn).addClass(level.type);
            $(btn).css("color", "white");
        },

        /**
         * Show or hide section per OpCo to select 
         * roles to display if not for everyone.
         */
        displayToAll: function () {
            if ($("#chkAll").is(':checked')) {
                $("#accordion3").hide();
            } else {
                $("#accordion3").show();
            }
        },

        /**
         * SElect / unselect all for opco
         */
        selectAllForOpCo: function (chkId, chkClass) {
            if ($("#" + chkId).is(':checked')) {
                $("." + chkClass).prop("checked", true);
            } else {
                $("." + chkClass).prop("checked", false);
            }
        },

        onNoDateNeeded: function (classToUpdate) {
            let fieldToCheck = classToUpdate === "edate" ? "#checkboxDT" : "#checkboxDF"
            if ($(fieldToCheck).is(':checked')) {
                $("." + classToUpdate).attr("disabled", true);
                $("." + classToUpdate).attr("readonly", true);
                $("." + classToUpdate).val("");
            } else {
                $("." + classToUpdate).removeAttr("disabled");
                $("." + classToUpdate).removeAttr("readonly");
            }
        },

        // Helper methods for data operations (Placeholders)
        getItems: function () {
            console.log("getItems called - Refreshing data...");
        },

        clearFilters: function () {
            console.log("clearFilters called - Resetting filters...");
        }
    };

    App.SupportMessage = SupportMessage;

})(jQuery);
