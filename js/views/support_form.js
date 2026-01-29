(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Support Form logic
    var SupportForm = {

        /**
         * Toggles the visible process section (Creation, Update, User Account).
         * Updates button states and resets all operation-specific fields.
         * @param {HTMLElement} btn - The clicked button element
         * @param {number} index - Process index (1: Creation, 2: Update, 3: User Account)
         */
        toggleProcess: function (btn, index) {
            //update buttons
            $(".btnPR").removeClass("btn-primary");
            $(".btnPR").addClass("btn-default");
            $(btn).addClass("btn-primary");

            //update operations back to default
            $('#accordion3 .selOp').removeClass('selOp');
            $("#operDefault").addClass("selOp");
            $("#repoSubtitle").text("Generic / Others");
            $("#repoProcess").text($(btn).text().trim());

            //reset operations visibles on 2
            $(".accPC").hide()
            $(".accPU").hide()

            //reset panels and dropdown values	
            $(".ipu").hide()
            $("#sec_prod_id").show()
            $(".issueDet").hide()
            $(".iacc").hide()
            $(".isub").hide()
            $(".isub2").hide()
            $(".igdsn").hide()
            $(".issueDetInput").hide();
            $('#selClass').val(0);
            $('#selInput').val(0);

            //adapt per operation type
            if (index === 1) {
                //Product creation
                $(".accPC").show()
            } else if (index === 2) {
                //Product view / update
                $(".accPU").show()
                $(".ipu").show()
            } else if (index === 3) {
                //Product view / update
                $("#sec_prod_id").hide()
                $(".iacc").show()
                $(".issueDet").show()
                $("#sec_prod_id").hide()
            }
        },

        /**
         * Updates the report form based on the selected specific operation.
         * Shows/hides relevant input fields and updates the subtitle.
         * @param {number} index - Operation index defining which fields to show
         * @param {HTMLElement} element - The clicked link element
         */
        adaptReport: function (index, element) {
            var selText = $(element).text().trim();
            $("#repoSubtitle").text(selText);
            $('#accordion3 .selOp').removeClass('selOp');
            $(element).addClass("selOp");

            //hide all and reset
            $(".isub").hide();
            $(".isub2").hide();
            $(".iacc").hide();
            $(".igdsn").hide();
            $(".issueDet").hide();
            $(".issueDetInput").hide();
            $('#selClass').val(0);
            $('#selInput').val(0);

            if (index === 3) {
                //product creation - gdsn
                $(".igdsn").show();
                $(".issueDet").show();
            } else if (index === 4) {
                //product creation - form input					
                $(".issueDetInput").show();
            } else if (index === 7) {
                //product creation - submit					
                $(".isub").show();
                $(".issueDet").show();
            } else if (index === 12) {
                //product update - form input					
                $(".issueDetInput").show();
            } else if (index === 14) {
                //product creation - submit					
                $(".isub2").show();
                $(".issueDet").show();
            }
        }
    };

    App.SupportForm = SupportForm;

})(jQuery);
