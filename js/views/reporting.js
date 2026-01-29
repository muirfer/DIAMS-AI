(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    const berDetails = '{"status": "error","message": "Failed to save data in the database","error_code": 500,"error_details": "Database connection timed out"}';

    // Module for handling Reporting logic
    var Reporting = {
        /**
         * Initializes the DataTable for the Reporting table.
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
        },

        displayJson: function () {
            /*
            for (var key in berDetails) {
                if (berDetails.hasOwnProperty(key)) {
                    var value = berDetails[key];
                    var valueType = typeof value;

                    var container = document.createElement('div');
                    container.innerHTML = '<strong>' + key + ':</strong> ';

                    if (valueType === 'object') {
                        var childContainer = document.createElement('div');
                        container.appendChild(childContainer);
                        displayJson(value, childContainer);
                    } else if (valueType === 'array') {
                        var list = document.createElement('ul');
                        container.appendChild(list);
                        for (var i = 0; i < value.length; i++) {
                            var listItem = document.createElement('li');
                            list.appendChild(listItem);
                            displayJson(value[i], listItem);
                        }
                    } else {
                        container.innerHTML += value;
                    }

                    document.getElementById('output').appendChild(container);
                }
            }*/

            setTimeout(function () {
                var $textarea = $('#codemirror_js_code');
                var editor = $textarea.data('CodeMirrorInstance');

                // Try to find instance if not saved manually (e.g. initialized by theme.js)
                if (!editor && $textarea.next('.CodeMirror').length) {
                    editor = $textarea.next('.CodeMirror')[0].CodeMirror;
                }

                if (editor) {
                    editor.refresh();
                }
            }, 200); // Small delay to allow modal to open/animate
        }

    };

    App.Reporting = Reporting;

})(jQuery);
