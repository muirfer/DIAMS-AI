(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    const animationDelay = 3000;
    const initValue = 50;
    const entries = [
        { id: "pb00_dis_01", section: "pb00", vis: false, isSuma: false, valor: 0 },
        { id: "pb00_dis_02", section: "pb00", vis: false, isSuma: false, valor: 0 },
        { id: "pb00_dis_03", section: "pb00", vis: false, isSuma: false, valor: 0 },
        { id: "pb00_cos_01", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "pb00_cos_02", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "pb00_cos_03", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "pb00_cos_04", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "pb00_cos_05", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "pb00_tax_01", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "pb00_tax_02", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "pb00_tax_03", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "pb00_tax_04", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "pb00_tax_05", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "pb00_tax_06", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "pb00_tax_07", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "pb00_tax_08", section: "pb00", vis: false, isSuma: false, valor: 0 },
        { id: "pb00_tax_09", section: "pb00", vis: false, isSuma: true, valor: 0 },
        { id: "zpaf_reb_01", section: "zpaf", vis: false, isSuma: false, valor: 0 },
        { id: "zpaf_reb_02", section: "zpaf", vis: false, isSuma: false, valor: 0 },
        { id: "zpaf_reb_03", section: "zpaf", vis: false, isSuma: false, valor: 0 },
        { id: "zpaf_reb_04", section: "zpaf", vis: false, isSuma: false, valor: 0 },
        { id: "zpaf_cos_01", section: "zpaf", vis: false, isSuma: true, valor: 0 },
        { id: "zpaf_cos_02", section: "zpaf", vis: false, isSuma: true, valor: 0 },
        { id: "zpaf_cos_03", section: "zpaf", vis: false, isSuma: true, valor: 0 },
        { id: "zpaf_cos_04", section: "zpaf", vis: false, isSuma: true, valor: 0 },
        { id: "zpaf_cos_05", section: "zpaf", vis: false, isSuma: true, valor: 0 },
        { id: "zdpi_tax_01", section: "zdpi", vis: false, isSuma: true, valor: 0 },
        { id: "zdpi_tax_02", section: "zdpi", vis: false, isSuma: true, valor: 0 },
        { id: "zdpi_tax_03", section: "zdpi", vis: false, isSuma: true, valor: 0 },
        { id: "zdpi_tax_04", section: "zdpi", vis: false, isSuma: true, valor: 0 },
        { id: "zdpi_tax_05", section: "zdpi", vis: false, isSuma: true, valor: 0 },
        { id: "zdpi_tax_06", section: "zdpi", vis: false, isSuma: true, valor: 0 },
        { id: "zdpi_tax_07", section: "zdpi", vis: false, isSuma: true, valor: 0 },
        { id: "zdpi_tax_08", section: "zdpi", vis: false, isSuma: true, valor: 0 }
    ];


    // Module for handling New Prices logic in Full view details panel
    var FVPricesNew = {
        /**
         * Initializes the New Prices module.
         * Sets up event handlers and initializes DataTables.
         */
        initialize: function () {
            //do nothing
        },
        /**
         * Returns the base ID of a price condition type.
         * @param {string} fullId - The full ID of the price condition type.
         */
        getBaseId: function (fullId) {
            return fullId.substring(0, 11);
        },
        /*
        * Format numeric value forced to digits decimal places
        */
        formatValue: function (value, digits) {
            return Number.parseFloat(value).toFixed(digits)
        },
        /*
        * Make section selected visible in the panel.
        * Hide button on the selection screen (as it cannot repeat itself)
        */
        showSubsection: function (element) {
            let baseId = this.getBaseId(element.id);

            //update array
            let current = entries.find(e => e.id === baseId);
            current.vis = true;

            //close modal and update view	
            $("#" + element.id).fadeOut().delay(animationDelay);
            $("#" + baseId).fadeIn().delay(animationDelay);
        },
        /*
        * Hide section selected in the panel.
        * Restore visibility of the related button on the selection screen (so it can be added again)
        */
        remove: function (element) {
            let baseId = this.getBaseId(element.id);
            $("#" + baseId + "_perc").val(0);
            $("#" + baseId + "_val").val(0);
            $("#" + baseId + "_btn").css("display", "block");
            $("#" + baseId).fadeOut().delay(animationDelay)

            //update array
            let current = entries.find(e => e.id === baseId);
            current.valor = 0;
            current.vis = false;

            this.updateSum();
        },
        /*
        * Calculate value after percentage is updated
        * Triggers the full calculation of the grid
        */
        updatePercentage: function (element) {
            let baseId = this.getBaseId(element.id);
            let newVal = element.value * initValue / 100;

            //update screen
            element.value = this.formatValue(element.value, 2);
            $("#" + baseId + "_val").val(this.formatValue(newVal, 4));

            //update array
            let current = entries.find(e => e.id === baseId);
            current.valor = newVal;
            this.updateSum();
        },
        /*
        *  Triggers the full calculation of the grid after value is updated
        */
        updateValue: function (element) {
            //update screen
            element.value = this.formatValue(element.value, 4);

            //update array
            let current = entries.find(e => e.id === this.getBaseId(element.id));
            current.valor = Number.parseFloat(element.value);
            this.updateSum();
        },
        /*
        * Re-calculates all in the grid 
        */
        updateSum: function () {
            let total = initValue;
            let section = entries[0].section;

            entries.forEach(element => {
                if (section !== element.section) {
                    $("#subtotal_" + section).text(total.toFixed(4));
                    section = element.section;
                }

                if (element.vis) {
                    element.isSuma ? total += element.valor : total -= element.valor;
                }
            });

            //total
            $("#subtotal_zdpr").text(total.toFixed(4));

            //update mop
            this.updateMop();
        },
        /*
        * Updates the MOP (Margin Over Price) based on the current total.
        */
        updateMop: function () {
            let total = Number.parseFloat($("#subtotal_zdpr").text());
            let rsp = Number.parseFloat($("#rsp").val());
            let mopValue = 0;

            if (rsp > 0) {
                mopValue = 1 - (total / (rsp / 1.21));
            }

            //update values
            $("#rsp").val(rsp.toFixed(2));
            $("#mop").val(mopValue.toFixed(2));
        }
    };

    App.FVPricesNew = FVPricesNew;

})(jQuery);