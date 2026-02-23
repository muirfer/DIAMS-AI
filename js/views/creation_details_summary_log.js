(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Full view summary log logic
    var CRSummaryLog = {
        typeManual: false,

        /**
         * Initializes the Full view summary log module.
         * Sets up event handlers and initializes DataTables.
         */
        initialize: function () {
            /**
             * Initializes the summary log section.
             * Toggles the text of the toggle button between "See more" and "See less" when clicked.
             */
            $("#toggleButton").click(function () {
                $(".toggleable").slideToggle(); // Toggle visibility of elements with class "toggleable"
                $("#toggleButton").text(function (i, text) {
                    return text === "See more" ? "See less" : "See more"; // Change button text dynamically
                });
            });
        },
        /**
         * Removes error style from an element.
         * Resets the border color of the specified element to light gray and hides the error message.
         * @param {string} selElem - The selector of the element to remove error style from.
         */
        removeErrorStyle: function (selElem) {
            $(selElem).css("border-color", "lightgray");
            $("#vError").hide();
        },
        /**
         * Switch to main view only if not yet visible
         */
        switchToProductMainInfoView: function () {
            //show change accordion if not yet visible
            $("#pChange").hide();

            //switch to info view if not yet visible
            if (!$("#accMainInfo").hasClass("show")) {
                $("#accMainInfo").addClass("show"); // Force expansion of main
                $("#accChangeRequest").removeClass("show"); // Collapse section change						
            }
        },
        /**
         * Returns how many changes are still available in the table
         * @returns 
         */
        getChangesCount: function () {
            return $('#tLog tbody tr:not([style*="display: none"])').length;
        },
        /**
         * Go back to change request main view
         */
        backToChangeRequestMainView: function () {
            //update title
            $('#titleDet').text('Update requests logs and history');
            $('#titleDet').append(App.spanElement);

            //switch panels
            $('#pChangeMain').show('flip', function () {
                // Hide the "pChangeDet" panel with a flip animation
                $('#pChangeDet').hide('flip');
            });

            // $("#pChangeDet").hide();
            // $("#pChangeMain").show();						
        },
        /**
         * Switch to change view only if not yet visible
         */
        switchToChangeView: function () {
            //show change accordion if not yet visible
            $("#pChange").show();

            //switch to change view if not yet visible
            if (!$("#accChangeRequest").hasClass("show")) {
                $("#accChangeRequest").addClass("show"); // Force expansion of change
                $("#accMainInfo").removeClass("show"); // Collapse section main info
                $("#accBer").removeClass("show"); // Collapse section BER
            }
        },
        /**
         * Switch to BER view only if not yet visible
         */
        switchToBERView: function () {
            //show BER accordion if not yet visible
            //$("#pBer").show();

            //switch to BER view if not yet visible
            if (!$("#accBer").hasClass("show")) {
                $("#accBer").addClass("show"); // Force expansion of BER
                $("#accMainInfo").removeClass("show"); // Collapse section main info
                $("#accChangeRequest").removeClass("show"); // Collapse section change
            }
        },
        /**
         * Switch to manual or gdsn type
         */
        switchToTypeManual: function () {
            $("#typeStatement li").toggleClass("warning info");

            if (this.typeManual) {
                $("#typeStatement li h3").text("09/02/2026");
                $("#typeStatement li p").text("Last update of external data (GDSN / manual)");
            } else {
                $("#typeStatement li h3").text("Manual");
                $("#typeStatement li p").text("No GDSN synchronization required");
            }

            this.typeManual = !this.typeManual;
        },
        /**
         * Go back one step or two in case no more changes are left
         */
        goBack: function () {
            if (App.CRSummaryLog.getChangesCount() > 0) {
                App.CRSummaryLog.backToChangeRequestMainView();
            } else {
                App.CRSummaryLog.switchToProductMainInfoView();
            }
        }
    };

    App.CRSummaryLog = CRSummaryLog;

})(jQuery);

