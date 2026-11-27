(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    App.editMode = true;
    App.initialUpdatesCount = 0;
    App.discardWhenRequestableIsUndone = true;
    App.commentText = " by Amanda Green (CE) on 07/07/2024 12:30";
    App.updateFields = [
        { id: "rf1", iType: "if1", label: "Product creation date", tab: "overview", comment: "", timeline: "time_if1", review: true, reviewDone: true, requestable: false, initStatus: "approvedL1", initValue: "15/03/2024" },
        { id: "rf2", iType: "if2", label: "Net weight (EA)", tab: "pUoM", comment: "", timeline: "time_if2", review: true, reviewDone: false, requestable: false, initStatus: "rejected", initValue: "324,105" },
        { id: "rf3", iType: "if3", label: "Item set", tab: "pLogistics", comment: "", timeline: "time_if3", review: true, reviewDone: false, requestable: false, initStatus: "changed clickable-disabled", initValue: "002" },
        { id: "rf4", iType: "if4", label: "Dangerous Symbols (GHS)", tab: "pCodes", comment: "", timeline: "time_if4", review: true, reviewDone: false, requestable: false, initStatus: "changed" },
        { id: "rf5", iType: "if5", label: "Number of components (Offer)", tab: "pLinks", comment: "", timeline: "time_if5", review: true, reviewDone: false, requestable: false, initStatus: "requestable", initValue: "500" },
        { id: "rf6", iType: "if6", label: "Implantation guidelines (French)", tab: "pStore", comment: "", timeline: "time_if6", review: true, reviewDone: false, requestable: true },
        { id: "rf10", iType: "if10", label: "Product number used by Supplier (0010002878)", tab: "pPurchasing", comment: "", timeline: "time_if10", review: false, reviewDone: false, requestable: false, initValue: "9876543210001263" },
        { id: "rf11", iType: "if11", label: "0050013489 - GTIN (EA)", tab: "pUoM", comment: "", timeline: "time_if11", review: false, reviewDone: false, requestable: true },
        { id: "rf12", iType: "if12", label: "0051185194 - GTIN (EA)", tab: "pUoM", comment: "", timeline: "time_if12", review: false, reviewDone: false, requestable: true },
        { id: "rf13", iType: "if13", label: "Main GTIN (EA)", tab: "pUoM", comment: "", timeline: "time_if13", review: false, reviewDone: false, requestable: false }
    ];

    // Module for handling Update logic in Full view details panel for S4
    var FVUpdateStepSpecific = {
        /**
         * Prepare initial field values and status classes before storing original values
         */
        prepareFields: function () {
            App.updateFields.forEach(field => {
                let fieldId = "#" + field.id.replace("r", "");
                if (field.initValue !== undefined) {
                    $(fieldId).val(field.initValue);
                }
                if (field.initStatus) {
                    $(fieldId).addClass(field.initStatus);
                }
            });
        },
        /**
         * Initializes the Update logic in Full view details panel for S4 module.
         * Sets up event handlers
         */
        initialize: function () {
            //enable only fields for current role
            App.updateFields.forEach(field => {
                if (!field.review && !field.requestable) {
                    let fieldId = "#" + field.id.replace("r", "");
                    $(fieldId).removeAttr("readonly");
                    $(fieldId).removeAttr("disabled");
                    $(fieldId + " input[type='checkbox']").removeAttr("disabled");
                }
            });

            //attach go buttons
            App.FVUpdate.attachGoButtons();

            // Configure UoM GTIN overlay panel for scenario S4
            if (App.FVUom && typeof App.FVUom.configureForScenario === 'function') {
                App.FVUom.configureForScenario({
                    openBtnIcon: 'fas fa-users',
                    openBtnTooltip: 'Open GTIN details per supplier',
                    title: 'GTINs per supplier',
                    subtitle: 'Scroll through all suppliers using the navigation buttons or select a supplier with the button on the right.',
                    singleSupplierItem: false,
                    actionBtnMode: 'requestUpdate',
                    enableRadios: false,
                    showTrashOnHover: false
                });
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
            return !App.fieldObject.requestable || App.fieldObject.reviewDone || (App.fieldObject.requestable && App.fieldObject.review);
        },
        /**
         * Show or hide action buttons
         */
        showOrHideActionButtons: function () {
            if (App.fieldObject.review) {
                $("#btnDiscard").hide();

                if (App.fieldObject.requestable) {
                    $("#btnRequest").show();
                    $("#btnUndo").show();
                    $("#btnApprove").hide();
                    $("#btnReject").hide();
                } else if (App.fieldObject.reviewDone) {
                    $("#btnRequest").hide();
                    $("#btnUndo").show();
                    $("#btnApprove").hide();
                    $("#btnReject").hide();
                    $(".rComment").hide();
                } else {
                    $("#btnRequest").hide();
                    $("#btnUndo").hide();
                    $("#btnApprove").show();
                    $("#btnReject").show();
                    $(".rComment").show();
                }
            } else if (!App.fieldObject.review && !App.fieldObject.reviewDone) {
                $("#btnDiscard").show();
                $("#btnApprove").hide();
                $("#btnReject").hide();
                $("#btnUndo").hide();
                $(".rComment").show();

                if (App.fieldObject.requestable) {
                    $("#btnRequest").show();
                } else {
                    $("#btnRequest").hide();
                }

            } else {
                //update request raised
                $("#btnDiscard").hide();
                $("#btnApprove").hide();
                $("#btnReject").hide();
                $("#btnUndo").show();
                $(".rComment").hide();
                $("#btnRequest").hide();
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
