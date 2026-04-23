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
            $(".assDesc").css("width", "60%");
            this.bindBelgiumAssortmentEvents();
            this.bindLuxembourgAssortmentEvents();
        },

        /**
         * Initializes the DataTable for the Assortment table.
         * Handles table initialization, DOM manipulation, and DataTable configuration.
         */
        datatableInit: function () {
            // Remove the arbitrary inner Bootstrap constraints so tables expand 100% horizontally
            $('.datatable-assort').closest('.col-lg-10.offset-lg-1')
                .removeClass('col-lg-10 offset-lg-1')
                .addClass('col-lg-12 px-0');

            // Determine if we are in prodfullview to toggle default table filtering logic
            var isFullView = window.location.href.indexOf('prodfullview') !== -1;

            // Force all rows to show by default initially to properly establish datatables internal dimensions
            $('.datatable-assort tbody tr').show();

            $('.datatable-assort').dataTable({
                dom: 't',
                paging: false,
                info: false,
                initComplete: function (settings, json) {
                    var $table = $(settings.nTable);
                    
                    // Add 25px bottom margin to grid wrappers to prevent rows from touching when wrapping vertically
                    $table.closest('.col-lg-4, .col-lg-3').css('margin-bottom', '25px');

                    // Force the table to take 100% width
                    $table.css('width', '100%');

                    // Shrink the description column's font size
                    $table.find('tbody td:nth-child(3)').css('font-size', 'smaller');
                    
                    // Natively enforce fixed sticky headers without splitting the DOM
                    $table.find('thead th').css({
                        'position': 'sticky',
                        'top': '0',
                        'z-index': '10',
                        'background': 'snow',
                        'box-shadow': '0 2px 2px -1px rgba(0, 0, 0, 0.4)'
                    });

                    // Add NanoScroller wrapping around the unified table
                    if (!$table.parent().hasClass('scrollable-content')) {
                        $table.wrap('<div class="scrollable" data-plugin-scrollable data-plugin-options=\'{"alwaysVisible": true}\' style="height: 400px;"><div class="scrollable-content"></div></div>');
                        var $scrollableDiv = $table.closest('.scrollable');
                        
                        // Initialize via theme scrollable plugin safely and synchronously
                        if (typeof $.fn.themePluginScrollable === 'function') {
                            $scrollableDiv.themePluginScrollable({ alwaysVisible: true });
                        } else if (typeof window.initScrollable === 'function') {
                            window.initScrollable();
                        }
                        
                        // Programmatically simulate a window resize exactly as the user did manually.
                        // This forces NanoScroller framework to detect overflow natively and paint the scrollbar immediately.
                        setTimeout(function() {
                            $(window).trigger('resize');
                            // Ensure the inner scrollable resets metrics manually as a fallback
                            if (typeof $.fn.nanoScroller === 'function') {
                                $scrollableDiv.nanoScroller();
                            }
                        }, 250);
                    }

                    // Satisfy the condition: tables show only selected items by default in prodfullview mode
                    if (isFullView) {
                        App.FVAssortment.switchAssortmentView($table.attr('id'), false);
                    }
                }
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
        },

        /**
         * Bind events for the Belgium assortment toolbar
         */
        bindBelgiumAssortmentEvents: function() {
            var self = this;
            
            // Dropdown change
            $('#belgiumAssortmentFilter').on('change', function() {
                self.filterBelgiumAssortment();
            });

            // Button "All" click
            $('#btnAll').on('click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('btn-default')) {
                    $(this).removeClass('btn-default').addClass('btn-primary active');
                    $('#btnSelected').removeClass('btn-primary active').addClass('btn-default');
                    self.filterBelgiumAssortment();
                }
            });

            // Button "Selected" click
            $('#btnSelected').on('click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('btn-default')) {
                    $(this).removeClass('btn-default').addClass('btn-primary active');
                    $('#btnAll').removeClass('btn-primary active').addClass('btn-default');
                    self.filterBelgiumAssortment();
                }
            });

            // Handle switch changes to re-apply filter if in "Selected" view
            $('#section3 #tableBody').on('change', 'input[type="checkbox"]', function() {
                if ($('#btnSelected').hasClass('btn-primary')) {
                    self.filterBelgiumAssortment();
                }
            });
        },

        /**
         * Filter the Belgium assortment table based on toolbar state
         */
        filterBelgiumAssortment: function() {
            var showAll = $('#btnAll').hasClass('btn-primary');
            var dropdownFilter = $('#belgiumAssortmentFilter').val();

            $('#section3 #tableBody tr').each(function() {
                var $row = $(this);
                // The dropdown filters based on the class of the tr (e.g., "sm-manual", "sm-local")
                var matchDropdown = (!dropdownFilter || dropdownFilter === 'all') || $row.hasClass(dropdownFilter);
                
                // Button "All" shows everything (matching dropdown), "Selected" checks the row's checkbox
                var isChecked = $row.find('input[type="checkbox"]').is(':checked');
                var matchButton = showAll || isChecked;

                if (matchButton && matchDropdown) {
                    $row.show();
                } else {
                    $row.hide();
                }
            });
        },

        /**
         * Bind events for the Luxembourg assortment toolbar
         */
        bindLuxembourgAssortmentEvents: function() {
            var self = this;
            
            // Dropdown change
            $('#luxembourgAssortmentFilter').on('change', function() {
                self.filterLuxembourgAssortment();
            });

            // Button "All" click
            $('#btnAllLu').on('click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('btn-default')) {
                    $(this).removeClass('btn-default').addClass('btn-primary active');
                    $('#btnSelectedLu').removeClass('btn-primary active').addClass('btn-default');
                    self.filterLuxembourgAssortment();
                }
            });

            // Button "Selected" click
            $('#btnSelectedLu').on('click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('btn-default')) {
                    $(this).removeClass('btn-default').addClass('btn-primary active');
                    $('#btnAllLu').removeClass('btn-primary active').addClass('btn-default');
                    self.filterLuxembourgAssortment();
                }
            });

            // Handle switch changes to re-apply filter if in "Selected" view
            $('#section4 #tableBodyLu').on('change', 'input[type="checkbox"]', function() {
                if ($('#btnSelectedLu').hasClass('btn-primary')) {
                    self.filterLuxembourgAssortment();
                }
            });
        },

        /**
         * Filter the Luxembourg assortment table based on toolbar state
         */
        filterLuxembourgAssortment: function() {
            var showAll = $('#btnAllLu').hasClass('btn-primary');
            var dropdownFilter = $('#luxembourgAssortmentFilter').val();

            $('#section4 #tableBodyLu tr').each(function() {
                var $row = $(this);
                var matchDropdown = (!dropdownFilter || dropdownFilter === 'all') || $row.hasClass(dropdownFilter);
                
                var isChecked = $row.find('input[type="checkbox"]').is(':checked');
                var matchButton = showAll || isChecked;

                if (matchButton && matchDropdown) {
                    $row.show();
                } else {
                    $row.hide();
                }
            });
        }
    };

    App.FVAssortment = FVAssortment;

})(jQuery);