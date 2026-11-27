(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    App.editMode = false;
    App.initialUpdatesCount = 0;
    App.discardWhenRequestableIsUndone = true;
    App.updateFields = [
        { id: "rf1", iType: "if1", label: "Product creation date", tab: "overview", comment: "", initValue: "30/12/2023" },
        { id: "rf2", iType: "if2", label: "Net weight (EA)", tab: "pUoM", comment: "", initValue: "4321,855" },
        { id: "rf3", iType: "if3", label: "Item set", tab: "pLogistics", comment: "", initValue: "314" },
        { id: "rf4", iType: "if4", label: "Dangerous Symbols (GHS)", tab: "pCodes", comment: "" }
    ];

    // Module for handling Update logic in Full view details panel for S1
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
         * Initializes the Update logic in Full view details panel for S1 module.
         * Sets up event handlers
         */
        initialize: function () {
            //all readonly by default    
            $('input[type="text"]').prop('readonly', true);
            $('input[type="checkbox"], select').prop('disabled', true);
            $('input[type="search"]').prop("readonly", false);
            $('input[type="search"]').prop("disabled", false);
            $(".cFilter").prop("readonly", false);
            $(".cFilter").prop("disabled", false);

            // Configure UoM GTIN overlay panel for scenario S1
            if (App.FVUom && typeof App.FVUom.configureForScenario === 'function') {
                App.FVUom.configureForScenario({
                    openBtnIcon: 'fas fa-plus',
                    openBtnTooltip: 'Open GTIN details ',
                    title: 'GTINs',
                    subtitle: 'Details of your own GTINs',
                    singleSupplierItem: true,
                    actionBtnMode: 'hide',
                    enableRadios: false,
                    showTrashOnHover: false
                });
            }
        },
        /**
         * Switch between edit and view mode
         */
        switchMode: function () {
            if (App.editMode) {
                if (App.FVSummaryLog.getChangesCount() > App.initialUpdatesCount) {
                    //discard changes and switch to view mode
                    $('input[type="text"],input[type="checkbox"], input[type="date"],select').each(function () {
                        if ($(this).is('input[type="checkbox"]')) {
                            $(this).prop('checked', $(this).data('originalValue'));
                            $(this).parent().removeClass('checkbox-warning');
                            $(this).parent().addClass('checkbox-default');
                        } else {
                            $(this).val($(this).data('originalValue'));
                        }

                        $(this).removeClass('changed');
                    });

                    $('[id^="rf"]').hide();
                    App.FVSummaryLog.switchToProductMainInfoView();

                    //assess confirm button vis
                    App.FVUpdate.showOrHideConfirmButton();
                }

                //switch mode
                $("#iconEditDiscardAll").removeClass("fa-glasses");
                $("#iconEditDiscardAll").addClass("fa-edit");

                //all readonly by default    
                $('input[type="text"]').prop('readonly', true);
                $('input[type="checkbox"], select').prop('disabled', true);

                //change mode
                App.editMode = false;

            } else {
                //switch to edit mode
                //enable only fields for current role
                App.updateFields.forEach(field => {
                    if (!field.review) {
                        let fieldId = "#" + field.id.replace("r", "");
                        $(fieldId).removeAttr("readonly");
                        $(fieldId).removeAttr("disabled");
                        $(fieldId + " input[type='checkbox']").removeAttr("disabled");
                    }
                });

                //switch mode
                $("#iconEditDiscardAll").removeClass("fa-edit");
                $("#iconEditDiscardAll").addClass("fa-glasses");
                App.editMode = true;
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
        showOrHideActionButtons: function () {
            //do nothing
        },
    };

    App.FVUpdateStepSpecific = FVUpdateStepSpecific;

})(jQuery);
