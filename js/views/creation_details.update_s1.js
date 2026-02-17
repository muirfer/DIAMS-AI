(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    App.editMode = true;
    App.initialUpdatesCount = 0;
    App.discardWhenRequestableIsUndone = true;
    App.backOnTabFocusChange = false;
    App.updateFields = [
        { id: "rf1", iType: "if1", label: "Country of origin of the product", tab: "overview", comment: "" },
        { id: "rf2", iType: "if2", label: "Net weight (EA)", tab: "pUoM", comment: "" },
        { id: "rf3", iType: "if3", label: "Item set", tab: "pLogistics", comment: "" },
        { id: "rf4", iType: "if4", label: "Dangerous Symbols (GHS)", tab: "pCodes", comment: "" }
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
                $(fieldId + " input[type='checkbox']").removeAttr("disabled")
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
            return false;
        },
        showOrHideActionButtons: function () {
            //do nothing
        },
    };

    App.CRUpdateStepSpecific = CRUpdateStepSpecific;

})(jQuery);