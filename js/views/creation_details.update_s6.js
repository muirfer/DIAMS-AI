(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    App.editMode = true;
    App.initialUpdatesCount = 0;
    App.discardWhenRequestableIsUndone = false;
    App.backOnTabFocusChange = true;
    App.commentText = " by Gabriela Luna (CM) on 11/07/2024 10:51"
    App.updateFields = [
        { id: "rf2", label: "Net weight (EA)", tab: "pUoM", requestable: true, comment: "", timeline: "time_if2", review: true, reviewDone: false, initStatus: "approvedL2" },
        { id: "rf3", label: "Item set", tab: "pLogistics", requestable: true, comment: "", timeline: "time_if3", review: true, reviewDone: false, initStatus: "approvedL2" },
        { id: "rf4", label: "Dangerous Symbols (GHS)", tab: "pCodes", requestable: true, comment: "", timeline: "time_if4", review: true, reviewDone: false, initStatus: "approvedL2" },
        { id: "rf10", label: "Product number used by Supplier", tab: "pPurchasing", requestable: true, comment: "", timeline: "time_if10", review: false, reviewDone: false },
    ]

    // Module for handling Update logic in Full view details panel for S1
    var CRUpdateStepSpecific = {
        /**
         * Initializes the Update logic in Full view details panel for S1 module.
         * Sets up event handlers
         */
        initialize: function () {
            //enable only fields for current role
            App.updateFields.forEach(field => {
                let fieldId = "#" + field.id.replace("r", "");
                if (!field.requestable) {
                    $(fieldId).removeAttr("readonly")
                    $(fieldId).removeAttr("disabled")
                    $(fieldId + " input[type='checkbox']").removeAttr("disabled");
                } else if (field.review) {
                    $(fieldId).addClass(field.initStatus);
                }
            });

            //attach go buttons
            App.CRUpdate.attachGoButtons();
        },
        /** 
         * Handle field value updates
         */
        doOnFieldValueUpdated: function (input) {
            App.CRUpdate.doOnFieldValueUpdated(input);
        },
        /**
         * Return true if timeline should be displayed
         */
        displayTimeline: function () {
            return App.fieldObject.id !== "rf10" || (App.fieldObject.id === "rf10" && App.fieldObject.reviewDone);
        },
        showOrHideActionButtons: function () {

            if (App.fieldObject.reviewDone) {
                $("#btnUndo").show()
                $("#btnRequest").hide()
                $("#btnReject").hide()
                $(".rComment").hide()

            } else {
                $("#btnUndo").hide()
                $("#btnReject").show()
                $(".rComment").show()

                if (App.fieldObject.review) {
                    $("#btnRequest").hide()
                    $("#btnReject").show()
                } else {
                    $("#btnRequest").show()
                    $("#btnReject").hide()
                }
            }
        },
        /** 
        * Handle Reject events
        */
        doOnReject: function (input) {
            //nothing now
        },
    };

    App.CRUpdateStepSpecific = CRUpdateStepSpecific;

})(jQuery);