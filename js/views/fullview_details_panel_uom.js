(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling UoM logic in Product Full view
    var FVUom = {
        loadingTimer: null,
        singleSupplierItem: false,
        showNewMainGtinMode: false,
        addGtinFirstAttempt: true,

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
         * Binds event listeners for closing, resizing, and interacting with the GTIN overlay panel.
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

            $(document).off('changed.owl.carousel.fvUomOverlay', '#gtinCarousel').on('changed.owl.carousel.fvUomOverlay', '#gtinCarousel', function (event) {
                if (event && event.item && typeof event.item.index === 'number') {
                    FVUom.syncLeftPanelWithCarouselIndex(event.item.index);
                }
            });

            // Radio button selection change inside GTIN tables
            $(document).off('change.fvUomRadio', '#customOverlayPanel .gtinRadio').on('change.fvUomRadio', '#customOverlayPanel .gtinRadio', function () {
                FVUom.onGtinRadioChange($(this));
            });

            // "Check details on the right panel" links (#if11, #if12) in #pChangeDet
            $(document).off('click.fvUomIfLink', '#if11, #if12').on('click.fvUomIfLink', '#if11, #if12', function (e) {
                e.preventDefault();
                var targetIdx = ($(this).attr('id') === 'if12') ? 1 : 0;
                if ($('#customOverlayPanel').hasClass('open')) {
                    FVUom.moveTo(targetIdx, 300);
                } else {
                    FVUom.openOverlayPanel(targetIdx);
                }
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
         * @param {boolean} [opts.showNewMainGtinMode=false] - Whether to make #newMainGtinMode visible when selecting a new Main GTIN (true for S2).
         */
        configureForScenario: function (opts) {
            opts = opts || {};

            this.showNewMainGtinMode = !!opts.showNewMainGtinMode;

            // Ensure initial selected rows are tagged with .gtinDefault
            $('#datatable-gtinu, #datatable-gtinu-2').each(function () {
                var $tbl = $(this);
                if (!$tbl.find('tbody tr.gtinDefault').length) {
                    $tbl.find('tbody tr.gtinSelected').first().addClass('gtinDefault');
                }
            });

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
                    .html('<i class="fas fa-edit" style="margin-right: 15px;"></i>Request update');

                $('#btnActionGTIN').attr('onclick', "App.FVUom.requestSupplierGTINUpdate('rf11'); return false;");
                $('#btnActionGTIN2').attr('onclick', "App.FVUom.requestSupplierGTINUpdate('rf12'); return false;");
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
         * Returns all <tr> row nodes for a GTIN DataTable (across any active search filter).
         * @param {jQuery} $table - The DataTable jQuery element (#datatable-gtinu or #datatable-gtinu-2).
         * @returns {jQuery} jQuery collection of all <tr> elements in the table body.
         */
        getAllTableRows: function ($table) {
            if ($.fn.DataTable && $.fn.DataTable.isDataTable($table[0])) {
                return $($table.DataTable().rows().nodes());
            }
            return $table.find('tbody tr');
        },

        /**
         * Returns the active carousel slide index (0 for #datatable-gtinu, 1 for #datatable-gtinu-2).
         * @returns {number}
         */
        getCurrentCarouselIndex: function () {
            if (this.singleSupplierItem) {
                return 0;
            }
            var $carousel = $('#gtinCarousel');
            var owl = $carousel.data('owl.carousel');
            return (owl && typeof owl.current === 'function') ? owl.current() : 0;
        },

        /**
         * Handles radio button selection changes in #datatable-gtinu and #datatable-gtinu-2.
         * @param {jQuery} $radio - The selected .gtinRadio input element.
         */
        onGtinRadioChange: function ($radio) {
            if (!$radio || !$radio.length) {
                return;
            }

            var $newRow = $radio.closest('tr');
            var $table = $radio.closest('table');
            if (!$table.length) {
                $table = ($radio.attr('name') === 'main_2') ? $('#datatable-gtinu-2') : $('#datatable-gtinu');
            }

            var isTable2 = ($table.attr('id') === 'datatable-gtinu-2');
            var $allRows = this.getAllTableRows($table);
            var $defaultRow = $allRows.filter('.gtinDefault');
            var $modeDiv = isTable2 ? $('#newMainGtinMode2') : $('#newMainGtinMode');
            var $newGtinRow = isTable2 ? $('#rowNewGtin2') : $('#rowNewGtin');

            // 1. Remove highlight from previously selected row and assign to the newly selected row
            $allRows.removeClass('gtinSelected');
            $newRow.addClass('gtinSelected');

            // Hide btnGTINMain on previously selected row(s)
            $allRows.find('.btnGTINMain').hide();

            if ($newRow.hasClass('gtinDefault')) {
                // Re-selecting the original/initial row (.gtinDefault)
                $defaultRow.find('.btnGTINSec').hide();

                if ($modeDiv.length) {
                    if ($newGtinRow.length) {
                        $modeDiv.appendTo($newGtinRow.find('.tdExtra'));
                    } else {
                        $modeDiv.appendTo($defaultRow.find('.tdExtra'));
                    }
                    $modeDiv.hide();
                }
            } else {
                // Selecting a different row (either deselecting .gtinDefault or switching between non-default rows)
                $defaultRow.find('.btnGTINSec').show();
                $newRow.find('.btnGTINMain').show();

                if ($modeDiv.length) {
                    $modeDiv.appendTo($newRow.find('.tdExtra'));
                    if (this.showNewMainGtinMode) {
                        $modeDiv.css('display', 'flex');
                    } else {
                        $modeDiv.hide();
                    }
                }
            }

            this.evaluateTableUpdateState($table);
        },

        /**
         * Handles clicking "Add GTIN" inside #modal_gtin.
         * First click in the session keeps the modal open and displays #gtinErrorMsge.
         * Second and subsequent clicks close the modal, show #rowNewGtin (or #rowNewGtin2),
         * hide #btnActionGTIN (or #btnActionGTIN2), and evaluate the table update state.
         */
        addNewGtin: function () {
            if (this.addGtinFirstAttempt) {
                $('#gtinErrorMsge').show();
                this.addGtinFirstAttempt = false;
                return;
            }

            $('#gtinErrorMsge').hide();
            if ($.magnificPopup) {
                $.magnificPopup.close();
            }

            var currentIndex = this.getCurrentCarouselIndex();
            var isTable2 = (currentIndex === 1);
            var $table = isTable2 ? $('#datatable-gtinu-2') : $('#datatable-gtinu');
            var $newRow = isTable2 ? $('#rowNewGtin2') : $('#rowNewGtin');
            var $actionBtn = isTable2 ? $('#btnActionGTIN2') : $('#btnActionGTIN');

            $newRow.show();
            $actionBtn.hide();

            this.evaluateTableUpdateState($table);
        },

        /**
         * Removes the newly added GTIN row (#rowNewGtin or #rowNewGtin2) and restores #btnActionGTIN.
         * @param {HTMLElement} [el] - The clicked .delete-row anchor inside #rowNewGtin.
         */
        removeNew: function (el) {
            var $table;
            if (el) {
                $table = $(el).closest('table');
            }
            if (!$table || !$table.length) {
                $table = (this.getCurrentCarouselIndex() === 1) ? $('#datatable-gtinu-2') : $('#datatable-gtinu');
            }

            var isTable2 = ($table.attr('id') === 'datatable-gtinu-2');
            var $newRow = isTable2 ? $('#rowNewGtin2') : $('#rowNewGtin');
            var $actionBtn = isTable2 ? $('#btnActionGTIN2') : $('#btnActionGTIN');
            var $modeDiv = isTable2 ? $('#newMainGtinMode2') : $('#newMainGtinMode');
            var $allRows = this.getAllTableRows($table);
            var $defaultRow = $allRows.filter('.gtinDefault');

            // If the newly added row was currently selected as Main GTIN, restore selection to .gtinDefault
            if ($newRow.find('.gtinRadio').is(':checked')) {
                $newRow.find('.gtinRadio').prop('checked', false);
                $newRow.removeClass('gtinSelected');
                $newRow.find('.btnGTINMain').hide();

                $defaultRow.addClass('gtinSelected');
                $defaultRow.find('.gtinRadio').prop('checked', true);
                $defaultRow.find('.btnGTINSec').hide();

                if ($modeDiv.length) {
                    $modeDiv.appendTo($newRow.find('.tdExtra')).hide();
                }
            }

            $newRow.hide();
            $actionBtn.show();

            this.evaluateTableUpdateState($table);
        },

        /**
         * Marks an existing GTIN row for deletion.
         * Disables its radio button, shows .btnGTINRemove, hides .btnGTINMain,
         * hides .delete-row, and shows .undo-row.
         * @param {HTMLElement} el - The clicked .delete-row anchor element.
         */
        markAsDeleted: function (el) {
            var $row = $(el).closest('tr');
            if (!$row.length) {
                return;
            }
            var $table = $row.closest('table');

            // 1. Disable radio button
            $row.find('.gtinRadio').prop('disabled', true).attr('disabled', 'disabled');
            // 2. Show btnGTINRemove
            $row.find('.btnGTINRemove').show();
            // 3. Hide btnGTINMain if visible
            $row.find('.btnGTINMain').hide();
            // 4. Hide delete-row and show undo-row
            $row.find('.delete-row').hide();
            $row.find('.undo-row').show();

            this.evaluateTableUpdateState($table);
        },

        /**
         * Undoes deletion on a GTIN row.
         * Re-enables its radio button, hides .btnGTINRemove, and toggles .undo-row / .delete-row.
         * @param {HTMLElement} el - The clicked .undo-row anchor element.
         */
        undo: function (el) {
            var $row = $(el).closest('tr');
            if (!$row.length) {
                return;
            }
            var $table = $row.closest('table');

            // Revert step 1: Enable radio button
            $row.find('.gtinRadio').prop('disabled', false).removeAttr('disabled');
            // Revert step 2: Hide btnGTINRemove
            $row.find('.btnGTINRemove').hide();
            // If this row was selected as a new main GTIN, restore btnGTINMain visibility
            if ($row.find('.gtinRadio').is(':checked') && !$row.hasClass('gtinDefault')) {
                $row.find('.btnGTINMain').show();
            }
            // Alternate visibility of undo-row and delete-row
            $row.find('.undo-row').hide();
            $row.find('.delete-row').show();

            this.evaluateTableUpdateState($table);
        },

        /**
         * Checks whether a GTIN table currently has an active update.
         * An update is considered active whenever at least one action status button
         * (.btnGTINNew, .btnGTINMain, .btnGTINSec, .btnGTINRemove) is visible in column 3 across all visible rows.
         * @param {jQuery} $table - The DataTable jQuery element.
         * @returns {boolean}
         */
        hasActiveTableUpdate: function ($table) {
            if (!$table || !$table.length) {
                return false;
            }
            var hasUpdate = false;
            var $allRows = this.getAllTableRows($table);

            $allRows.each(function () {
                var $tr = $(this);
                if ($tr.css('display') === 'none') {
                    return;
                }
                $tr.find('.btnGTINNew, .btnGTINMain, .btnGTINSec, .btnGTINRemove').each(function () {
                    if ($(this).css('display') !== 'none') {
                        hasUpdate = true;
                        return false;
                    }
                });
                if (hasUpdate) {
                    return false;
                }
            });

            return hasUpdate;
        },

        /**
         * Evaluates the current GTIN table state and updates #pChangeMain / #pChangeDet in #accChangeRequest
         * without closing #customOverlayPanel.
         * @param {jQuery} $table - The DataTable jQuery element (#datatable-gtinu or #datatable-gtinu-2).
         */
        evaluateTableUpdateState: function ($table) {
            if (!$table || !$table.length || !App.updateFields || !App.FVUpdate) {
                return;
            }

            var isTable2 = ($table.attr('id') === 'datatable-gtinu-2');
            var carouselIndex = isTable2 ? 1 : 0;
            var targetFieldId = isTable2 ? 'rf12' : 'rf11';
            var $container = isTable2 ? $('#f12') : $('#f11');

            var fieldObj = App.updateFields.find(function (item) {
                return item.id === targetFieldId || item.carouselIndex === carouselIndex;
            });

            if (!fieldObj) {
                return;
            }

            var isActive = this.hasActiveTableUpdate($table);

            if (isActive) {
                $('#' + fieldObj.id).show();
                App.fieldObject = fieldObj;
                App.FVUpdate.showChangeDetailsForCurrentField();
                App.FVUpdate.showOrHideConfirmButton();
            } else {
                $('#' + fieldObj.id).hide();
                fieldObj.comment = "";
                fieldObj.reviewDone = false;
                if (App.FVSummaryLog && typeof App.FVSummaryLog.goBack === 'function') {
                    App.FVSummaryLog.goBack(true);
                }
                App.FVUpdate.showOrHideConfirmButton();
            }
        },

        /**
         * Resets a GTIN table back to its initial state (used when clicking Restore/#btnDiscard or Discard all).
         * @param {number} carouselIndex - 0 for #datatable-gtinu, 1 for #datatable-gtinu-2.
         */
        resetTableToInitialState: function (carouselIndex) {
            var isTable2 = (carouselIndex === 1);
            var $table = isTable2 ? $('#datatable-gtinu-2') : $('#datatable-gtinu');
            if (!$table.length) {
                return;
            }

            var $newRow = isTable2 ? $('#rowNewGtin2') : $('#rowNewGtin');
            var $actionBtn = isTable2 ? $('#btnActionGTIN2') : $('#btnActionGTIN');
            var $modeDiv = isTable2 ? $('#newMainGtinMode2') : $('#newMainGtinMode');
            var $container = isTable2 ? $('#f12') : $('#f11');
            var $allRows = this.getAllTableRows($table);
            var $defaultRow = $allRows.filter('.gtinDefault');

            // Hide new GTIN row and restore Add new GTIN button
            $newRow.hide();
            if ($actionBtn.attr('onclick') && $actionBtn.attr('onclick').indexOf('requestSupplierGTINUpdate') !== -1) {
                $actionBtn.show();
            } else {
                $actionBtn.show();
            }

            // Reset all rows
            $allRows.each(function () {
                var $r = $(this);
                $r.removeClass('gtinSelected');
                $r.find('.gtinRadio').prop('checked', false).prop('disabled', false).removeAttr('disabled');
                $r.find('.btnGTINMain, .btnGTINSec, .btnGTINRemove').hide();
                $r.find('.undo-row').hide();
                $r.find('.delete-row').show();
            });

            // Restore default selected row
            $defaultRow.addClass('gtinSelected');
            $defaultRow.find('.gtinRadio').prop('checked', true);

            if ($modeDiv.length) {
                if ($newRow.length) {
                    $modeDiv.appendTo($newRow.find('.tdExtra'));
                }
                $modeDiv.hide();
            }

            $container.removeClass('changed c_requested');
        },

        /**
         * Handler for requesting supplier GTIN update (used in scenario S4).
         * Navigates left accordion #accChangeRequest to #pChangeDet for rf11 (btnActionGTIN) or rf12 (btnActionGTIN2).
         * @param {string} [fieldId] - Target update field ID ('rf11' or 'rf12').
         */
        requestSupplierGTINUpdate: function (fieldId) {
            var targetFieldId = fieldId;
            if (!targetFieldId || typeof targetFieldId !== 'string') {
                var currentIndex = this.getCurrentCarouselIndex();
                targetFieldId = (currentIndex === 1) ? 'rf12' : 'rf11';
            }

            if (App.updateFields) {
                App.fieldObject = App.updateFields.find(function (item) {
                    return item.id === targetFieldId;
                });
            }

            if (App.fieldObject && App.FVUpdate && typeof App.FVUpdate.showChangeDetailsForCurrentField === 'function') {
                $("#txtRequired").hide();
                $("#cComment").removeClass("rejected");
                App.FVUpdate.showChangeDetailsForCurrentField();
            }
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
         * and executes App.FVSummaryLog.goBack() unless skipGoBack is true.
         * @param {boolean} [skipGoBack=false] - If true, only closes the overlay panel without altering the left panel view.
         */
        closeOverlayPanel: function (skipGoBack) {
            if (this.loadingTimer) {
                clearTimeout(this.loadingTimer);
                this.loadingTimer = null;
            }

            // Animate overlay panel back from left to right
            $('#customOverlayPanel').removeClass('open');

            // Execute goBack in fullview_new_details_summary_log.js
            if (!skipGoBack && App.FVSummaryLog && typeof App.FVSummaryLog.goBack === 'function') {
                App.FVSummaryLog.goBack();
            }
        },

        /**
         * Synchronizes the left panel (#accChangeRequest) when navigating between items in #gtinCarousel.
         * If the newly displayed carousel item has an active update/request visible in #pChangeMain (#tLog),
         * shows its details in #pChangeDet; otherwise switches the left panel back to #pChangeMain (keeping the overlay open).
         * @param {number} index - Active carousel item index (0-based).
         */
        syncLeftPanelWithCarouselIndex: function (index) {
            if (!$('#customOverlayPanel').hasClass('open') || !$('#panelContent').is(':visible')) {
                return;
            }
            if (!App.updateFields || !App.FVUpdate) {
                return;
            }

            var targetFieldId = (index === 1) ? 'rf12' : 'rf11';
            var fieldObj = App.updateFields.find(function (item) {
                return item.carouselIndex === index || item.id === targetFieldId;
            });

            var $logRow = fieldObj ? $('#' + fieldObj.id) : $();
            var isRowVisibleInLog = $logRow.length > 0 && $logRow[0].style.display !== 'none';

            if (fieldObj && isRowVisibleInLog) {
                App.fieldObject = fieldObj;
                $("#txtRequired").hide();
                $("#cComment").removeClass("rejected");
                App.FVUpdate.showChangeDetailsForCurrentField();
            } else if (App.FVSummaryLog && typeof App.FVSummaryLog.goBack === 'function') {
                App.FVSummaryLog.goBack(true);
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

                FVUom.syncLeftPanelWithCarouselIndex(targetIndex);
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
                    aaSorting: [],
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
                    "scrollY": "300px",
                    "scrollCollapse": true,
                    "autoWidth": false,
                    "columnDefs": [
                        { "width": "5%", "targets": 0, "className": "text-center", "orderable": false },
                        { "width": "15%", "targets": 1, "className": "gtinValue text-center" },
                        { "width": "20%", "targets": 2, "className": "gtinAction", "orderable": false },
                        { "width": "55%", "targets": 3, "className": "gtinReason", "orderable": false },
                        { "width": "5%", "targets": 4, "className": "gtinAction text-center", "orderable": false }
                    ]
                });
            });

            $('#datatable-gtinu_wrapper .dataTables_scrollBody, #datatable-gtinu-2_wrapper .dataTables_scrollBody').addClass('beautify-scroll');
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

    // Bind delegated events immediately so close/resize/radio handlers are active as soon as script loads
    FVUom.bindEvents();

    // Expose globally for inline handlers in pim_fullview_details_pUoM.html
    window.openOverlayPanel = function (index) {
        FVUom.openOverlayPanel(index);
    };
    window.moveTo = function (index) {
        FVUom.moveTo(index);
    };
    window.requestSupplierGTINUpdate = function (fieldId) {
        FVUom.requestSupplierGTINUpdate(fieldId);
    };
    window.addNewGtin = function () {
        FVUom.addNewGtin();
    };
    window.removeNew = function (el) {
        FVUom.removeNew(el);
    };
    window.markAsDeleted = function (el) {
        FVUom.markAsDeleted(el);
    };
    window.undo = function (el) {
        FVUom.undo(el);
    };

    App.FVUom = FVUom;

})(jQuery);
