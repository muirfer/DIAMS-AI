(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    App.spanElement = null;
    App.fieldObject = null;
    App.origDS = ["01", "04", "06"];
    App.focusableClasses = ["changed", "approvedL1", "approvedL2", "rejected", "requestable", "c_requested"];
    App.approvalLevels = [
        { id: 1, inputStyle: "approvedL1", checkStyle: "success", color: "darkgreen", icon: "fas fa-check", tooltip: "Approved by Category Expert" },
        { id: 2, inputStyle: "approvedL2", checkStyle: "primary", color: "darkblue", icon: "fas fa-check-double", tooltip: "Approved" }
    ];
    App.btnGoConfig = [
        { id: "f5", top: "127px", right: "320px", width: "inherit", height: "inherit" },
        { id: "f11", top: "-12px", left: "-10px", width: "inherit", height: "inherit" }, //checkbox
    ];
    App.Actions = {
        APPROVE: "approve",
        REJECT: "reject",
        REQUEST: "request"
    };
    App.buttonTemplate = $('<button type="button" class="btn btn-info btn-go">Go</button>');

    // Module for handling common update logic in Full view details panel
    var FVUpdate = {
        /**
         * Initializes the Update module.
         * Sets up event handlers.
         */
        initialize: function () {
            //store span element
            App.spanElement = $('#titleDet span');

            // Apply initial field values, status classes, and custom step setup before storing original values
            if (App.FVUpdateStepSpecific && typeof App.FVUpdateStepSpecific.prepareFields === 'function') {
                App.FVUpdateStepSpecific.prepareFields();
            }

            //initialize datatable
            this.datatablePURHistoryInit();

            //initialize events
            this.storeAllFieldsOriginalValues();
            this.initializeAllFieldsFocusEvent();
            this.initializeAllFieldsChangeEvent();

            //common functionality
            this.initializeCommonFeatures();

            //init update initial status for current scenario
            App.FVUpdateStepSpecific.initialize();
        },
        /**
         * Initialize PUR History datatable
         */
        datatablePURHistoryInit: function () {
            if (!$('#datatable-purh').length) return;
            $('#datatable-purh').dataTable({
                dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p',
                aaSorting: [
                    [2, 'desc']
                ]
            });

            $("#datatable-purh_length").parent().remove();
            var element = $('#datatable-purh_filter').detach();
            $('#searchPurHistoryDiv').append(element);
            $('#searchPurHistoryDiv label').css("width", "100%");

            $("#purh_t1").css("width", "22%");
            //$("#purh_t2").css("width","15%")
            $("#purh_t3").css("width", "10%");
            $("#purh_t4").css("width", "5%");
            $("#purh_t5").css("width", "5%");
            $("#purh_t6").css("width", "7%");
            $("#purh_t7").css("width", "7%");
            $("#purh_t8").css("width", "22%");
            $("#purh_t9").css("width", "22%");
        },
        /**
         *  On load, store all fields original values
         */
        storeAllFieldsOriginalValues: function () {
            /** On load, store all fields original values for input and select values */
            $('input:not(#pPricesNew *, #customOverlayPanel *, #modal_gtin *), select:not(#customOverlayPanel *, #modal_gtin *), textarea:not(#cComment,#fComment,#customOverlayPanel *, #modal_gtin *)').each(function () {
                var input = $(this);
                input.data('originalValue', input.val());
                input.attr("readonly", "readonly");
                input.attr("disabled", "disabled");
            });

            /** On load, store all checkbox fields original values */
            $('input[type="checkbox"]:not(#pPricesNew *, #customOverlayPanel *, #modal_gtin *)').each(function () {
                $(this).data('originalValue', $(this).is(':checked'));
                $(this).attr("disabled", "disabled");
            });
        },
        /**
         * On field focus, determine fieldObject to treat and focus on change details if applies
         */
        initializeAllFieldsFocusEvent: function () {
            $('input:not(#pPricesNew *, #customOverlayPanel *, #modal_gtin *), select:not(#customOverlayPanel *, #modal_gtin *), textarea:not(#cComment,#fComment,#customOverlayPanel *, #modal_gtin *)').on('focus', function () {
                let fieldId = $(this).attr('id');

                //get field object
                App.fieldObject = App.updateFields.find(item => item.id === ("r" + fieldId));

                if (App.fieldObject && App.focusableClasses.some(className => $(this).hasClass(className))) {
                    App.FVUpdate.showChangeDetailsForCurrentField();
                } else {
                    App.FVSummaryLog.goBack();
                }
            });
        },
        /**
        * On field update, check if value is still a change or a new change.
        * Apply updates accordingly if the status changes for the field 
        */
        initializeAllFieldsChangeEvent: function () {
            $('input[type="text"]:not(.dateInput,#pPricesNew *,#customOverlayPanel *,#modal_gtin *),input[type="date"]:not(#pPricesNew *,#customOverlayPanel *,#modal_gtin *),textarea:not(#cComment,#fComment,#customOverlayPanel *,#modal_gtin *)').on('input', function () { App.FVUpdateStepSpecific.doOnFieldValueUpdated($(this)); });
            $('.dateInput:not(#pPricesNew *,#customOverlayPanel *,#modal_gtin *)').on('changeDate', function () { App.FVUpdate.doOnFieldValueUpdated($(this)); });
            $('select:not(#pPricesNew *,#customOverlayPanel *,#modal_gtin *)').on('change', function () { App.FVUpdate.doOnFieldValueUpdated($(this)); });

            /** Same as above but for checkboxes - special case*/
            $('input[type="checkbox"]:not(#pPricesNew *,#customOverlayPanel *,#modal_gtin *)').on('change', function () {
                let currentValue = $(this).is(':checked');
                let fieldId = $(this).attr('id');
                let isComplexStructure = $(this).is('input[type="checkbox"]') && $(this).closest('#f4').length > 0;

                if (currentValue === $(this).data('originalValue')) {
                    $(this).removeClass('changed');
                    $(this).parent().removeClass('checkbox-warning');
                    $(this).parent().addClass('checkbox-default');

                    if (!isComplexStructure) {
                        App.FVUpdate.discard();
                        App.FVSummaryLog.goBack();
                    }
                } else if (!$(this).hasClass('changed')) {
                    $(this).addClass('changed');
                    $(this).parent().addClass('checkbox-warning');
                    $(this).parent().removeClass('checkbox-default');

                    if (!isComplexStructure) {
                        App.FVUpdate.addNewChange();
                    }
                }

                //check for complex multi-select structures
                if (isComplexStructure) {
                    App.fieldObject = App.updateFields[3];
                    let changesInStructure = $('#f4').find('.changed').length;

                    console.log(App.fieldObject + " - " + changesInStructure);
                    if (changesInStructure === 1) {
                        App.FVUpdate.addNewChange();
                    } else if (changesInStructure === 0) {
                        App.FVUpdate.discard();
                        App.FVSummaryLog.goBack();
                    }
                }
            });
        },
        /**
         * More common initializations
         */
        initializeCommonFeatures: function () {
            if ($('#cComment').length) {
                $('#cComment').on('input change', function () {
                    if (App.fieldObject) {
                        App.fieldObject.comment = $(this).val();
                    }
                });
            }

            if ($('#blockStatement')) {
                $("#blockStatement").click(function () {
                    App.FVSummaryLog.switchToChangeView();
                });
            }

            if ($('#berStatement')) {
                $("#berStatement").click(function () {
                    if (App.FVSummaryLog && typeof App.FVSummaryLog.switchToBERView === 'function') {
                        App.FVSummaryLog.switchToBERView();
                    }
                });
            }
        },
        /**
         * Show change details for current field being focused
         */
        showChangeDetailsForCurrentField: function () {
            $('#titleDet').text(App.fieldObject.label).prepend(App.spanElement);
            $("#cComment").val(App.fieldObject.comment);
            $("#actionBadge").show();
            $(".info-link-u").hide();

            //show relevant input field
            $('[id^="if"]').hide();

            if (App.fieldObject.requestable) {
                if ($("#actionBadge").length) {
                    $("#actionBadge").text("UR");
                    $("#actionBadge").removeClass("badge-info");
                    $("#actionBadge").addClass("badge-warning");
                    $("#actionBadge").attr('data-original-title', "Update Request");
                    $(".old").hide();
                }
            } else {
                if ($("#actionBadge").length) {
                    $("#actionBadge").text("U");
                    $("#actionBadge").removeClass("badge-warning");
                    $("#actionBadge").addClass("badge-info");
                    $("#actionBadge").attr('data-original-title', "Updated");
                    $(".old").show();
                }

                //show relevant input for old value
                $("#" + App.fieldObject.iType).show();
                if (App.fieldObject.id === "rf4") {
                    $('#if4').next('span').show();
                } else {
                    $('#if4').next('span').hide();
                }
            }

            //switch panels
            App.FVSummaryLog.switchToChangeView();
            if ($('#pChangeMain').is(':visible')) {
                $('#pChangeDet').show('flip', function () {
                    // Hide the "pChangeMain" panel with a flip animation
                    $('#pChangeMain').hide('flip');
                });
            } else {
                $('#pChangeDet').show();
                $('#pChangeMain').hide();
            }

            //hide or show action buttons
            App.FVUpdateStepSpecific.showOrHideActionButtons();

            //show relevant timeline
            App.FVUpdate.showTimelineForCurrentField();
        },
        /** 
         * Handle field value updates
         */
        doOnFieldValueUpdated: function (element) {
            let currentValue = $(element).val();
            let fieldId = $(element).attr('id');

            if (currentValue === $(element).data('originalValue')) {
                $(element).removeClass('changed');
                App.FVUpdate.discard();
                App.FVSummaryLog.goBack();

            } else if (!$(element).hasClass('changed')) {
                $(element).addClass('changed');
                App.FVUpdate.addNewChange();
            }
        },
        /**
         * Undo change on field
         */
        discard: function () {
            let fieldId = "#" + App.fieldObject.id.replace("r", "");

            // If discarding a supplier GTIN table update (rf11 / rf12), reset the GTIN table in #customOverlayPanel
            if (App.fieldObject.carouselIndex !== undefined && App.FVUom && typeof App.FVUom.resetTableToInitialState === 'function') {
                App.FVUom.resetTableToInitialState(App.fieldObject.carouselIndex);
            } else if ($(fieldId).is('input[type="checkbox"]')) {
                $(fieldId).prop('checked', $(this).data('originalValue'));
                $(fieldId).parent().removeClass('checkbox-warning');
                $(fieldId).parent().addClass('checkbox-default');
            } else {
                $(fieldId).val($(fieldId).data('originalValue'));
            }

            //hide in table
            $("#" + App.fieldObject.id).hide();
            App.fieldObject.comment = "";
            App.fieldObject.reviewDone = false;

            //remove change highlight and move back (keep overlay open if currently open)
            $(fieldId).removeClass(App.focusableClasses.join(" "));
            var keepOverlayOpen = $('#customOverlayPanel').hasClass('open');
            App.FVSummaryLog.goBack(keepOverlayOpen);

            //assess confirm button vis
            App.FVUpdate.showOrHideConfirmButton();
        },
        /**
         * Show or hide confirm button depending on the change list count
         */
        showOrHideConfirmButton: function () {
            if (App.FVSummaryLog.getChangesCount() > App.initialUpdatesCount) {
                $("#btnConfirm").show();
            } else {
                $("#btnConfirm").hide();
            }
        },
        /**
         * Add new change on log and switch to change details view
         */
        addNewChange: function () {
            //show row on change log    
            $("#" + App.fieldObject.id).show();

            //to change view if not yet in there
            App.FVUpdate.showChangeDetailsForCurrentField();

            //assess confirm button vis
            App.FVUpdate.showOrHideConfirmButton();
        },
        /**
         * Focus on change
         */
        focusOnChange: function (fieldId) {
            //get field object
            App.fieldObject = App.updateFields.find(item => item.id === (fieldId));

            //to tab and field    
            $('.nav-tabs .active').removeClass('active');
            $('.tab-pane').removeClass('active');
            $('#' + App.fieldObject.tab).tab('show');
            $('#' + App.fieldObject.tab).addClass('active');
            $('.' + App.fieldObject.tab).addClass('active');

            //update breadcrumbs for the new tab
            if (App.FVDetails && typeof App.FVDetails.getSectionsById === 'function') {
                let sections = App.FVDetails.getSectionsById('#' + App.fieldObject.tab);
                if (sections) {
                    sections.forEach((section, index) => {
                        const breadcrumbItem = document.querySelector(`#n${index + 1}`);
                        if (breadcrumbItem) {
                            breadcrumbItem.textContent = section;
                            breadcrumbItem.parentElement.style.display = "list-item";
                        }
                    });
                    for (let i = sections.length + 1; i <= 10; i++) {
                        const breadcrumbItem = document.querySelector(`#n${i}`);
                        if (breadcrumbItem) {
                            breadcrumbItem.parentElement.style.display = "none";
                        }
                    }
                }
                if (typeof App.FVDetails.adjustMainPanelHeight === 'function') {
                    setTimeout(function () {
                        App.FVDetails.adjustMainPanelHeight();
                    }, 50);
                }
            }

            //to change view if not yet in there
            App.FVUpdate.showChangeDetailsForCurrentField();

            // If the change belongs to a supplier GTIN carousel slide inside #customOverlayPanel, open/position the overlay panel;
            // otherwise, if #customOverlayPanel is open, close it when focusing on a field outside the overlay
            if (App.fieldObject && App.fieldObject.carouselIndex !== undefined && App.FVUom) {
                if ($('#customOverlayPanel').hasClass('open')) {
                    App.FVUom.moveTo(App.fieldObject.carouselIndex, 300);
                } else if (typeof App.FVUom.openOverlayPanel === 'function') {
                    App.FVUom.openOverlayPanel(App.fieldObject.carouselIndex);
                }
            } else if ($('#customOverlayPanel').hasClass('open')) {
                if (App.FVUom && typeof App.FVUom.closeOverlayPanel === 'function') {
                    App.FVUom.closeOverlayPanel(true);
                } else {
                    $('#customOverlayPanel').removeClass('open');
                }
            }
        },
        /**
         * Discard all updates
         */
        discardAll: function () {
            $('input[type="text"],input[type="checkbox"], input[type="date"],select').each(function () {
                if ($(this).is('input[type="checkbox"]')) {
                    $(this).prop('checked', $(this).data('originalValue'));
                    $(this).parent().removeClass('checkbox-warning');
                    $(this).parent().addClass('checkbox-default');
                } else {
                    $(this).val($(this).data('originalValue'));
                }

                //$(this).removeClass(App.discardRemoveClass);
                $(this).removeClass(App.focusableClasses.join(" "));
            });

            $('[id^="rf"]').hide();
            if (App.FVUom && typeof App.FVUom.resetTableToInitialState === 'function') {
                App.FVUom.resetTableToInitialState(0);
                App.FVUom.resetTableToInitialState(1);
            }
            App.FVSummaryLog.switchToProductMainInfoView();

            //assess confirm button vis
            App.FVUpdate.showOrHideConfirmButton();
        },
        /**
        * Confirm on submit
        */
        submitUpdateRequest: function () {
            //set all to readonly
            $('input[type="text"]').prop('readonly', true);
            $('input[type="checkbox"], select').prop('disabled', true);

            //show block comment
            $("#blockStatement").show();

            //reset change log
            $('[id^="rf"]').hide();

            //display main info and hide change log
            App.FVSummaryLog.switchToProductMainInfoView();

            //hide confirm button
            App.FVUpdate.showOrHideConfirmButton();
        },
        /** 
         * Attach the button to all input elements starting with "f" and position it
         */
        attachGoButtons: function () {
            $('input[id^="f"]:disabled,select[id^="f"]:disabled,textarea[id^="f"]:disabled:not(#cComment,#fComment),.dTable').hover(
                function () {
                    App.FVUpdate.openNavigationFeatureToField($(this));
                },
                function () {
                    var button = $(this).parent().find(".btn-go");
                    if (!button.is(':hover')) {
                        button.slideUp(200);
                    }
                }
            );
        },
        /** 
         * Open navigation feature to field
         */
        openNavigationFeatureToField: function (input) {
            var fieldId = input.attr('id');
            if (!fieldId || !App.updateFields || !App.updateFields.some(function (item) { return item.id === ("r" + fieldId); })) {
                return;
            }

            var $parent = input.parent();
            if ($parent.css('position') === 'static') {
                $parent.css('position', 'relative');
            }

            var button = $parent.find(".btn-go");

            if (button.length === 0) {
                button = App.buttonTemplate.clone().css({
                    position: 'absolute',
                    margin: 0,
                    padding: '0 4px',
                    display: 'none',
                    opacity: 0.6,
                    'z-index': 999999
                }).appendTo($parent);

                button.click(function () {
                    button.css("opacity", "0.6");

                    //get field object
                    App.fieldObject = App.updateFields.find(item => item.id === ("r" + fieldId));
                    App.FVUpdate.showChangeDetailsForCurrentField();
                });

                button.hover(
                    function () {
                        button.css("opacity", "1");
                    },
                    function () {
                        button.css("opacity", "0.6");
                        if (!input.is(':hover')) {
                            button.slideUp(200);
                        }
                    }
                );
            }

            // Align button dynamically to match the target component's exact position and height
            var inputRect = input[0].getBoundingClientRect();
            var parentRect = $parent[0].getBoundingClientRect();
            var isTable = input.hasClass('dTable') || input.is('table');
            var ratio = isTable ? 0.15 : 0.3;
            var btnWidth = Math.max(36, Math.round(inputRect.width * ratio));
            var btnLeft = (inputRect.left - parentRect.left) + (inputRect.width - btnWidth);
            var btnTop = inputRect.top - parentRect.top;

            button.css({
                top: btnTop + 'px',
                left: btnLeft + 'px',
                right: 'auto',
                height: inputRect.height + 'px',
                width: btnWidth + 'px',
                lineHeight: inputRect.height + 'px'
            });

            button.stop(true, true).slideDown(200).show();
        },
        /**
         * Undo change evaluation
         */
        undoChangeEvaluation: function () {
            if (App.fieldObject.requestable && App.fieldObject.review && App.discardWhenRequestableIsUndone) {
                App.FVUpdate.discard();
                return;
            }

            App.fieldObject.reviewDone = false;
            if (!App.fieldObject.review && App.fieldObject.requestable) {
                App.fieldObject.comment = "";
                $("#cComment").val("");
            }
            if (App.fieldObject.actionBtnId) {
                $(App.fieldObject.actionBtnId).show();
            }
            $("#cComment").removeClass("rejected");
            $("#txtRequired").hide();
            App.FVUpdateStepSpecific.showOrHideActionButtons();

            //remove last comment done
            $('.tm-items li.' + App.fieldObject.timeline + ':last').hide();
            App.FVUpdate.showTimelineForCurrentField();

            //get field object
            let fieldId = "#" + App.fieldObject.id.replace("r", "");

            //update field border color
            if ($(fieldId).is('input[type="checkbox"]')) {
                $(fieldId).parent().removeClass();
                $(fieldId).parent().addClass('checkbox-custom checkbox-warning');
            } else {
                $(fieldId).removeClass('approvedL1 rejected c_requested');

                if (App.fieldObject.review) {
                    $(fieldId).addClass('changed');
                }
            }

            //update in table
            let tableIcon = $("#" + App.fieldObject.id).find('i:first');

            if (App.fieldObject.review) {
                tableIcon.removeClass();
                tableIcon.addClass('fas fa-plus');
                tableIcon.css("color", 'darkgray');
                tableIcon.attr('data-original-title', 'New');
            } else {
                $("#" + App.fieldObject.id).hide();
            }

            //assess confirm button vis
            App.FVUpdate.showOrHideConfirmButton();
        },
        /**
         * Reject change
         */
        rejectChange: function () {
            //comment is mandatory on rejection
            if (!App.FVUpdate.isValidRequiredComment()) {
                return;
            }

            //review done and rejected correctly            
            App.FVUpdateStepSpecific.doOnReject();
            App.FVUpdate.addCommentOnApproveOrReject(App.Actions.REJECT);
            App.FVUpdateStepSpecific.showOrHideActionButtons();

            //get field object
            let fieldId = "#" + App.fieldObject.id.replace("r", "");

            //update field border color
            if ($(fieldId).is('input[type="checkbox"]')) {
                $(fieldId).parent().removeClass();
                $(fieldId).parent().addClass('checkbox-custom checkbox-danger');
            } else {
                $(fieldId).removeClass('changed approvedL1');
                $(fieldId).addClass('rejected');
            }

            //update in table
            let tableIcon = $("#" + App.fieldObject.id).find('i:first');
            tableIcon.removeClass();
            tableIcon.addClass('fas fa-ban');
            tableIcon.css("color", 'darkred');
            tableIcon.attr('data-original-title', 'Rejected');
        },
        /**
         * Approve change
         */
        approveChange: function (appLevel) {
            App.fieldObject.reviewDone = true;
            App.FVUpdate.addCommentOnApproveOrReject(App.Actions.APPROVE);
            App.FVUpdateStepSpecific.showOrHideActionButtons();

            //get field object
            let level = App.approvalLevels.find(item => item.id === appLevel);
            let fieldId = "#" + App.fieldObject.id.replace("r", "");

            //update field border color
            if ($(fieldId).is('input[type="checkbox"]')) {
                $(fieldId).parent().removeClass();
                $(fieldId).parent().addClass('checkbox-custom checkbox-' + level.checkStyle);
            } else {
                $(fieldId).removeClass('changed approvedL1');
                $(fieldId).addClass(level.inputStyle);
            }

            //update in table
            let tableIcon = $("#" + App.fieldObject.id).find('i:first');
            tableIcon.removeClass();
            tableIcon.addClass(level.icon);
            tableIcon.css("color", level.color);
            tableIcon.attr('data-original-title', level.tooltip);
        },
        /**
         * Request field update
         */
        requestFieldUpdate: function () {
            if (App.fieldObject && $('#cComment').length) {
                App.fieldObject.comment = $('#cComment').val();
            }

            //comment is mandatory on rejection/request
            if (!App.FVUpdate.isValidRequiredComment()) {
                return;
            }

            App.fieldObject.reviewDone = true;

            // Hide corresponding "Request update" button in the overlay panel if applicable
            if (App.fieldObject.actionBtnId) {
                $(App.fieldObject.actionBtnId).hide();
            }

            //show row on change log    
            $("#" + App.fieldObject.id).show();
            App.FVUpdate.addCommentOnApproveOrReject(App.Actions.REQUEST);

            //show only relevant fields
            App.FVUpdateStepSpecific.showOrHideActionButtons();

            //ADD orange/cyan border to field
            let fieldId = "#" + App.fieldObject.id.replace("r", "");
            $(fieldId).addClass('c_requested');

            //show relevant timeline
            App.FVUpdate.showTimelineForCurrentField();

            //assess confirm button vis
            App.FVUpdate.showOrHideConfirmButton();
        },
        /**
         * Handle error on comment missing
         * @returns 
         */
        isValidRequiredComment: function () {
            if (!App.fieldObject.comment) {
                $("#txtRequired").show();
                $("#cComment").addClass("rejected");
                return false;
            } else {
                $("#txtRequired").hide();
                $("#cComment").removeClass("rejected");
                return true;
            }
        },
        /**
         * Add new comment and hide input for new ones
         * @param {} action 
         */
        addCommentOnApproveOrReject: function (action) {
            var cObject;
            var color;
            var actionText;

            switch (action) {
                case App.Actions.APPROVE:
                    color = "darkgreen";
                    actionText = "Approved";
                    break;
                case App.Actions.REJECT:
                    color = "darkred";
                    actionText = "Rejected";
                    break;
                case App.Actions.REQUEST:
                    color = "darkorange";
                    actionText = "Change requested";
                    break;
                default:
                    color = "gray";
                    actionText = "Unknown";
            }

            $('.' + App.fieldObject.timeline).each(function () {
                if (!$(this).is(':visible')) {
                    cObject = $(this);

                    //update span with action
                    var spanElement = cObject.find('span:first');
                    spanElement.css("color", color);
                    spanElement.text(actionText);

                    cObject.show();
                }
            });

            if (!cObject) {
                cObject = $('.' + App.fieldObject.timeline).first().clone();
                cObject.find('p:first').text(App.commentText);
                cObject.find('p:first').prepend('<span style="color:' + color + ';font-size:larger">' + actionText + '</span>');
                // Append the cloned `<ol>` to the last `<li>`
                $('#secTimeline .tm-items').append(cObject);
            }

            //update comment
            cObject.find('p:last').text(App.fieldObject.comment);
        },
        /**
         * Show timeline for current field
         */
        showTimelineForCurrentField: function () {
            //show relevant timeline only when timeline items exist for the field
            if (App.FVUpdateStepSpecific.displayTimeline() && App.fieldObject && App.fieldObject.timeline && $("." + App.fieldObject.timeline).length > 0) {
                $("#secTimeline").show();
                $('[class^="time_if"]').hide();
                $("." + App.fieldObject.timeline).show();
            } else {
                $("#secTimeline").hide();
            }
        }

    };

    App.FVUpdate = FVUpdate;

})(jQuery);
