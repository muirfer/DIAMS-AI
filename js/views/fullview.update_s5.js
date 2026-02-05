(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    App.editMode = true;
    App.initialUpdatesCount = 4;
    App.discardWhenRequestableIsUndone = true;
    App.commentText = " by Martin Spencer (MDS) on 21/09/2024 08:55"
    App.updateFields = [
        { id: "rf1", iType: "if1", label: "Product creation date", tab: "overview", comment: "", timeline: "time_if1", review: true, reviewDone: false, requestable: false },
        //{id: "rf2", iType: "if2", label : "Net weight (EA)", tab:"pUoM", comment:"", timeline:"time_if2", review: true, reviewDone: false, requestable:false},
        { id: "rf3", iType: "if3", label: "Item set", tab: "pLogistics", comment: "", timeline: "time_if3", review: true, reviewDone: false, requestable: false },
        //{id: "rf4", iType: "if4", label : "Dangerous Symbols (GHS)", tab:"pCodes", comment:"", timeline:"time_if4", review: true, reviewDone: false, requestable:false},
        //{id: "rf5", iType: "if5", label : "Number of components (Offer)", tab:"pLinks", comment:"", timeline:"time_if5", review: true, reviewDone: false, requestable:false},
        { id: "rf6", iType: "if6", label: "Implantation guidelines (French)", tab: "pStore", comment: "", timeline: "time_if6", review: true, reviewDone: false, requestable: true },
        { id: "rf10", iType: "if10", label: "Product number used by Supplier (0010002878)", tab: "pPurchasing", comment: "", timeline: "time_if10", review: true, reviewDone: false, requestable: false },
    ]

    // Module for handling Update logic in Full view details panel for S5
    var FVUpdateStepSpecific = {
        /**
         * Initializes the Update logic in Full view details panel for S5 module.
         * Sets up event handlers
         */
        initialize: function () {
            //enable only fields for current role
            App.updateFields.forEach(field => {
                if (!field.review && !field.requestable) {
                    let fieldId = "#" + field.id.replace("r", "");
                    $(fieldId).removeAttr("readonly")
                    $(fieldId).removeAttr("disabled")
                    $(fieldId + " input[type='checkbox']").removeAttr("disabled")
                }
            });

            //attach go buttons
            App.FVUpdate.attachGoButtons();
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
            return !App.fieldObject.requestable || App.fieldObject.reviewDone || (App.fieldObject.requestable && App.fieldObject.review);
        },
        /**
         * Show or hide action buttons
         */
        showOrHideActionButtons: function () {
            $("#btnUndo").text("Undo");

            if (App.fieldObject.review) {
                $("#btnDiscard").hide()

                if (App.fieldObject.requestable) {
                    $("#btnRequest").hide()
                    $("#btnUndo").show()
                    $("#btnApprove").hide()
                    $("#btnReject").show()
                    $(".rComment").show()

                    $("#btnUndo").text("Withdraw");

                } else if (App.fieldObject.reviewDone) {
                    $("#btnRequest").hide()
                    $("#btnUndo").show()
                    $("#btnApprove").hide()
                    $("#btnReject").hide()
                    $(".rComment").hide()
                } else {
                    $("#btnRequest").hide()
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
         * Complete reject request
         */
        doOnReject: function () {
            App.fieldObject.reviewDone = true;
            App.fieldObject.review = false;
        }
    };

    App.FVUpdateStepSpecific = FVUpdateStepSpecific;

})(jQuery);