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
    App.buttonTemplate = $('<button type="button" class="mb-1 mt-1 mr-1 btn btn-info btn-go">Go</button>');

    // Module for handling common update logic in Full view details panel
    var FVUpdate = {
        /**
         * Initializes the Update module.
         * Sets up event handlers.
         */
        initialize: function () {
            //store span element
            App.spanElement = $('#titleDet span')

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
         *  On laod, store all fields original values
         */
        storeAllFieldsOriginalValues: function () {
            /** On laod, store all fields original values for input and select values */
            $('input, select, textarea:not(#cComment,#fComment)').each(function () {
                var input = $(this);
                input.data('originalValue', input.val());
                input.attr("readonly", "readonly")
                input.attr("disabled", "disabled")
            });

            /** On laod, store all checkbox fields original values */
            $('input[type="checkbox"]').each(function () {
                $(this).data('originalValue', $(this).is(':checked'));
                $(this).attr("disabled", "disabled")
            });
        },
        /**
         * On field focus, determine fieldObject to treat and focus on change details if applies
         */
        initializeAllFieldsFocusEvent: function () {
            $('input, select, textarea:not(#cComment,#fComment)').on('focus', function () {
                let fieldId = $(this).attr('id');

                //get field object
                App.fieldObject = App.updateFields.find(item => item.id === ("r" + fieldId));

                if (App.fieldObject && $(this).hasClass("changed")) {
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
            $('input[type="text"]:not(.dateInput),input[type="date"],textarea:not(#cComment,#fComment)').on('input', function () { App.FVUpdate.doOnFieldValueUpdated($(this)); });
            $('.dateInput').on('changeDate', function () { App.FVUpdate.doOnFieldValueUpdated($(this)); });
            $('select').on('change', function () { App.FVUpdate.doOnFieldValueUpdated($(this)); });

            /** Same as above but for checkboxes - special case*/
            $('input[type="checkbox"]').on('change', function () {
                let currentValue = $(this).is(':checked');
                let fieldId = $(this).attr('id')
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
            if ($('#cComment')) {
                $('#cComment').on('change', function () {
                    App.fieldObject.comment = $(this).val();
                });
            }

            if ($('#blockStatement')) {
                $("#blockStatement").click(function () {
                    App.FVSummaryLog.switchToChangeView();
                });
            }
        },
        /**
         * Show change details for current field being focused
         */
        showChangeDetailsForCurrentField: function () {
            $('#titleDet').text(App.fieldObject.label);
            $("#cComment").val(App.fieldObject.comment)
            $('#titleDet span').hide();

            //show relevant input field
            $('[id^="if"]').hide();

            if (App.fieldObject.requestable) {
                if (("#actionBadge")) {
                    $("#actionBadge").text("Update Request");
                    $("#actionBadge").removeClass("badge-info");
                    $("#actionBadge").addClass("badge-warning");
                    $("#actionBadge").attr('data-original-title', "Update Request");
                    $(".old").hide();
                }
            } else {
                if (("#actionBadge")) {
                    $("#actionBadge").text("Updated");
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
            $('#pChangeDet').show('flip', function () {
                // Hide the "pChangeDet" panel with a flip animation
                $('#pChangeMain').hide('flip');
            });

            //hide or show action buttons
            App.FVUpdateStepSpecific.showOrHideActionButtons();

            //show relevant timeline
            App.FVUpdateStepSpecific.showTimelineForCurrentField();
        },
        doOnFieldValueUpdated: function (element) {
            let currentValue = $(element).val()
            let fieldId = $(element).attr('id')

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

            //reset value
            if ($(fieldId).is('input[type="checkbox"]')) {
                $(fieldId).prop('checked', $(this).data('originalValue'));
                $(fieldId).parent().removeClass('checkbox-warning');
                $(fieldId).parent().addClass('checkbox-default');
            } else {
                $(fieldId).val($(fieldId).data('originalValue'));
            }

            //hide in table
            $("#" + App.fieldObject.id).hide()
            App.fieldObject.comment = "";

            //remove change highlight and move back
            $(fieldId).removeClass(App.discardRemoveClass);
            App.FVSummaryLog.goBack();

            //assess confirm button vis
            App.FVUpdate.showOrHideConfirmButton();
        },
        /**
         * Show or hide confirm button depending on the change list count
         */
        showOrHideConfirmButton: function () {
            if (App.FVSummaryLog.getChangesCount() > App.initialUpdatesCount) {
                $("#btnConfirm").show()
            } else {
                $("#btnConfirm").hide()
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
            $('.tab-pane').removeClass('active');
            $('#' + App.fieldObject.tab).tab('show');
            $('#' + App.fieldObject.tab).addClass('active');


            //to change view if not yet in there
            App.FVUpdate.showChangeDetailsForCurrentField();
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

                $(this).removeClass(App.discardRemoveClass);
            });

            $('[id^="rf"]').hide();
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
        }

    };

    App.FVUpdate = FVUpdate;

})(jQuery);