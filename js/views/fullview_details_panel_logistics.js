(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Basic data logic in Product Full view
    var FVLogistics = {
        /**
         * Initializes the Logistics data module.
         * Sets up event handlers 
         */
        initialize: function () {
            $("#txtDCId").click(function () {
                FVLogistics.switchDCFromDLLtoDSView();
            })
        },

        /**
         * Swtich DC from DLL to DS view
         */
        switchDCFromDLLtoDSView: function () {
            if ($(".dc-dll").is(":visible")) {
                $(".dc-dll").hide();
                $(".dc-ds").show();
            } else {
                $(".dc-dll").show();
                $(".dc-ds").hide();
            }
        }
    };

    App.FVLogistics = FVLogistics;

})(jQuery);