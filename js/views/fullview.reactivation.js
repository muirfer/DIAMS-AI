(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    App.editMode = false;
    App.initialUpdatesCount = 2;
    App.discardWhenRequestableIsUndone = true;
    App.updateFields = [
        { id: "rf1", iType: "if1", label: "For sale from", tab: "overview", comment: "", timeline: "time_if1", review: true, reviewDone: true, requestable: false },
        { id: "rf2", iType: "if2", label: "For sale till", tab: "overview", comment: "", timeline: "time_if2", review: true, reviewDone: true, requestable: false },
        { id: "rf3", iType: "if3", label: "Item set", tab: "pLogistics", comment: "", timeline: "time_if3", review: true, reviewDone: false, requestable: false },
        { id: "rf4", iType: "if4", label: "Dangerous Symbols (GHS)", tab: "pCodes", comment: "", timeline: "time_if4", review: true, reviewDone: false, requestable: false },
        { id: "rf5", iType: "if5", label: "Number of components (Offer)", tab: "pLinks", comment: "", timeline: "time_if5", review: false, reviewDone: false, requestable: true },
        { id: "rf6", iType: "if6", label: "Implantation guidelines (French)", tab: "pStore", comment: "", timeline: "time_if6", review: false, reviewDone: false, requestable: true },
        { id: "rf10", iType: "if10", label: "Product number used by Supplier (0010002878)", tab: "pPurchasing", comment: "", timeline: "time_if10", review: false, reviewDone: false, requestable: false },
    ]

    // Module for handling Update logic in Full view details panel for Reactivation
    var FVUpdateStepSpecific = {
        showError: true,

        /**
         * Initializes the Update logic in Full view details panel for Reactivation module.
         * Sets up event handlers
         */
        initialize: function () {
            //all readonly by default    
            App.updateFields.forEach(field => {
                if (!field.review && !field.requestable) {
                    let fieldId = "#" + field.id.replace("r", "");
                    $(fieldId).removeAttr("readonly")
                    $(fieldId).removeAttr("disabled")
                    $(fieldId + " input[type='checkbox']").removeAttr("disabled")
                }
            });
        },
        /**
         * Show or hide action buttons
         */
        showOrHideActionButtons: function () {
            if (App.fieldObject.review) {
                $("#btnDiscard").hide()
                $("#btnRequest").hide()

                if (App.fieldObject.reviewDone) {
                    $("#btnUndo").show()
                    $("#btnApprove").hide()
                    $("#btnReject").hide()
                    $(".rComment").hide()
                } else {
                    $("#btnUndo").hide()
                    $("#btnApprove").show()
                    $("#btnReject").show()
                    $(".rComment").show()
                }
            } else if (!App.fieldObject.review && !App.fieldObject.reviewDone) {
                $("#btnDiscard").show()
                $("#btnApprove").hide()
                $("#btnReject").hide()
                $("#btnUndo").hide()
                $(".rComment").show()

                if (App.fieldObject.requestable) {
                    $("#btnRequest").show()
                } else {
                    $("#btnRequest").hide()
                }

            } else {
                //update request raised
                $("#btnDiscard").hide()
                $("#btnApprove").hide()
                $("#btnReject").hide()
                $("#btnUndo").show()
                $(".rComment").hide()
                $("#btnRequest").hide()
            }
        },
        /** 
         * Handle field value updates
         */
        doOnFieldValueUpdated: function (input) {
            App.FVUpdate.doOnFieldValueUpdated(input);
        },
        /**
         * Return true if timeline should be displayed
         */
        displayTimeline: function () {
            return false;
        },
        /**
         * Show BER status and errors
         */
        showBERStatusError: function () {
            if (this.showError) {
                $("#btnBerError").show();
                $("#btnBerError").click();
                this.showError = false;
            } else {
                $("#btnBerError").hide();
            }
        },
    };

    App.FVUpdateStepSpecific = FVUpdateStepSpecific;

})(jQuery);