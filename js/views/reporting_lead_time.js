(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Reporting Leadtime logic
    var ReportingLT = {
        /**
         * Initializes the DataTable for the Reporting Leadtime main table.
         * Handles table initialization, DOM manipulation, and DataTable configuration.
         */
        datatableMainInit: function () {
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
         * Initializes the DataTable for the Reporting Leadtime details table.
         * Handles table initialization, DOM manipulation, and DataTable configuration.
         */
        datatableDetailsInit: function () {
            var $table = $('#datatable-details-2');

            // format function for row details
            var fnFormatDetails = function (datatable, tr) {
                var data = datatable.fnGetData(tr);

                return [
                    '<table class="table table-responsive-md table-sm mb-0 table-hover">',
                    '<tbody>',
                    '<tr>',
                    '<td colspan="2" style="text-align: center;">GDSN</td>',
                    '<td style="text-align: right;color: darkgreen;">4,97</td>',
                    '</tr>',
                    '<tr>',
                    '<td colspan="2" style="text-align: center;">VI</td>',
                    '<td style="text-align: right;color: darkgreen;">1,94</td>',
                    '</tr>',
                    '<tr>',
                    '<td colspan="2" style="text-align: center;">VC</td>',
                    '<td style="text-align: right;color: darkgreen;">4,58</td>',
                    '</tr>',
                    '</tbody>',
                    '</table>'
                ].join('');
            };

            // insert the expand/collapse column
            var th = document.createElement('th');
            var td = document.createElement('td');
            td.innerHTML = '<i data-toggle class="far fa-plus-square text-primary h5 m-0" style="cursor: pointer;font-size: small"></i>';
            td.className = "text-center";
            td.style = 'padding-left:0px;padding-right:0px';

            $table
                .find('thead tr').each(function () {
                    this.insertBefore(th, this.childNodes[0]);
                });

            $table
                .find('tbody tr').each(function () {
                    this.insertBefore(td.cloneNode(true), this.childNodes[0]);
                });


            // initialize
            var datatable = $table.dataTable({
                dom: '<"row"<"col-lg-12"l><"col-lg-12"f>><"table-responsive"t>p',
                aoColumnDefs: [{
                    bSortable: false,
                    aTargets: [0]
                }],
                // aaSorting: [
                // 	[1, 'asc']
                // ]
            });

            // add a listener
            $table.on('click', 'i[data-toggle]', function () {
                var $this = $(this),
                    tr = $(this).closest('tr').get(0);

                if (datatable.fnIsOpen(tr)) {
                    $this.removeClass('fa-minus-square').addClass('fa-plus-square');
                    datatable.fnClose(tr);
                } else {
                    $this.removeClass('fa-plus-square').addClass('fa-minus-square');
                    datatable.fnOpen(tr, fnFormatDetails(datatable, tr), 'details');
                }
            });

            //finalize
            $("#datatable-details-2_wrapper div").first().css("display", "none");
            $("#datatable-details-2_paginate").css("display", "none");
        }
    };

    App.ReportingLT = ReportingLT;

})(jQuery);
