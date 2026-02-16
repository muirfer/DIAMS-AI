(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    // Module for handling Fost+ logic
    var FVFostPlus = {
        rows: 1,

        /**
         * Initializes the Fost+ module.
         */
        initialize: function () {
            this.bindEvents();
            //this.adaptForVendor(); // Default view
        },

        bindEvents: function () {
            var self = this;

            // Multiselect initialization if needed (check if plugin is available globally)
            if ($.fn.multiselect) {
                $('#example-getting-started').multiselect();
            }

            // Bind checkbox for "Fost+ information not yet available"
            $(document).on('click', '#chk_nfp', function () {
                self.hideAll();
            });

            // Bind checkbox for "Do not inform Primary packaging"
            $(document).on('click', '#chk_not_inform', function () {
                self.changePrimaryVisiblity();
            });

            // "See more" button in Primary Packaging table
            $(document).on("click", "#see-more-btn", function (e) {
                e.preventDefault();
                $(".optP").toggleClass("hidden");
                $(this).text(function (i, text) {
                    return text === "see more" ? "see less" : "see more";
                });
            });

            // Wizard navigation buttons
            $(document).on('click', '.wizard-steps a', function (e) {
                // Prevent default click if not handled by bootstrap tab
                // e.preventDefault(); 
            });

            // Dropdown change events for Wizard
            $('#dropdown1').change(function () {
                self.handleDropdown1Change($(this));
            });

            $('#dropdown2').change(function () {
                self.handleDropdown2Change($(this));
            });

            $('#dropdown3').change(function () {
                self.handleDropdown3Change($(this));
            });

            // Bind change event to numeric inputs for totaling
            $('#numericSection').on('change', '.numeric-input', function () {
                self.updateTotalSum();
            });
        },

        hideAll: function () {
            if ($("#chk_nfp").is(":checked")) {
                $(".fpcont").hide();
                $(".lblNoInfo").show();
            } else {
                $(".fpcont").show();
                $(".lblNoInfo").hide();
            }
        },

        changePrimaryVisiblity: function () {
            if ($("#chk_not_inform").is(":checked")) {
                $("#pp_table").hide(); // Assuming table has this ID or class
                $("#l_modal").hide();
            } else {
                $("#pp_table").show();
                $("#l_modal").show();
            }
        },

        showImage: function (show) {
            if (show) {
                $("#img").show();
            } else {
                $("#img").hide();
            }
        },

        // Wizard Navigation Functions
        addPackaging: function (name) {
            $('#opt2').addClass('active');
            $('#opt1').removeClass('active');
            $('#w1-element').addClass('active');
            $('#w1-type').removeClass('active');
            $(".previous").show();
            $(".next").show();
            $("#titleElementSel").text("Available options for " + name);
        },

        goNext: function () {
            $('#opt3').addClass('active');
            $('#opt2').removeClass('active');
            $('#w1-details').addClass('active');
            $('#w1-element').removeClass('active');
            $(".next").hide();
            $(".finish").show();
        },

        goBack: function () {
            var backToStart = $('#opt2').hasClass('active');
            $(".finish").hide();

            if (backToStart) {
                $('#opt1').addClass('active');
                $('#opt2').removeClass('active');
                $('#w1-type').addClass('active');
                $('#w1-element').removeClass('active');
                $(".previous").hide();
            } else {
                $('#opt2').addClass('active');
                $('#opt3').removeClass('active');
                $('#w1-element').addClass('active');
                $('#w1-details').removeClass('active');
                $(".next").show();
            }
        },

        toGuidedMode: function (goIntoGuidedMode) {
            if (goIntoGuidedMode) {
                $(".guided").show();
                $(".basic").hide();
            } else {
                $(".guided").hide();
                $(".basic").show();
            }
        },

        fetchOptions: function (selectedOption, dropdownNumber) {
            // Logic moved from source HTML
            var options = [];

            if (selectedOption === 'option1') {
                options = ['Pure glass', 'Complex packaging consisting of mostly glass'];
            } else if (selectedOption === 'Pure glass' || selectedOption === 'Complex packaging consisting of mostly glass'
                || selectedOption === 'Steel> 50µ' || selectedOption === 'Complex packaging consisting of mostly steel <50% >50µ') {
                options = ['No additional details required'];
            } else if (selectedOption === 'No additional details required') {
                options = ['No additional details required'];
            } else if (selectedOption === 'option2') {
                options = ['100% Paper/Cardboard', '95% Paper/Cardboard', '90% Paper/Cardboard'];
            } else if (selectedOption === '100% Paper/Cardboard') {
                options = ['Not laminated'];
            } else if (selectedOption === 'Not laminated' || selectedOption === 'Laminated on one side' || selectedOption === 'Laminated on both sides') {
                options = ['Virgin material', 'Recycled material'];
            } else if (selectedOption === '95% Paper/Cardboard') {
                options = ['Laminated on one side', 'Not laminated'];
            } else if (selectedOption === '90% Paper/Cardboard') {
                options = ['Laminated on one side', 'Laminated on both sides', 'Not laminated'];
            } else if (selectedOption === 'option3') {
                options = ['Steel> 50µ', 'Complex packaging consisting of mostly steel <50% >50µ'];
            }

            var $dropdown = $('#dropdown' + dropdownNumber);
            $dropdown.empty().append('<option value="">Select Option</option>');

            options.forEach(function (option) {
                $dropdown.append('<option value="' + option + '">' + option + '</option>');
            });
        },

        handleDropdown1Change: function ($dropdown) {
            var selectedOption = $dropdown.val();
            if (selectedOption === '') {
                this.disableAndResetDropdowns(2);
            } else {
                this.fetchOptions(selectedOption, 2);
                $('#dropdown2').prop('disabled', false);
                this.disableAndResetDropdowns(3);
            }
        },

        handleDropdown2Change: function ($dropdown) {
            var selectedOption = $dropdown.val();
            if (selectedOption === '') {
                this.disableAndResetDropdowns(3);
            } else {
                this.fetchOptions(selectedOption, 3);
                $('#dropdown3').prop('disabled', false);
                this.disableAndResetDropdowns(4);
            }
        },

        handleDropdown3Change: function ($dropdown) {
            var selectedOption = $dropdown.val();
            if (selectedOption === '') {
                this.disableAndResetDropdowns(4);
            } else {
                this.fetchOptions(selectedOption, 4);
                $('#dropdown4').prop('disabled', false);
            }
        },

        disableAndResetDropdowns: function (startingDropdown) {
            for (var i = startingDropdown; i <= 4; i++) {
                $('#dropdown' + i)
                    .prop('disabled', true)
                    .empty()
                    .append('<option value="">Select Option</option>');
            }
        },

        onAddCompleted: function () {
            this.goBack();
            this.goBack();

            // Logic to add the specific mocked row as per source HTML
            var newElement = $("#FPtableBody #row1").clone();
            $(newElement).attr("id", "row" + (++this.rows));
            $(newElement).find("#sapId").text("10000001360");
            $(newElement).find("#mainTitle").text("Paper/Carton >90% - 1 Prim Main - virgin");
            $(newElement).find("#pec").text("11. Cubitainer, Bag in box");
            $(newElement).find(".optP").remove();
            $(newElement).find("#reus").remove();
            $(newElement).find("#see-more-btn").remove();

            // Visual indicators based on row count (mock logic from source)
            if (this.rows === 3) {
                $(newElement).find("#cat").html("Other <p style=\"font-size: x-small;line-height: 15px;\">Primary Packaging</p>");
                $(newElement).find("#cat").css("background-color", "ghostwhite");
            } else if (this.rows > 3) {
                $(newElement).find("#cat").html("Multipack <p style=\"font-size: x-small;line-height: 15px;\">Primary Packaging</p>");
                $(newElement).find("#cat").css("background-color", "linen");
            }

            $(newElement).appendTo("#FPtableBody");

            // Close modal - using magnificPopup if available
            if ($.magnificPopup) {
                $.magnificPopup.close();
            }
        },

        updateTotalSum: function () {
            var totalSum = 0;
            $('.numeric-input').each(function () {
                totalSum += parseFloat($(this).val()) || 0;
            });

            $('#totalSum').val(totalSum.toFixed(2));
            if (totalSum == 100) {
                $('#totalSum').css("color", "darkgreen");
                $('#totalMsge').hide();
            } else {
                $('#totalSum').css("color", "darkorange");
                $('#totalMsge').show();
            }
        }
    };

    App.FVFostPlus = FVFostPlus;

})(jQuery);
