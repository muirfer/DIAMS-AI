(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Reporting Leadtime logic
    var CreationArticleList = {
        /**
         * Initializes the Article List module.
         * Sets up event handlers and initializes DataTables.
         */
        initialize: function () {
            this.datatableCreationInit();
            this.datatableUpdateInit();

            $(".teamT").hide();
        },
        /**
         * Initializes the DataTable for the Article List main table.
         * Handles table initialization, DOM manipulation, and DataTable configuration.
         */
        datatableCreationInit: function () {
            var $table = $('#datatable-cr');

            if ($.fn.DataTable.isDataTable($table)) {
                $table.DataTable().destroy();
            }

            $table.on('init.dt', function () {
                var $wrapper = $table.closest('.dataTables_wrapper');

                // Filter
                var $filter = $wrapper.find('.dataTables_filter');
                $filter.parent().removeClass("col-lg-6").addClass("col-lg-12");
                $filter.css("text-align", "right");
                var $searchWrapper = $('<div id="search-cr"></div>').append($filter.detach());
                $('#searchDiv').append($searchWrapper);

                // Length
                var $len = $wrapper.find('.dataTables_length');
                var $select = $len.find('select');

                $select.detach().show().addClass("custom-select form-control");
                var $pagWrapper = $('<div id="pag-cr"></div>').append($select);
                $('#divPag').append($pagWrapper);

                if ($.isFunction($.fn['select2'])) {
                    $select.select2({
                        theme: 'bootstrap',
                        minimumResultsForSearch: -1
                    });
                }

                // Remove original container
                $len.parent().parent().remove();

                // Pagination
                var $pag = $wrapper.find('.paging_simple_numbers');
                var $pagWrapper = $('<div id="pagination-cr"></div>').append($pag.detach());
                $('#fPag').append($pagWrapper);
            });

            $table.dataTable({
                dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p'
            });

            $("#cr1").css("width", "5%")
            $("#cr2").css("width", "5%")
            $("#cr3").css("width", "20%")
            $("#cr4").css("width", "15%")
            $("#cr5").css("width", "15%")
            $("#cr6").css("width", "9%")
            $("#cr7").css("width", "7%")
            $("#cr8").css("width", "10%")
            $("#cr9").css("width", "5%")
            $("#cr10").css("width", "5%")
            $("#cr11").css("width", "4%")
        },
        /**
         * Initializes the DataTable for the Article List update table.
         * Handles table initialization, DOM manipulation, and DataTable configuration.
         */
        datatableUpdateInit: function () {
            var $table = $('#datatable-up');

            if ($.fn.DataTable.isDataTable($table)) {
                $table.DataTable().destroy();
            }

            $table.on('init.dt', function () {
                var $wrapper = $table.closest('.dataTables_wrapper');

                // Filter
                var $filter = $wrapper.find('.dataTables_filter');
                $filter.parent().removeClass("col-lg-6").addClass("col-lg-12");
                $filter.css("text-align", "right");
                var $searchWrapper = $('<div id="search-up" style="display:none"></div>').append($filter.detach());
                $('#searchDiv').append($searchWrapper);

                // Length
                var $len = $wrapper.find('.dataTables_length');
                var $select = $len.find('select');

                $select.detach().show().addClass("custom-select form-control");
                var $pagWrapper = $('<div id="pag-up" style="display:none"></div>').append($select);
                $('#divPag').append($pagWrapper);

                if ($.isFunction($.fn['select2'])) {
                    $select.select2({
                        theme: 'bootstrap',
                        minimumResultsForSearch: -1
                    });
                }

                // Remove original container
                $len.parent().parent().remove();

                // Pagination
                var $pag = $wrapper.find('.paging_simple_numbers');
                var $pagWrapper = $('<div id="pagination-up" style="display:none"></div>').append($pag.detach());
                $('#fPag').append($pagWrapper);
            });

            $table.dataTable({
                dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p'
            });

            $("#c1").css("width", "5%")
            $("#c1a").css("width", "5%")
            $("#c2").css("width", "19%")
            $("#c3").css("width", "16%")
            $("#c4").css("width", "12%")
            $("#c5").css("width", "13%")
            $("#c6").css("width", "15%")
            $("#c7").css("width", "8%")
            $("#c8").css("width", "3%")
            $("#c9").css("width", "2%")
            $("#c10").css("width", "2%")
        },
        /**
         * Filters by status of the product.
         * @param {string} sts - The status to select.
         */
        selectStatus: function (sts) {
            if (sts === "all") {
                $(".sts1").show();
                $(".sts2").show();
            } else if (sts === "av") {
                $(".sts1").show();
                $(".sts2").hide();
            } else if (sts === "us") {
                $(".sts1").hide();
                $(".sts2").show();
            }
        },
        /**
         * Switches between my tasks and all tasks.
         * @param {boolean} myTasks - true for my tasks, false for all tasks.
         */
        openMyTasks: function (myTasks) {
            if (myTasks) {
                $("#btnMyTasks").addClass("btn-success")
                $("#btnTasks").removeClass("btn-success")
                $("#countC").text("3")
                $("#countU").text("2")
                $(".teamT").hide()
            } else {
                $("#btnMyTasks").removeClass("btn-success")
                $("#btnTasks").addClass("btn-success")
                $("#countC").text("5")
                $("#countU").text("6")
                $(".teamT").show()
            }
        },
        /**
         * Switches between create and update tasks.
         * @param {boolean} cTasks - true for create tasks, false for update tasks.
         */
        openCreationTasks: function (cTasks) {
            if (cTasks) {
                $("#btnCTasks").addClass("btn-info")
                $("#btnUTasks").removeClass("btn-info")
                $(".oCreate").show()
                $(".oUpdate").hide()
                $("#datatable-cr").show()
                $("#datatable-up").hide()
                $("#pag-cr").show()
                $("#pag-up").hide()
                $("#search-cr").show()
                $("#search-up").hide()
                $("#pagination-cr").show()
                $("#pagination-up").hide()

            } else {
                $("#btnCTasks").removeClass("btn-info")
                $("#btnUTasks").addClass("btn-info")
                $(".oCreate").hide()
                $(".oUpdate").show()
                $("#datatable-cr").hide()
                $("#datatable-up").show()
                $("#pag-cr").hide()
                $("#pag-up").show()
                $("#search-cr").hide()
                $("#search-up").show()
                $("#pagination-cr").hide()
                $("#pagination-up").show()
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

    App.CreationArticleList = CreationArticleList;

})(jQuery);
