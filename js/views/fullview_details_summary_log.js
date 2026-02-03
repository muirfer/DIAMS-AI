(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Full view summary log logic
    var FVSummaryLog = {
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
        }
    };

    App.FVSummaryLog = FVSummaryLog;

})(jQuery);
