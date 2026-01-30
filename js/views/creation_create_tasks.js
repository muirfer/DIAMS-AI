(function ($) {

	'use strict';

	// Ensure global App namespace exists
	window.App = window.App || {};

	var CreationCreateTasks = {

		// State variables
		isSingleSelection: true,
		tableCount: 0,
		invalidGtinForSingleTest: "12345678901234",
		modeGtinInput: true,
		reserveGtinsFor: [],

		/**
		 * Initialize the view
		 */
		initialize: function () {
			this.initInlineEvents();
			this.initDatatable();
		},

		/**
		 * Initialize the datatable
		 */
		initDatatable: function () {
			var $table = $('#datatable-gi');

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

				$select.detach().show().addClass("custom-select form-control");
				$('#divPag').append($select);

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
				$('#fPag').append($pag.detach());
			});

			$table.dataTable({
				dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p'
			});

			$("#thStatus").css("width", "5%");
			$("#thGtin").css("width", "25%");
			$("#thProcess").css("width", "18%");
			$("#thMes").css("width", "37%");
			$("#thActions").css("width", "15%");

			$('#datatable-gi').DataTable().page.len(6).draw();
		},

		/**
		 * Initialize the inline events
		 */
		initInlineEvents: function () {
			var self = this;
			$("#mainSection").css("background", "white");

			$("#gtinInput").on('keyup', function (e) {
				e.stopPropagation();
				e.preventDefault();

				if (e.key === 'Enter' || e.keyCode === 13) {
					self.pasteSingleGtin();
				}

				return false;
			});

			$("#supInput").on('keyup', function (e) {
				e.stopPropagation();
				e.preventDefault();

				if (e.key === 'Enter' || e.keyCode === 13) {
					$('.supRow:hidden').first().show();
					$("#panelSupplierDetails").show();

					if ($(".supRegInfoPanel").is(":visible")) {
						//means that a non-regular supplier was entered
						$(".supNoRegInfoPanel").show();
						$('.lblOtherSup:hidden').first().show();
					} else {
						$(".supRegInfoPanel").show();
					}

					$("#supInput").val("");
					$("#supInput").focus();
				}

				return false;
			});


			var gtinInput = document.getElementById('gtinInput');
			if (gtinInput) {
				gtinInput.addEventListener('paste', function (e) {
					self.handlePaste(e);
				});
			}
			$("#gtinInput").removeAttr("maxLength");

			document.addEventListener('keydown', function (event) {
				if (event.keyCode === 13) {
					event.preventDefault();
					event.stopPropagation();
				}
			});

			$(".main-panel").css("height", "calc(90vh - " + $(".main-panel").offset().top + "px)");
		},

		/**
		 * Convert TSV string to array
		 * @param {string} data 
		 * @returns {Array}
		 */
		tsvStringToArray: function (data) {
			const re = /(\t|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^\t\r\n]*))/gi;
			const result = [[]];
			let matches;
			while ((matches = re.exec(data))) {
				if (matches[1].length && matches[1] !== "\t") result.push([]);
				result[result.length - 1].push(
					matches[2] !== undefined ? matches[2].replace(/""/g, '"') : matches[3]
				);
			}
			//console.log(result);
			return result;
		},

		/**
		 * Handle paste event
		 * @param {Event} e 
		 */
		handlePaste: function (e) {
			var clipboardData, pastedData;

			// Stop data actually being pasted into div
			e.stopPropagation();
			e.preventDefault();

			// Get pasted data via clipboard API
			clipboardData = e.clipboardData || window.clipboardData;
			pastedData = clipboardData.getData('Text');

			// Do whatever with pasteddata                
			var gtinArray = this.tsvStringToArray(pastedData);
			if (gtinArray.length > 1) {
				//paste all
				this.pasteGtins();
			} else {
				this.pasteSingleGtin();
			}

			this.doOnGtinListUpdate();
		},

		/**
		 * Handle paste from button event
		 */
		handlePasteFromButton: function () {
			//paste all
			// $('.gtinRow').show();
			// $("#panelMassValidation").show();   
			// $("#gtinInput").focus();

			this.pasteGtins();
		},
		/**	 */
		doOnGtinListUpdate: function () {
			//$("#fPag").css("display",tableCount > 5 ? "block" : "none");              
		},

		/**
		 * Toggle brand type
		 * @param {HTMLElement} btn 
		 * @param {string} otherBtnId 
		 */
		toogleBrandType: function (btn, otherBtnId) {

			if ($(btn).hasClass("btn-default")) {
				//switch back to default
				$(btn).removeClass("btn-default");
				$(btn).addClass("btn-primary");
				$("#" + otherBtnId).removeClass("btn-primary");
				$("#" + otherBtnId).addClass("btn-default");
			}

			//update UoM                
			if (otherBtnId === "btnN1") {
				//Active one is D1
				$("#lblBrandType").text("D1 - Delhaize");
				$("#btnNext_res").show();
			} else {
				//Active one is N1
				$("#lblBrandType").text("N1 - National");
				$("#btnNext_res").hide();
			}
		},

		/**
		 * Toggle GDSN type
		 * @param {HTMLElement} btn 
		 * @param {string} otherBtnId 
		 */
		toogleGDSNType: function (btn, otherBtnId) {

			if ($(btn).hasClass("btn-default")) {
				//switch back to default
				$(btn).removeClass("btn-default");
				$(btn).addClass("btn-primary");
				$("#" + otherBtnId).removeClass("btn-primary");
				$("#" + otherBtnId).addClass("btn-default");
			}

			//update UoM                
			if (otherBtnId === "btnGS1") {
				//Active one is No-GDSN
				$("#lblType").text("Manual");
				$(".nonGdsn").show();
				$(".panelGDSNReason").show();
				this.onNonGDSNReasonChange();

			} else {
				$("#lblType").text("GDSN");
				$(".nonGdsn").hide();
				$(".panelGDSNReason").hide();
				$(".panelGDSNReasonJust").hide();
			}

			this.resetReservationPanel();
			this.toogleGtinType($("#btnOT"), "btnAW");

		},

		/**
		 * Toggle GDSN type
		 * @param {HTMLElement} btn 
		 * @param {string} otherBtnId 
		 */
		toogleGtinType: function (btn, otherBtnId) {

			if ($(btn).hasClass("btn-default")) {
				//switch back to default
				$(btn).removeClass("btn-default");
				$(btn).addClass("btn-primary");
				$("#" + otherBtnId).removeClass("btn-primary");
				$("#" + otherBtnId).addClass("btn-default");
			}

			//update UoM                
			if (otherBtnId === "btnAW") {
				//Active one is Others
				$("#lblGtinType").text("Others");

				//prepare reserve panel
				$("#btnKG").hide();
				$("#btnEA").show();
				$("#btnEA").addClass("btn-default");
				$("#btnEA").addClass("btn-primary");
				$("#btnEA_alt").hide();

			} else {
				//Active one is Average weight
				$("#lblGtinType").text("Average weight");

				//prepare reserve panel
				$("#btnEA").hide();
				$("#btnKG").show();
				$("#btnKG").addClass("btn-default");
				$("#btnKG").addClass("btn-primary");
				$("#btnEA_alt").show();
			}

			//force ip toogle to reevaluate it
			this.toogleIP();

			//always show alt UoM
			$(".pUoM").show();
		},

		/**
		 * Toggle IP
		 */
		toogleIP: function () {
			var includesIP = $($("#chkIp")).is(':checked');

			if (includesIP) {
				$("#lblGtinType").append(" (IP included)");
				$("#btnIP_alt").show();
			} else {
				$("#lblGtinType").text($("#lblGtinType").text().replaceAll(" (IP included)", ""));
				$("#btnIP_alt").hide();
			}

		},

		/**
		 * Handle non-GDSN reason change
		 */
		onNonGDSNReasonChange: function () {
			var val = $("#selReason").val();

			$("#lblNonGdsnReason").text(val);
			if (val === "Other") {
				$(".panelGDSNReasonJust").show();
				$("#lblNonGdsnReasonJust").show();
			} else {
				$(".panelGDSNReasonJust").hide();
				$("#lblNonGdsnReasonJust").hide();
			}
		},

		/**
		 * Handle non-GDSN reason justification update
		 * @param {string} value 
		 */
		onNonGDSNReasonJustificationUpdated: function (value) {
			$("#lblNonGdsnReasonJust").text(value);
		},

		/**
		 * Toggle GDSN type
		 * @param {boolean} toInputMode 
		 */
		toGtinInput: function (toInputMode) {

			if (toInputMode) {
				$("#panelGtinInput").show();
				$("#panelGtinRes").hide();
				$("#lblTitleGtin").text("GTINs for creation");
				$("#lblGtinInput").text("-");
				$(".gtinInputPanel2").show();
				this.removeAllGtins();

			} else {
				//reserve gtin
				$("#panelGtinInput").hide();
				$(".gtinInputPanel2").hide();
				$("#panelGtinRes").show();
				$("#lblTitleGtin").text("Reserve GTINs for");

				var isGDSNFlow = $("#btnGS1").hasClass("btn-primary");
				if (isGDSNFlow) {
					this.reserveGtinsFor = [];
					this.resetReservationPanel();
				} else if ($("#lblGtinType").text().indexOf("Others") === 0) {
					//     //non-gdsn - Others        
					this.reserveGtinsFor = ["EA"];
				} else {
					//non-gdsn - Average weight                     
					this.reserveGtinsFor = ["KG"];
				}

				$("#lblGtinInput").text(this.reserveGtinsFor.length === 0 ? "-" : this.reserveGtinsFor[0]);
				$("#lblGtinInput").show();
				$(".lblGtin").hide();
			}

			this.prepareSuppliersForGTINInput(toInputMode);
		},

		/**
		 * Reset reservation panel
		 */
		resetReservationPanel: function () {
			$("#btnEA").removeClass("btn-primary");
			$("#btnKG").removeClass("btn-primary");
			$("#btnEA").addClass("btn-default");
			$("#btnKG").addClass("btn-default");

			$(".pUoM button").each(function () {
				$(this).removeClass("btn-primary");
				$(this).addClass("btn-default");
			});

			$("#btnEA").show();
			$("#btnKG").show();
			$(".pUoM").hide();
		},

		/**
		 * Prepare suppliers for GTIN input
		 * @param {boolean} toInputMode 
		 */
		prepareSuppliersForGTINInput: function (toInputMode) {
			$(".supRow").hide();

			if (toInputMode) {
				//hide search of supplier, provide one by default, hide remove all button, 
				$("#panelSupplierSearch").hide();
				$("#panelSupplierDetails").show();
				$("#btnRemoveAllSup").hide();
				$(".supMain").show();
				$("#btnRemoveMainSup").hide();

			} else {
				$("#panelSupplierSearch").show();
				$("#panelSupplierDetails").hide();
				$("#btnRemoveMainSup").show();
				$("#btnRemoveAllSup").show();
			}
		},

		/**
		 * Toggle base UoM
		 * @param {HTMLElement} btn 
		 * @param {string} otherBtnId 
		 */
		toogleBaseUoM: function (btn, otherBtnId) {
			$(".pUoM").show();

			if ($(btn).hasClass("btn-default")) {
				//switch back to default
				$(btn).removeClass("btn-default");
				$(btn).addClass("btn-primary");
				$("#" + otherBtnId).removeClass("btn-primary");
				$("#" + otherBtnId).addClass("btn-default");
			}

			//update UoM                
			if (otherBtnId === "btnEA") {
				//Active one is KG
				$("#btnEA_alt").show();
				//$("#btnIP_alt").hide();                   
			} else {
				$("#btnEA_alt").hide();
				//$("#btnIP_alt").show();                                       
			}

			$(".pUoM button").each(function () {
				$(this).removeClass("btn-primary");
				$(this).addClass("btn-default");
			});

			//gtin res label                
			this.reserveGtinsFor = [$(btn).text()];
			$("#lblGtinInput").text(this.reserveGtinsFor[0]);

		},

		/**
		 * Select UoM
		 * @param {HTMLElement} btn 
		 */
		selectUoM: function (btn) {
			if ($(btn).hasClass("btn-primary")) {
				//switch back to default
				$(btn).removeClass("btn-primary");
				$(btn).addClass("btn-default");

				//remove from lbl selected    
				// Fix: array pop doesn't take argument to remove specific item in standard JS, but let's keep logic similar or fix it.
				// Assuming logical intent is to remove the item.
				var index = this.reserveGtinsFor.indexOf($(btn).text());
				if (index > -1) {
					this.reserveGtinsFor.splice(index, 1);
				}
			} else {
				//switch to selected mode
				$(btn).removeClass("btn-default");
				$(btn).addClass("btn-primary");

				//add from lbl selected
				this.reserveGtinsFor.push($(btn).text());
			}

			$("#lblGtinInput").text(this.reserveGtinsFor);

		},

		/**
		 * Remove all Gtins
		 */
		removeAllGtins: function () {
			$(".gtinRow").hide();
			$(".lblGtin").hide();
			$("#lblGtinInput").show();
			$(".lblGtin2").hide();
			$("#lblGtinInput2").show();
			$(".supRegInfoPanel").hide();

			$("#panelMassValidation").hide();
			$("#gtinInput").focus();
		},

		/**
		 * Paste single Gtin
		 */
		pasteSingleGtin: function () {
			var row = $('.gtinRow:hidden').first();
			row.show();

			if (row.hasClass("gtinValid")) {
				if (row.hasClass("gtinCreation")) {
					//creation
					$('.lblGtin:hidden').first().show();
					$("#lblGtinInput").hide();
				} else {
					//reactivation
					$('.lblGtin2:hidden').first().show();
					$("#lblGtinInput2").hide();
				}
			}

			$("#panelMassValidation").show();
			$(".supRegInfoPanel").show();
			this.doOnGtinListUpdate();

			$("#gtinInput").val("");
			$("#gtinInput").focus();
		},

		/**
		 * Paste Gtins
		 */
		pasteGtins: function () {
			$(".gtinRow").show();
			$("#panelMassValidation").show();
			$(".lblGtin").show();
			$("#lblGtinInput").hide();
			$("#lblGtinInput2").hide();
			$(".supRegInfoPanel").show();
		},

		/**
		 * Remove all suppliers
		 */
		removeAllSuppliers: function () {
			$(".supRow").hide();
			$("#panelSupplierDetails").hide();
			$("#supInput").focus();
			$(".supRegInfoPanel").hide();
			$(".supNoRegInfoPanel").hide();
		},

		/**
		 * Show Gtins
		 * @param {HTMLElement} btn 
		 * @param {number} action 
		 */
		showGtins: function (btn, action) {
			$(btn).addClass("btn-primary").removeClass("btn-default");
			$(".btnSwitchGtins:not(#" + $(btn).attr("id") + ")").removeClass("btn-primary").addClass("btn-default");

			if (action === 0) {
				//ALL
				$(".gtinValid").show();
				$(".gtinInvalid").show();
			} else if (action === 1) {
				//VALID
				$(".gtinValid").show();
				$(".gtinInvalid").hide();
			} else {
				//VALID
				$(".gtinValid").hide();
				$(".gtinInvalid").show();
			}

			//$("#datatable-gi").DataTable().draw()

		},

		/**
		 * Reuse Gtin
		 * @param {number} index 
		 */
		reuse: function (index) {
			$(".fake-" + index).show();
			$(".orig-" + index).hide();
			$("#lblGtinInput").hide();
		},

		/**
		 * Undo reuse
		 * @param {number} index 
		 */
		undoReuse: function (index) {
			$(".fake-" + index).hide();
			$(".orig-" + index).show();
			$("#lblGtinInput2").hide();
		}

	};

	App.CreationCreateTasks = CreationCreateTasks;

})(jQuery);