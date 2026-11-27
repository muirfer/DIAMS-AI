(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling UoM logic in Product Full view
    var FVUom = {
        loadingTimer: null,
        singleSupplierItem: false,

        /**
         * Initializes the UoM module.
         * Sets up event handlers and syncs overlay panel bounds.
         */
        initialize: function () {
            this.syncOverlayPanelBounds();
            this.bindEvents();

            this.datatableGtinInputInit();
            this.adaptGTINActionButton('#datatable-gtinu_wrapper', '#btnActionGTIN');
            this.adaptGTINActionButton('#datatable-gtinu-2_wrapper', '#btnActionGTIN2');
        },

        /**
         * Binds event listeners for closing and resizing the GTIN overlay panel.
         */
        bindEvents: function () {
            $(document).off('click.fvUomOverlayClose', '#closeCustomPanel').on('click.fvUomOverlayClose', '#closeCustomPanel', function (e) {
                e.preventDefault();
                FVUom.closeOverlayPanel();
            });

            $(window).off('resize.fvUomOverlay').on('resize.fvUomOverlay', function () {
                FVUom.syncOverlayPanelBounds();
            });

            $(document).off('click.fvUomOverlayExpand', '#btn-expand-view, #btn-collapse-view').on('click.fvUomOverlayExpand', '#btn-expand-view, #btn-collapse-view', function () {
                setTimeout(function () {
                    FVUom.syncOverlayPanelBounds();
                }, 150);
            });
        },

        /**
         * Aligns #customOverlayPanel dimensions and position to occupy the exact area of #fullview-right-col
         * without covering, dimming, or disabling #fullview-left-col.
         */
        syncOverlayPanelBounds: function () {
            var $rightCol = $('#fullview-right-col');
            var $panel = $('#customOverlayPanel');

            if (!$rightCol.length || !$panel.length) {
                return;
            }

            var rect = $rightCol[0].getBoundingClientRect();
            var viewportHeight = window.innerHeight || $(window).height();
            var availableHeight = viewportHeight - rect.top;
            var panelHeight = rect.height > 0 ? Math.max(rect.height, availableHeight) : availableHeight;

            if (panelHeight > availableHeight && availableHeight > 0) {
                panelHeight = availableHeight;
            }

            $panel.css({
                top: rect.top + 'px',
                left: rect.left + 'px',
                width: rect.width + 'px',
                height: panelHeight + 'px'
            });
        },

        /**
         * Configures the UoM GTIN trigger buttons and #customOverlayPanel according to the active parent scenario.
         * @param {Object} opts - Scenario configuration options.
         * @param {string} opts.openBtnIcon - Icon class for .openCustomPanel buttons ('fas fa-plus' or 'fas fa-users').
         * @param {string} opts.openBtnTooltip - Tooltip text for .openCustomPanel buttons.
         * @param {string} opts.title - Title in #customOverlayPanel header.
         * @param {string} opts.subtitle - Subtitle in #customOverlayPanel header.
         * @param {boolean} opts.singleSupplierItem - If true, keeps only default item in carousel, hides supplier badge, carousel nav, and .dropleft button.
         * @param {string} opts.actionBtnMode - 'hide' | 'show' | 'requestUpdate' for #btnActionGTIN and #btnActionGTIN2.
         * @param {boolean} opts.enableRadios - Whether to enable .gtinRadio buttons in column 1.
         * @param {boolean} opts.showTrashOnHover - Whether to display .delete-row (far fa-trash-alt) on row hover.
         */
        configureForScenario: function (opts) {
            opts = opts || {};

            // 1. Trigger buttons (.openCustomPanel) in pim_fullview_details_pUoM.html
            var $openBtns = $('#pUoM .openCustomPanel');
            if (opts.openBtnTooltip !== undefined) {
                $openBtns.attr('title', opts.openBtnTooltip).attr('data-original-title', opts.openBtnTooltip);
            }
            if (opts.openBtnIcon) {
                $openBtns.find('i').attr('class', opts.openBtnIcon);
            }

            // 2. Overlay panel header title & subtitle
            if (opts.title !== undefined) {
                $('#overlayPanelTitle').text(opts.title);
            }
            if (opts.subtitle !== undefined) {
                $('#overlayPanelSubtitle').text(opts.subtitle);
            }

            // 3. Carousel items, supplier badge, carousel nav, and extra dropleft button
            this.singleSupplierItem = !!opts.singleSupplierItem;
            var $carousel = $('#gtinCarousel');

            if (this.singleSupplierItem) {
                // Hide supplier badge at the top of the item
                $carousel.find('.badge.badge-info').hide();

                // Keep only the default item (index 0) in the carousel
                var owl = $carousel.data('owl.carousel');
                if (owl) {
                    var count = owl.items().length;
                    for (var i = count - 1; i > 0; i--) {
                        $carousel.trigger('remove.owl.carousel', [i]);
                    }
                    owl.options.nav = false;
                    owl.options.mouseDrag = false;
                    owl.options.touchDrag = false;
                    owl.options.pullDrag = false;
                    $carousel.trigger('refresh.owl.carousel');
                } else {
                    $carousel.children('.item').slice(1).remove();
                }

                // Hide carousel navigation elements and extra dropleft navigation button
                $carousel.find('.owl-nav').hide();
                $('#customOverlayPanel .dropleft').hide();
            } else {
                // Show supplier badges, carousel navigation elements, and extra dropleft navigation button
                $carousel.find('.badge.badge-info').show();
                $carousel.find('.owl-nav').show();
                $('#customOverlayPanel .dropleft').show();
            }

            // 4. Action buttons (#btnActionGTIN and #btnActionGTIN2)
            var $actionBtns = $('#btnActionGTIN, #btnActionGTIN2');
            if (opts.actionBtnMode === 'hide') {
                $actionBtns.hide();
            } else if (opts.actionBtnMode === 'requestUpdate') {
                $actionBtns
                    .show()
                    .removeClass('modal-with-zoom-anim')
                    .removeData('magnificPopup')
                    .off('click.magnificPopup')
                    .attr('href', '#')
                    .attr('onclick', 'App.FVUom.requestSupplierGTINUpdate(); return false;')
                    .html('<i class="fas fa-edit" style="margin-right: 15px;"></i>Request update');
            } else {
                $actionBtns.show();
            }

            // 5. Table radio buttons (.gtinRadio) and trash icon on row hover (.delete-row)
            if (opts.enableRadios) {
                $('#customOverlayPanel .gtinRadio').prop('disabled', false).removeAttr('disabled');
                $('#customOverlayPanel .gtinInputValues, #modal_gtin .gtinInputValues').prop('readonly', false).prop('disabled', false).removeAttr('readonly').removeAttr('disabled');
            } else {
                $('#customOverlayPanel .gtinRadio').prop('disabled', true).attr('disabled', 'disabled');
            }

            if (opts.showTrashOnHover) {
                $('#customOverlayPanel .delete-row').show();
            } else {
                $('#customOverlayPanel .delete-row').hide();
            }

            // Always keep DataTables search input inside overlay panel usable
            $('#customOverlayPanel input[type="search"]').prop('readonly', false).prop('disabled', false).removeAttr('readonly').removeAttr('disabled');
        },

        /**
         * Handler for requesting supplier GTIN update (used in scenario S4).
         */
        requestSupplierGTINUpdate: function (event) {

        },

        /**
         * Opens the GTIN overlay panel sliding from right to left over #fullview-right-col.
         * Displays loading.gif for 1200ms while hiding #panelContent, then hides the loader,
         * reveals #panelContent, and positions #gtinCarousel at the specified item index.
         * @param {number} index - Target carousel item index (0-based).
         */
        openOverlayPanel: function (index) {
            var targetIndex = (typeof index === 'number' && !isNaN(index)) ? index : (parseInt(index, 10) || 0);

            this.bindEvents();
            this.syncOverlayPanelBounds();

            if (this.loadingTimer) {
                clearTimeout(this.loadingTimer);
                this.loadingTimer = null;
            }

            // Show loading.gif and hide main content during initialization
            $('#panelContent').hide();
            $('#loadingIndicator').show();

            // Animate overlay panel from right to left
            $('#customOverlayPanel').addClass('open');

            this.loadingTimer = setTimeout(function () {
                $('#loadingIndicator').hide();
                $('#panelContent').show();

                FVUom.moveTo(targetIndex, 0);
                FVUom.loadingTimer = null;
            }, 1200);
        },

        /**
         * Closes the GTIN overlay panel animating from left to right
         * and executes App.FVSummaryLog.goBack().
         */
        closeOverlayPanel: function () {
            if (this.loadingTimer) {
                clearTimeout(this.loadingTimer);
                this.loadingTimer = null;
            }

            // Animate overlay panel back from left to right
            $('#customOverlayPanel').removeClass('open');

            // Execute goBack in fullview_new_details_summary_log.js
            if (App.FVSummaryLog && typeof App.FVSummaryLog.goBack === 'function') {
                App.FVSummaryLog.goBack();
            }
        },

        /**
         * Moves #gtinCarousel to the specified item index and refreshes Owl Carousel layout.
         * @param {number} index - Target carousel slide index (0-based).
         * @param {number} [speed=300] - Transition speed in ms.
         */
        moveTo: function (index, speed) {
            var $carousel = $('#gtinCarousel');
            if (!$carousel.length) {
                return;
            }

            var targetIndex = (typeof index === 'number' && !isNaN(index)) ? index : (parseInt(index, 10) || 0);
            if (this.singleSupplierItem) {
                targetIndex = 0;
            }
            var animSpeed = (typeof speed === 'number') ? speed : 300;

            if (!$carousel.data('owl.carousel')) {
                var opts = $carousel.data('plugin-options') || { dots: false, nav: !this.singleSupplierItem, items: 1 };
                if ($.isFunction($carousel.themePluginCarousel)) {
                    $carousel.themePluginCarousel(opts);
                } else if ($.isFunction($carousel.owlCarousel)) {
                    $carousel.owlCarousel(opts);
                }
            }

            $carousel.trigger('refresh.owl.carousel');
            $carousel.trigger('to.owl.carousel', [targetIndex, animSpeed, true]);
            if (this.singleSupplierItem) {
                $carousel.find('.owl-nav').hide();
            }

            setTimeout(function () {
                $carousel.trigger('refresh.owl.carousel');
                $carousel.trigger('to.owl.carousel', [targetIndex, 0, true]);
                if (FVUom.singleSupplierItem) {
                    $carousel.find('.owl-nav').hide();
                } else {
                    $carousel.find('.owl-nav').show();
                }

                if ($.fn.DataTable) {
                    $('#datatable-gtinu, #datatable-gtinu-2').each(function () {
                        if ($.fn.DataTable.isDataTable(this)) {
                            $(this).DataTable().columns.adjust();
                        }
                    });
                }
            }, 50);
        },

        /**
         * Initialize GTIN input tables in overlay panel
         */
        datatableGtinInputInit: function () {
            var $tables = $('#datatable-gtinu, #datatable-gtinu-2');
            if (!$tables.length || !$.fn.dataTable) {
                return;
            }

            $tables.each(function () {
                if ($.fn.DataTable.isDataTable(this)) {
                    return;
                }
                $(this).dataTable({
                    dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p',
                    aoColumns: [
                        { "bSortable": false }, // First column (index 0) - not sortable
                        { "bSortable": true },  // Second column (index 1) - sortable
                        { "bSortable": false }, // Third column (index 2) - not sortable
                        { "bSortable": false }, // Fourth column (index 3) - not sortable
                        { "bSortable": false }  // Fifth column (index 4) - not sortable
                    ],
                    "paging": false,
                    "info": false,
                    "lengthChange": false,
                    "scrollY": "400px",
                    "scrollCollapse": true,
                    "autoWidth": false,
                    "columnDefs": [
                        { "width": "5%", "targets": 0, "className": "text-center", "orderable": false },
                        { "width": "15%", "targets": 1, "className": "gtinValue" },
                        { "width": "20%", "targets": 2, "className": "gtinAction", "orderable": false },
                        { "width": "50%", "targets": 3, "className": "gtinReason", "orderable": false },
                        { "width": "10%", "targets": 4, "className": "gtinAction text-center", "orderable": false }
                    ]
                });
            });
        },

        adaptGTINActionButton: function (wrapperId, buttonId) {
            var $wrapper = $(wrapperId);
            if (!$wrapper.length) {
                return;
            }
            // Remove duplicate cloned button from DataTables hidden scrollBody thead if present
            $wrapper.find('.dataTables_scrollBody ' + buttonId).remove();

            var $targetInnerDiv = $wrapper.find('.row').children('div').first();
            if ($targetInnerDiv.length) {
                $(buttonId).appendTo($targetInnerDiv);
            }
        }
    };

    // Bind delegated events immediately so close/resize handlers are active as soon as script loads
    FVUom.bindEvents();

    // Expose globally for inline handlers
    window.openOverlayPanel = function (index) {
        FVUom.openOverlayPanel(index);
    };
    window.moveTo = function (index) {
        FVUom.moveTo(index);
    };
    window.requestSupplierGTINUpdate = function () {
        FVUom.requestSupplierGTINUpdate();
    };

    App.FVUom = FVUom;

})(jQuery);
