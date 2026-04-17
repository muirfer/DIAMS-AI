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
            $(".assDesc").css("width", "60%")
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

            // Force all rows to show by default (override inline HTML display none)
            $('.datatable-assort tbody tr').show();

            $('.datatable-assort').dataTable({
                dom: 't',
                paging: false,
                info: false,
                initComplete: function (settings, json) {
                    var $table = $(settings.nTable);
                    
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
        }
    };

    App.FVAssortment = FVAssortment;

})(jQuery);