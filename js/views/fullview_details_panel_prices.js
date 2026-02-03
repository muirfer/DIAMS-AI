(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Prices logic in Full view details panel
    var FVPrices = {
        /**
         * Initializes the Prices module.
         * Sets up event handlers and initializes DataTables.
         */
        initialize: function () {
            this.datatablePDateInit();
            this.datatablePSalesInit();
            this.datatablePSalesHistoryInit();
        },
        /**
         * Initializes the DataTable for the Prices per date main table.
         * Handles table initialization, DOM manipulation, and DataTable configuration.
         */
        datatablePDateInit: function () {
            $('#datatable-pdate').dataTable({
                dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p',
                aaSorting: [
                    [0, 'asc']
                ]
            });

            $("#datatable-pdate_length").parent().remove();
            $("#datatable-pdate_filter").parent().remove();
            $("#headerPrices").css("width", "20%")
            // $(".dataTables_filter").parent().removeClass("col-lg-6");
            // $(".dataTables_filter").parent().addClass("col-lg-12");
            // $(".dataTables_filter").css("text-align","left")

            $("[data-date='1721260800000']").addClass("hdate");
            $("[data-date='1721692800000']").addClass("hdate");
            $("[data-date='1722124800000']").addClass("hdate");
            $("[data-date='1722384000000']").addClass("hdate");
            $("[data-date='1722729600000']").addClass("hdate");
        },
        /**
         * Initializes the DataTable for the Sales prices details table.
         * Handles table initialization, DOM manipulation, and DataTable configuration.
         */
        datatablePSalesInit: function () {
            $('#datatable-psales').dataTable({
                dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p'
            });

            $("#datatable-psales_length").parent().remove();
            //		$("#datatable-psales_filter").parent().remove();
            var element = $('#datatable-psales_filter').detach();
            $('#searchSalesDiv').append(element);


            $("#psales_t1").css("width", "12%")
            $("#psales_t2").css("width", "30%")
            $("#psales_t3").css("width", "11%")
            $("#psales_t3_1").css("width", "11%")
            $("#psales_t4").css("width", "11%")
            $("#psales_t5").css("width", "11%")
            $("#psales_t6").css("width", "11%")
        },
        /**
         * Initializes the DataTable for the Sales prices history table.
         * Handles table initialization, DOM manipulation, and DataTable configuration.
         */
        datatablePSalesHistoryInit: function () {
            $('#datatable-psalesh').dataTable({
                dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p'
            });

            $("#datatable-psalesh_length").parent().remove();
            $("#datatable-psalesh_filter").parent().remove();
        },
        /**
         * Shows more details for a specific price condition type.
         * Toggles the visibility of the price condition type details and updates the icon.
         * @param {string} cTypeId - The ID of the price condition type.
         */
        showMoreForPriceConditionType: function (cTypeId) {
            let cType = ".c" + cTypeId;
            let iconId = "#expPsIcon" + cTypeId;

            if ($(cType).is(":visible")) {
                $(cType).hide(300);
                $(iconId).removeClass("fa-chevron-up")
                $(iconId).addClass("fa-chevron-down")
            } else {
                $(cType).show(300);
                $(iconId).removeClass("fa-chevron-down")
                $(iconId).addClass("fa-chevron-up")
            }
        },
        /**
         * Sets the selected price date.
         * Removes the active class from all data-date elements and adds it to the specified date element.
         * @param {string} dateId - The ID of the date to set as active.
         */
        setPriceDateSelected: function (dateId) {
            $("[data-date]").removeClass("active");
            $("[data-date='" + dateId + "']").addClass("active");
        },
        /**
         * Handles the closing of the price date modal.
         */
        onClosePriceDate: function () {

        },
        /**
         * Switches the sales price history input from range to dates.
         */
        switchSalesPriceDateInput: function () {
            $("#selSalesPriceHistoryRange").hide();
            $("#selSalesPriceHistoryDates").show();
        },
        /**
         * Switches the sales price history input from dates to range.
         */
        switchToSalesPriceRange: function () {
            $("#selSalesPriceHistoryRange").show();
            $("#selSalesPriceHistoryDates").hide();
        },
        /**
         * Shows the sales price history.
         * Displays the sales price history details with a smooth animation.
         */
        showSalesPriceHistory: function () {
            $(".h_details").show(500);
        }
    };

    App.FVPrices = FVPrices;

})(jQuery);