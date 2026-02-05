(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    App.editMode = true;
    App.initialUpdatesCount = 0;
    App.discardWhenRequestableIsUndone = false;
    App.commentText = " by John Smith (Supplier) on 08/07/2024 13:50"
    App.updateFields = [
        { id: "rf1", iType: "if1", label: "Product creation date", tab: "overview", comment: "", timeline: "time_if1", review: false, reviewDone: true, requestable: false },
        { id: "rf2", iType: "if2", label: "Net weight (EA)", tab: "pUoM", comment: "", timeline: "time_if2", review: true, reviewDone: false, requestable: false },
        { id: "rf3", iType: "if3", label: "Item set", tab: "pLogistics", comment: "", timeline: "time_if3", review: true, reviewDone: false, requestable: false },
        { id: "rf4", iType: "if4", label: "Dangerous Symbols (GHS)", tab: "pCodes", comment: "", timeline: "time_if4", review: true, reviewDone: false, requestable: false },
        { id: "rf5", iType: "if5", label: "Number of components (Offer)", tab: "pLinks", comment: "", timeline: "time_if5", review: true, reviewDone: false, requestable: true },
        { id: "rf6", iType: "if6", label: "Implantation guidelines (French)", tab: "pStore", comment: "", timeline: "time_if6", review: true, reviewDone: false, requestable: true },
        { id: "rf10", iType: "if10", label: "Product number used by Supplier (0010002878)", tab: "pPurchasing", comment: "", timeline: "time_if10", review: false, reviewDone: false, requestable: false },
    ]

    // Module for handling Update logic in Full view details panel for S3
    var FVUpdateStepSpecific = {
        /**
         * Initializes the Update logic in Full view details panel for S3 module.
         * Sets up event handlers
         */
        initialize: function () {
            //enable only fields for current role
            App.updateFields.forEach(field => {
                if (field.review || field.reviewDone) {
                    let fieldId = "#" + field.id.replace("r", "");
                    $(fieldId).removeAttr("readonly")
                    $(fieldId).removeAttr("disabled")
                    $(fieldId + " input[type='checkbox']").removeAttr("disabled")
                }
            });

            //Item set            
            $('select[id="f3"]').on('change', function () {
                let currentValue = $(this).val()
                let fieldId = $(this).attr('id')

                if (currentValue === $(this).data('originalValue')) {
                    //back to rejected value                    
                    $(this).removeClass('changed');
                    $(this).addClass('rejected');
                    App.fieldObject.reviewDone = false;
                    App.FVUpdate.rejectChange();

                } else if (currentValue === $("#if3").val()) {
                    //back to original value. Discard the change
                    $(this).removeClass('changed rejected');
                    App.FVUpdate.discard();
                    App.FVSummaryLog.goBack();
                } else {
                    //other value selected                    
                    $(this).removeClass('rejected');
                    $(this).addClass('changed');
                    App.fieldObject.reviewDone = true;
                    App.FVUpdate.addNewChange()

                    //update icon
                    let tableIcon = $("#" + App.fieldObject.id).find('i:first');
                    tableIcon.removeClass();
                    tableIcon.addClass('fas fa-plus');
                    tableIcon.css("color", 'darkgray');
                    tableIcon.attr('data-original-title', 'New');
                }
            });

            //attach go buttons
            App.FVUpdate.attachGoButtons();
        },
        /**
         * Return true if timeline should be displayed
         */
        displayTimeline: function () {
            return App.fieldObject.requestable || App.fieldObject.reviewDone || App.fieldObject.review;
        },
        /** 
         * Handle field value updates
         */
        doOnFieldValueUpdated: function (input) {
            var currentValue = input.val();

            if (currentValue === input.data('originalValue')) {
                //back to original value - requested to be changed
                input.removeClass('changed');
                input.addClass('c_requested');
                App.fieldObject.reviewDone = false;
                App.FVUpdateStepSpecific.showOrHideActionButtons()

                //badges
                $("#actionBadge").text("Update Request");
                $("#actionBadge").removeClass("badge-info");
                $("#actionBadge").addClass("badge-warning");
                $("#actionBadge").attr('data-original-title', "Update Request");

                $("#" + App.fieldObject.id + " .badge").text("UR");
                $("#" + App.fieldObject.id + " .badge").removeClass("badge-info");
                $("#" + App.fieldObject.id + " .badge").addClass("badge-warning");
                $("#" + App.fieldObject.id + " .badge").attr('data-original-title', "Update Request");

            } else {
                input.addClass('changed');
                input.removeClass('c_requested');

                App.fieldObject.reviewDone = true;
                App.FVUpdate.addNewChange()

                //update icon
                let tableIcon = $("#" + App.fieldObject.id).find('i:first');
                tableIcon.removeClass();
                tableIcon.addClass('fas fa-plus');
                tableIcon.css("color", 'darkgray');
                tableIcon.attr('data-original-title', 'New');
                App.FVUpdateStepSpecific.showOrHideActionButtons()

                //badge
                $("#actionBadge").text("Updated");
                $("#actionBadge").removeClass("badge-warning");
                $("#actionBadge").addClass("badge-info");
                $("#actionBadge").attr('data-original-title', "Updated");

                $("#" + App.fieldObject.id + " .badge").text("U");
                $("#" + App.fieldObject.id + " .badge").removeClass("badge-warning");
                $("#" + App.fieldObject.id + " .badge").addClass("badge-info");
                $("#" + App.fieldObject.id + " .badge").attr('data-original-title', "Updated");
            }
        },
        /**
         * Show or hide action buttons
         */
        showOrHideActionButtons: function () {
            $("#btnRequest").hide()

            if (App.fieldObject.review) {
                //rejected or requested
                if (App.fieldObject.reviewDone) {
                    $("#btnDiscard").show()
                    $("#btnApprove").hide()
                    $("#btnReject").hide()
                    $("#btnUndo").show()
                    $(".rComment").hide()

                } else {
                    if (App.fieldObject.requestable) {
                        //requested but not yet reviewd
                        $("#btnDiscard").hide()
                        $("#btnApprove").hide()
                        $("#btnReject").show()
                        $("#btnUndo").hide()
                        $(".rComment").show()
                    } else {
                        //rejected by CE but not yet reviewed
                        $("#btnDiscard").show()
                        $("#btnApprove").hide()
                        $("#btnReject").show()
                        $("#btnUndo").hide()
                        $(".rComment").show()
                    }
                }
            } else {
                //done by CE - readonly or approved
                $("#btnApprove").hide()
                $("#btnReject").hide()
                $("#btnUndo").hide()
                $(".rComment").hide()

                if (App.fieldObject.reviewDone) {
                    //approved but still can be restore
                    $("#btnDiscard").show()
                } else {
                    //done by CE
                    $("#btnDiscard").hide()
                }
            }
        },
        /**
         * Complete reject request
         */
        doOnReject: function () {
            App.fieldObject.reviewDone = true;
        }
    };

    App.FVUpdateStepSpecific = FVUpdateStepSpecific;

})(jQuery);