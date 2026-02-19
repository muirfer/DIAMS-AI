(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    App.editMode = true;
    App.initialUpdatesCount = 0;
    App.discardWhenRequestableIsUndone = true;
    App.backOnTabFocusChange = true;
    App.commentText = " by John Smith (Supplier) on 08/07/2024 13:50"
    App.updateFields = [
        { id: "rf1", label: "Country of origin of the product", tab: "overview" },
        { id: "rf2", label: "Net weight (EA)", tab: "pUoM", requestable: false, comment: "", timeline: "time_if2", review: true, reviewDone: false },
        { id: "rf3", label: "Item set", tab: "pLogistics", requestable: false, comment: "", timeline: "time_if3", review: true, reviewDone: false },
        { id: "rf4", label: "Dangerous Symbols (GHS)", tab: "pCodes", requestable: false, comment: "", timeline: "time_if4", review: true, reviewDone: false }
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
                $(fieldId).removeAttr("readonly")
                $(fieldId).removeAttr("disabled")
                $(fieldId + " input[type='checkbox']").removeAttr("disabled");

                if (field.review) {
                    $(fieldId).addClass("changed");
                }
            });

            //show message
            new PNotify({
                title: 'Corrections requested',
                text: 'Perform the requested corrections or reply to the requestor',
                type: 'warning',
                addclass: 'stack-bottomright',
                width: "600px"
            });
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
            return true;
        },
        showOrHideActionButtons: function () {

            if (App.fieldObject.reviewDone) {
                let fieldId = "#" + App.fieldObject.id.replace("r", "");

                if ($(fieldId).hasClass('approvedL1')) {
                    //undo button hidden if the field value was manually updated. 
                    // To Undo the user needs to set the field value to its default value 
                    // (the one equested to be updated)
                    $("#btnUndo").hide()
                } else {
                    $("#btnUndo").show()
                }

                $("#btnReject").hide()
                $(".rComment").hide()

            } else {
                $("#btnUndo").hide()
                $("#btnReject").show()
                $(".rComment").show()
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