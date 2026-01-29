(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Array to track selected rows/statuses
    var gSelected = [];

    // Module for handling GTIN Reservation Wizard logic
    var GtinReservation = {
        /**
         * Initializes the DataTable for the GTIN Reservation Wizard.
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
                dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p'
            });
        },

        /**
         * Filters the list of GTINs based on the selected status.
         * @param {string} sts - Status filter: 'all', 'aw' (Available), or 'ot' (In Use).
         */
        selectType: function (sts) {
            if (sts === "all") {
                $(".aw").show();
                $(".ot").show();
            } else if (sts === "aw") {
                $(".aw").show();
                $(".ot").hide();
            } else if (sts === "ot") {
                $(".aw").hide();
                $(".ot").show();
            }
        },

        /**
         * Navigates to the next step in the Wizard.
         * Handles tab switching and button visibility (Prev/Next/Finish).
         */
        goNext: function () {
            if ($('#opt1').hasClass('active')) {
                // Step 1 -> Step 2
                $('#opt2').addClass('active');
                $('#opt1').removeClass('active');
                $('#w1-element').addClass('active');
                $('#w1-type').removeClass('active');
                $(".previous").show();
            } else if ($('#opt2').hasClass('active')) {
                // Step 2 -> Step 3
                $('#opt3').addClass('active');
                $('#opt2').removeClass('active');
                $('#w1-details').addClass('active');
                $('#w1-element').removeClass('active');
                $(".next").hide();
                $(".finish").show();
            }
        },

        /**
         * Navigates back to the previous step in the Wizard.
         */
        goBack: function () {
            var backToStart = $('#opt2').hasClass('active');
            $(".finish").hide();

            if (backToStart) {
                // Step 2 -> Step 1
                $('#opt1').addClass('active');
                $('#opt2').removeClass('active');
                $('#w1-type').addClass('active');
                $('#w1-element').removeClass('active');
                $(".previous").hide();
            } else {
                // Step 3 -> Step 2
                $('#opt2').addClass('active');
                $('#opt3').removeClass('active');
                $('#w1-element').addClass('active');
                $('#w1-details').removeClass('active');
                $(".next").show();
            }
        },

        /**
         * Handles the completion of the reservation process.
         * Resets the wizard to the start.
         */
        onReserveCompleted: function () {
            this.goBack();
            this.goBack();
        },

        /**
         * Toggles selection of a Unit of Measure (UoM) button.
         * Changes button visual style (Primary <-> Default).
         * @param {HTMLElement} btn - The button clicked.
         */
        selectUoM: function (btn) {
            if ($(btn).hasClass("btn-primary")) {
                // Deselect
                $(btn).removeClass("btn-primary");
                $(btn).addClass("btn-default");
                return;
            }

            // Select
            $(btn).removeClass("btn-default");
            $(btn).addClass("btn-primary");
        },

        /**
         * Updates row background color based on selection status.
         * Manages the `gSelected` array to track availability status.
         * Updates visibility of 'Release' and 'Mark as Used' buttons.
         * @param {string} row - Row ID
         * @param {boolean} checked - Selection state
         * @param {number} status - Status code (1=Available, 2=In Use)
         */
        changeRowColor: function (row, checked, status) {
            var color = (checked) ? "aliceblue" : "white";
            $("#row" + row).css("backgroundColor", color);

            if (checked) {
                gSelected.push(status);
            } else {
                let indexToRemove = gSelected.indexOf(status);
                gSelected.splice(indexToRemove, 1);
            }

            if (gSelected.length === 0) {
                $("#btnMark").hide();
                $("#btnRel").hide();
            } else {
                // Check if all selected items are 'Available' (1)
                let allAvailable = gSelected.every(function (item) {
                    return item === 1;
                });

                // Check if all selected items are 'In Use' (2)
                let allInUse = gSelected.every(function (item) {
                    return item === 2;
                });

                if (allAvailable) {
                    $("#btnMark").show();
                    $("#btnRel").hide();
                } else if (allInUse) {
                    $("#btnMark").hide();
                    $("#btnRel").show();
                } else {
                    // Mixed selection, hide actions
                    $("#btnMark").hide();
                    $("#btnRel").hide();
                }
            }
        },

        /**
         * Toggles between 'Average weight' and 'Others' brand types.
         * Ensures mutually exclusive selection.
         */
        toggleBrandType: function (btn, otherBtnId) {
            if ($(btn).hasClass("btn-default")) {
                $(btn).removeClass("btn-default");
                $(btn).addClass("btn-primary");
                $("#" + otherBtnId).removeClass("btn-primary");
                $("#" + otherBtnId).addClass("btn-default");
            }
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

    App.GtinReservation = GtinReservation;

})(jQuery);
