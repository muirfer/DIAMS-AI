(function ($) {
	'use strict';

	// Ensure global App namespace exists
	window.App = window.App || {};

	// Module for handling Full view search logic
	var FullViewSearch = {
		// State variables
		advancedMode: false,
		inputFields: ["#txtHope", "#txtSapId", "#txtGtin"],

		/**
		 * Initialize the view
		 */
		initialize: function () {
			this.initInlineEvents();
			this.datatableInit();

			//init background color
			$("#mainSection").css("background", "white");
			$('.multiselect-native-select .btn-group').css("width", "100%");
			$('.multiselect-container').css("width", "100%");
			$("#txtHope").focus();
		},

		/**
		 * Initialize the inline events
		 */
		initInlineEvents: function () {
			var self = this;

			//restrict multiselect searches
			$(".msel").on('change', function () {
				var selectedCount = $(this).find('option:selected').length;

				// Enable all options if below the limit
				if (selectedCount > 3) {
					$(this).next('.btn-group').find('button').addClass("selError");

				} else {
					$(this).next('.btn-group').find('button').removeClass("selError");
				}

				self.updateSeachButton();
			});

			// Add a keyup event listener to each field
			this.inputFields.forEach(function (fieldId) {
				$(fieldId).keyup(function () {
					// Clear the value of other fields
					self.inputFields.forEach(function (otherFieldId) {
						if (otherFieldId !== fieldId) {
							$(otherFieldId).val("");
						}
					});
				});
			});

			// Attach an event listener for the "change" event
			$('#txtProd').on('keyup', function () {
				// Get the value of the input field
				var inputValue = $(this).val();

				// Check if the length of the input value is at least 3 characters
				if (inputValue.length >= 3 || inputValue.length === 0) {
					$(this).removeClass("selError");
				} else {
					$(this).addClass("selError");
				}

				self.updateSeachButton();
			});


		},
		/**
		 * Initializes the DataTable for the Full view search.
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

		/**
		 * Updates the search button state based on the number of active filters.
		 * Enables the search button if there are active filters, otherwise disables it.
		 */
		updateSeachButton: function () {
			if ($('.selError').length > 0) {
				//disable
				$('#btnSearch').prop('disabled', true);
			} else {
				$('#btnSearch').prop('disabled', this.getFilterCount() === 0);
			}
		},

		/**
		 * Gets the total number of active filters.
		 * @returns {number} The count of active filters.
		 */
		getFilterCount: function () {
			let filters = 0;

			if ($('li').hasClass('active')) {
				filters++;
			}

			if ($("#txtProd").val().length > 0) {
				filters++;
			}

			if ($("#txtSup").val().length > 0) {
				filters++;
			}

			return filters;
		},

		/**
		 * Handles the search button click event.
		 * Shows the results table and hides the filter bar.
		 * If there is only one active filter, shows the "Too many results" section.
		 */
		onSearchClick: function () {
			$("#tResults").show();
			$("#filterBar").removeClass("active");
			$("#filterBar .toggle-content").hide();

			if (this.getFilterCount() === 1) {
				$("#sectionTooManyResults").show();
			} else {
				$("#sectionTooManyResults").hide();
			}
		},

		/**
		 * Handles the advanced button click event.
		 * Toggles between basic and advanced search modes.
		 */
		onAdvancedClick: function () {
			if (!this.advancedMode) {
				//go to advanced mode
				$("#btnSwitch").html("Switch to Direct access");
				$("#sBasic").hide();
				$("#sAdv").show();
			} else {
				//go to basic mode
				$("#btnSwitch").html("Switch to Advanced search");
				$("#sBasic").show();
				$("#sAdv").hide();
			}

			this.advancedMode = !this.advancedMode;
		},

		/**
		 * Handles the purchase group selection event.
		 * Unselects any previously selected checkboxes and updates the UI based on the selected country.
		 */
		onSelectPurchaseGroup: function () {
			var selectedCountry = $(this).val();

			// Unselect any previously selected checkboxes
			$("#pgDiv ul.multiselect-container.dropdown-menu li:not(.multiselect-group)").find("input[type='checkbox']").prop("checked", false);

			$("#pgDiv .multiselect-selected-text").html("None selected");

			$("#pgDiv .msel optgroup option").prop("selected", false);

			if (selectedCountry === "BE") {
				// Replace first LI label with "Belgium"
				$("#pgDiv ul.multiselect-container.dropdown-menu li.multiselect-group").find("b").text("Belgium");

				// Replace first letter of label with "B" for all other LI elements
				$("#pgDiv ul.multiselect-container.dropdown-menu li:not(.multiselect-group)").each(function () {
					$(this).removeClass("active")

					var label = $(this).find("a.dropdown-item label.checkbox");
					var currentTitle = label.attr("title");
					label.attr("title", "B" + currentTitle.substring(1));
					label.html("<input type='checkbox' value='B" + currentTitle.substring(1, 3) + "'>" + "B" + currentTitle.substring(1) + "</input>")
				});
			} else if (selectedCountry === "LU") {
				// Replace first LI label with "Luxembourg"
				$("#pgDiv ul.multiselect-container.dropdown-menu li.multiselect-group").find("b").text("Luxembourg");

				// Replace first letter of label with "L" for all other LI elements
				$("#pgDiv ul.multiselect-container.dropdown-menu li:not(.multiselect-group)").each(function () {
					$(this).removeClass("active")
					var label = $(this).find("a.dropdown-item label.checkbox");
					var currentTitle = label.attr("title");
					label.attr("title", "L" + currentTitle.substring(1));
					label.html("<input type='checkbox' value='B" + currentTitle.substring(1, 3) + "'>" + "L" + currentTitle.substring(1) + "</input>")
				});
			}
		},
	};

	App.FullViewSearch = FullViewSearch;

})(jQuery);