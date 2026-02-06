/*
Name: 			UI Elements / Notifications - Examples
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version: 	3.0.0
*/

(function ($) {

    'use strict';

    /*
    Positions
    */
    var stack_topleft = { "dir1": "down", "dir2": "right", "push": "top" };
    var stack_bottomleft = { "dir1": "right", "dir2": "up", "push": "top" };
    var stack_bottomright = { "dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15 };
    var stack_bar_top = { "dir1": "down", "dir2": "right", "push": "top", "spacing1": 0, "spacing2": 0 };
    var stack_bar_bottom = { "dir1": "up", "dir2": "right", "spacing1": 0, "spacing2": 0 };

    $('#position-3').click(function () {
        var notice = new PNotify({
            title: 'Warning',
            text: 'Nutri-score information not available',
            addclass: 'stack-bottomright',
            stack: stack_bottomright
        });

        var notice2 = new PNotify({
            title: 'Missing GDSN input',
            text: 'Not possible to submit before the following is completed. Click <a class="nLink" href="#">here</a> for more information.<br><br><ul><li><a href="#" class="nLink">Net contents of Base UoM</a></li><li><a href="#" class="nLink">BE VAT rate (%)</a></li></ul>',
            type: 'error',
            addclass: 'stack-bottomright',
            stack: stack_bottomright
        });

        var notice3 = new PNotify({
            title: 'Information',
            text: 'Product category updated given a new similar item',
            type: 'info',
            addclass: 'stack-bottomright',
            stack: stack_bottomright
        });

        var notice4 = new PNotify({
            title: 'Required fields',
            text: '<ul><li><a href="#" class="nLink" onclick="javascript:App.FVDetails.focusOnRequired(2,\'inputPtdIPGerman\')">IP - Product ticket description (German)</a></li><li><a href="#" class="nLink" onclick="javascript:focusOnRequired(1,\'inputPtdEADutch\')">EA - Product shelf description (Dutch)</a></li><li><a href="#" class="nLink">Purchase price</a></li><li><a href="#" class="nLink">Purchase price</a></li><li><a href="#" class="nLink">Traceability method</a></li><li><a href="#" class="nLink">Communication unit</a></li><li><a href="#" class="nLink">Link with type Mini Pallet</a></li><li><a href="#" class="nLink">Reordering multiple quantity</a></li><li><a href="#" class="nLink">Introduction discount validity period</a></li></ul>',
            type: 'error',
            addclass: 'stack-bottomright',
            stack: stack_bottomright
        });
    });

    $('#btnBerError').click(function () {
        var notice4 = new PNotify({
            title: 'Check the errors below and unblock the current situation by retrying, skipping or applying any other changes if required',
            text: '<ul><li><a href="#" class="nLink">Country of origin is not valid with the given combination</a></li><li><a href="#" class="nLink">Purchase price is not acceptable under these conditions</a></li><li><a href="#" class="nLink">EA unit of measure is not valid for current display product</a></li><li><a href="#" class="nLink">Traceability method cannot be combined with product specifications</a></li><li><a href="#" class="nLink">Communication unit is not in the range expected</a></li><li><a href="#" class="nLink">Link with type Mini Pallet doesn´t have a correct unit assign to it</a></li><li><a href="#" class="nLink">Reordering multiple quantity should be above 10</a></li><li><a href="#" class="nLink">Introduction discount validity period provided exceeds the accepted range</a></li></ul>',
            type: 'error',
            addclass: 'stack-bottomright',
            stack: stack_bottomright,
            width: "1200px"
        });
    });

    $('#position-3-notice').click(function () {
        var notice = new PNotify({
            title: 'Notification',
            text: 'Some notification text.',
            addclass: 'stack-bottomright',
            stack: stack_bottomright
        });
    });

    $('#position-3-success').click(function () {
        var notice = new PNotify({
            title: 'Notification',
            text: 'Some notification text.',
            type: 'success',
            addclass: 'stack-bottomright',
            stack: stack_bottomright
        });
    });

    $('#position-3-info').click(function () {
        var notice = new PNotify({
            title: 'Notification',
            text: 'Some notification text.',
            type: 'info',
            addclass: 'stack-bottomright',
            stack: stack_bottomright
        });
    });

    $('#position-3-error').click(function () {
        var notice = new PNotify({
            title: 'Notification',
            text: 'Some notification text.',
            type: 'error',
            addclass: 'stack-bottomright',
            stack: stack_bottomright
        });
    });

    $('#position-3-dark').click(function () {
        var notice = new PNotify({
            title: 'Notification',
            text: 'Some notification text.',
            addclass: 'notification-dark stack-bottomright',
            icon: 'fas fa-user',
            stack: stack_bottomright
        });
    });




}).apply(this, [jQuery]);

/**
 * Focuses on a required input field and navigates to a specific carousel slide.
 * @param {number} slideIndexToNavigate - The index of the carousel slide to navigate to.
 * @param {string} inputFieldId - The ID of the input field to focus on.
 */
function focusOnRequired(slideIndexToNavigate, inputFieldId) {
    var scrollPosition = $(App.FVDetails.getCurrentPanel() + " #section2").position().top + $(".scrollable-content").scrollTop();
    $(".scrollable-content").animate({
        scrollTop: scrollPosition
    }, 1000).promise().done(function () {
        // This function will be executed after the scrolling animation is complete.
        // Find the carousel element within the scrolled area
        var $carousel = $("#carDescriptions");

        // Check if the carousel element exists and if it's an Owl Carousel instance
        if ($carousel.length > 0 && $carousel.hasClass('owl-carousel') && $carousel.data('owl.carousel')) {
            // Programmatically go to the specific slide
            $carousel.trigger('to.owl.carousel', [slideIndexToNavigate, 300]); // 300 is the transition speed in milliseconds (optional)

            // Listen for the 'translated.owl.carousel' event, which fires after the slide transition
            $carousel.on('translated.owl.carousel', function (event) {
                console.log("Carousel navigation finished!");

                // Find the input field
                var $inputField = $("#" + inputFieldId);

                // Apply styles and animation
                $inputField.css({
                    "border": "2px solid darkred", // Set the border
                    "box-shadow": "0 0 10px rgba(255, 0, 0, 0.7)" // Add a shadow for highlight
                }).animate({
                    // Create a pulse effect by animating the opacity
                    opacity: 0.5
                }, 200, 'swing', function () { // Use 'swing' for smoother animation
                    $inputField.animate({
                        opacity: 1
                    }, 200, 'swing', function () {
                        // Set focus on the input field after the animation
                        $inputField.focus();
                    });
                });

                // Remove the event listener after it's executed once.  This is CRUCIAL.
                $carousel.off('translated.owl.carousel');
            });
        } else {
            console.log("Carousel element not found or not initialized.");
        }
    });
}