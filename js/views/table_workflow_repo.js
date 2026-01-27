/*
Name: 			Tables / Advanced - Examples
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version: 	3.0.0
*/

(function ($) {

	'use strict';

	var datatableInit = function () {
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
	};

	$(function () {
		datatableInit();
	});

}).apply(this, [jQuery]);