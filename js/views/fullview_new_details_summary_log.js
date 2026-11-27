(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Full view summary log logic (New UI layout)
    var FVSummaryLog = {
        /**
         * Initializes the Full view summary log module.
         */
        initialize: function () {
            $("#toggleButton").click(function () {
                $(".toggleable").slideToggle();
                $("#toggleButton").text(function (i, text) {
                    return text === "See more" ? "See less" : "See more";
                });
            });
        },
        /**
         * Removes error style from an element.
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
            $("#pChange").hide();

            if (!$("#accMainInfo").hasClass("show")) {
                $("#accMainInfo").addClass("show");
                $("#accChangeRequest").removeClass("show");
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
         * @param {boolean} [keepOverlayOpen=false] - If true, keeps #customOverlayPanel open while switching the left panel.
         */
        backToChangeRequestMainView: function (keepOverlayOpen) {
            //update title
            $('#titleDet').text('Update requests logs and history');
            if (App.spanElement) {
                $('#titleDet').prepend(App.spanElement);
            }
            $("#actionBadge").hide();
            $(".info-link-u").show();

            // Close GTIN overlay panel if open and not explicitly asked to keep it open
            if (!keepOverlayOpen && $('#customOverlayPanel').hasClass('open')) {
                $('#customOverlayPanel').removeClass('open');
            }

            //switch panels
            if ($('#pChangeDet').is(':visible')) {
                $('#pChangeMain').show('flip', function () {
                    $('#pChangeDet').hide('flip');
                });
            } else {
                $('#pChangeMain').show();
                $('#pChangeDet').hide();
            }
        },
        /**
         * Switch to change view only if not yet visible
         */
        switchToChangeView: function () {
            $("#pChange").show();

            if (!$("#accChangeRequest").hasClass("show")) {
                $("#accChangeRequest").addClass("show");
                $("#accMainInfo").removeClass("show");
                $("#accBer").removeClass("show");
            }
        },
        /**
         * Switch to BER view only if not yet visible
         */
        switchToBERView: function () {
            if (!$("#accBer").hasClass("show")) {
                $("#accBer").addClass("show");
                $("#accMainInfo").removeClass("show");
                $("#accChangeRequest").removeClass("show");
            }
        },
        /**
         * Go back one step or two in case no more changes are left
         * @param {boolean} [keepOverlayOpen=false] - If true, keeps #customOverlayPanel open while switching the left panel.
         */
        goBack: function (keepOverlayOpen) {
            $("#actionBadge").hide();
            if (App.FVSummaryLog.getChangesCount() > 0) {
                App.FVSummaryLog.backToChangeRequestMainView(keepOverlayOpen);
            } else {
                App.FVSummaryLog.switchToProductMainInfoView();
            }
        }
    };

    App.FVSummaryLog = FVSummaryLog;

})(jQuery);
