(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    App.editMode = true;
    App.initialUpdatesCount = 0;
    App.discardWhenRequestableIsUndone = true;
    App.backOnTabFocusChange = true;
    App.commentText = " by Amanda Green (CE) on 03/07/2024 18:25"
    App.updateFields = [
        { id: "rf2", label: "Net weight (EA)", tab: "pUoM", requestable: true, comment: "", timeline: "time_if2", review: false, reviewDone: false },
        { id: "rf3", label: "Item set", tab: "pLogistics", requestable: true, comment: "", timeline: "time_if3", review: false, reviewDone: false },
        { id: "rf4", label: "Dangerous Symbols (GHS)", tab: "pCodes", requestable: true, comment: "", timeline: "time_if4", review: false, reviewDone: false },
        { id: "rf5", label: "Number of components (Offer)", tab: "pLinks", requestable: false },
        { id: "rf6", label: "Implantation guidelines (French)", tab: "pStore", requestable: false },
        { id: "rf10", label: "Product number used by Supplier (0010002878)", tab: "pPurchasing", requestable: false },
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
                if (!field.requestable) {
                    let fieldId = "#" + field.id.replace("r", "");
                    $(fieldId).removeAttr("readonly")
                    $(fieldId).removeAttr("disabled")
                    $(fieldId + " input[type='checkbox']").removeAttr("disabled")
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
            return App.fieldObject.reviewDone;
        },
        showOrHideActionButtons: function () {

            if (App.fieldObject.reviewDone) {
                $("#btnUndo").show()
                $("#btnRequest").hide()
                $(".rComment").hide()
            } else {
                $("#btnUndo").hide()
                $("#btnRequest").show()
                $(".rComment").show()
            }
        },
    };

    App.CRUpdateStepSpecific = CRUpdateStepSpecific;

})(jQuery);