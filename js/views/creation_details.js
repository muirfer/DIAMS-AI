(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    /**
     * Sections per panel
     */
    let bPerSection = [
        { id: "#overview", sections: ["Basic Data", "Descriptions", "Customer decision tree (CDT)"] },
        { id: "#pUoM", sections: ["Measurement Data", "Support Packaging", "Consumer returnable empties"] },
        { id: "#pTaxes", sections: ["VAT Rate", "Excise Duties", "Bebat", "On electro-appliances"] },
        { id: "#pCodes", sections: ["Legislated code", "Label claim", "Type of product introduction and exclusivity", "Others"] },
        { id: "#pStore", sections: ["Store", "Replenishment"] },
        { id: "#pB2C", sections: ["B2C", "Nutritional Information", "Customer information"] },
        { id: "#pLogistics", sections: ["Logistics", "Distribution center", "Replenishment", "Replenishment (Argos)"] },
        { id: "#pPurchasing", sections: ["Purchasing data", "Product pricing information"] },
        { id: "#pLinks", sections: ["Links"] },
        { id: "#pAssortment", sections: ["Basic information", "SRP", "Belgium", "Luxembourg"] },
        { id: "#pPricesNew", sections: ["Information", "Price structure", "Sales prices"] },
        { id: "#pWine", sections: ["Information"] },
        { id: "#pFostPlus", sections: ["Information", "Number of consumer units", "Primary packaging"] }
    ];

    /**
     * Current panel
     */
    let currentPanel = bPerSection[0].id;

    // Module for handling Creation details logic
    var CRDetails = {
        /**
         * Initializes the Creation details module.
         * Sets up event handlers and initializes DataTables.
         */
        initialize: function () {
            $(".main-panel").css("height", "calc(95vh - " + $(".tabs").offset().top + "px)");

            $(".scrollToSectionLink").click(function (e) {
                e.preventDefault();
                var sectionId = "section" + $(this).attr('id')[1]; // Change this to the id of the section you want to scroll to
                //var sectionOffset = $(currentPanel + " #" + sectionId).offset().top;
                //var sectionOffset = $(currentPanel + " #" + sectionId).position().top;
                // Calculate the scroll position to the target panel
                var scrollPosition = $(currentPanel + " #" + sectionId).position().top + $(".scrollable-content").scrollTop();

                $(".scrollable-content").animate({
                    scrollTop: scrollPosition
                    //scrollTop: sectionOffset - $(".scrollable-content").offset().top
                }, 1000); // Adjust the duration of the animation as needed
            });

            $(".nav-link").click(function (e) {
                //remove active class from all
                $(".nav-link").parent().removeClass("active");

                //add active class to current selected
                $(this).parent().addClass("active");
                currentPanel = $(".active .nav-link").attr("href");

                //update breadcrumbs
                let sections = App.CRDetails.getSectionsById($(this).attr("href"));

                // Update breadcrumb items with the sections retrieved
                sections.forEach((section, index) => {
                    const breadcrumbItem = document.querySelector(`#n${index + 1}`);
                    if (breadcrumbItem) {
                        breadcrumbItem.textContent = section;
                        breadcrumbItem.parentElement.style.display = "list-item"; // Show the list item
                    }
                });

                // Hide remaining breadcrumb items
                for (let i = sections.length + 1; i <= 5; i++) {
                    const breadcrumbItem = document.querySelector(`#n${i}`);
                    if (breadcrumbItem) {
                        breadcrumbItem.parentElement.style.display = "none";
                    }
                }

                if (App.backOnTabFocusChange) {
                    //for full view update - Go Back if tab focus changes:
                    App.CRSummaryLog.goBack();
                }
            });

            // Expand view
            $("#btn-expand-view").click(function (e) {
                e.preventDefault();
                // Toggle buttons visibility
                $("#btn-expand-view").hide();
                $("#btn-collapse-view").show();

                // Clear any previous section.body styles from previous implementations
                $("section.body").css({ "position": "", "top": "", "left": "", "width": "", "height": "", "z-index": "", "background-color": "", "padding": "", "overflow-y": "", "margin": "" });

                // Toolbar positioning
                $(".page-header").css({
                    "position": "fixed",
                    "top": "0",
                    "left": "0",
                    "width": "100vw",
                    "z-index": "10000"
                });

                // Main content position
                var $mainContent = $(".page-header").next(".row");
                $mainContent.css({
                    "position": "fixed",
                    "top": $(".page-header").outerHeight() + "px",
                    "left": "0",
                    "width": "100vw",
                    "height": "calc(100vh - " + $(".page-header").outerHeight() + "px)",
                    "z-index": "9999",
                    "background-color": $(".body").css("background-color") !== "rgba(0, 0, 0, 0)" ? $(".body").css("background-color") : "#f1f4f6",
                    "padding": "25px",
                    "overflow-x": "hidden",
                    "overflow-y": "auto",
                    "margin-top": "0"
                });

                // Adjust Descriptions section panels
                $(".sFixed").removeClass("col-lg-4 col-lg-5 col-lg-6 col-lg-7 col-lg-8").addClass("col-lg-4");
                $(".sCarousel").removeClass("col-lg-4 col-lg-5 col-lg-6 col-lg-7 col-lg-8").addClass("col-lg-8");

                // Update Description carousel items count to 3 and refresh
                var $carousel = $("#carDescriptions");
                if ($carousel.length && $carousel.data("owl.carousel")) {
                    $carousel.data("owl.carousel").options.items = 3;
                    // For safety, adjust responsive settings if present
                    if ($carousel.data("owl.carousel").options.responsive) {
                        $.each($carousel.data("owl.carousel").options.responsive, function (breakpoint, config) {
                            config.items = Math.max(config.items, 3);
                        });
                    }
                    $carousel.trigger("refresh.owl.carousel");
                }

                // Update Measurement Data carousel items count to 5 and refresh
                var $carUoM = $("#carUoM");
                if ($carUoM.length && $carUoM.data("owl.carousel")) {
                    $carUoM.data("owl.carousel").options.items = 5;
                    // For safety, adjust responsive settings if present
                    if ($carUoM.data("owl.carousel").options.responsive) {
                        $.each($carUoM.data("owl.carousel").options.responsive, function (breakpoint, config) {
                            config.items = Math.max(config.items, 5);
                        });
                    }
                    $carUoM.trigger("refresh.owl.carousel");
                }

                // Update Distribution Center carousel items count to 3 and refresh
                var $carDistCenter = $("#carDistCenter");
                if ($carDistCenter.length && $carDistCenter.data("owl.carousel")) {
                    $carDistCenter.data("owl.carousel").options.items = 3;
                    // For safety, adjust responsive settings if present
                    if ($carDistCenter.data("owl.carousel").options.responsive) {
                        $.each($carDistCenter.data("owl.carousel").options.responsive, function (breakpoint, config) {
                            config.items = Math.max(config.items, 3);
                        });
                    }
                    $carDistCenter.trigger("refresh.owl.carousel");
                }

                // Recalculate dynamic height
                setTimeout(function () {
                    $(".main-panel").css("height", "calc(95vh - " + $(".tabs").offset().top + "px)");
                }, 100);
            });

            // Collapse view (revert)
            $("#btn-collapse-view").click(function (e) {
                e.preventDefault();
                // Toggle buttons visibility
                $("#btn-collapse-view").hide();
                $("#btn-expand-view").show();

                // Revert toolbar positioning
                $(".page-header").css({
                    "position": "",
                    "top": "",
                    "left": "",
                    "width": "",
                    "z-index": ""
                });

                // Revert main content positioning
                var $mainContent = $(".page-header").next(".row");
                $mainContent.css({
                    "position": "",
                    "top": "",
                    "left": "",
                    "width": "",
                    "height": "",
                    "z-index": "",
                    "background-color": "",
                    "padding": "",
                    "overflow-x": "",
                    "overflow-y": "",
                    "margin-top": ""
                });

                // Revert Descriptions section panels
                $(".sFixed").removeClass("col-lg-4 col-lg-5 col-lg-6 col-lg-7 col-lg-8").addClass("col-lg-5");
                $(".sCarousel").removeClass("col-lg-4 col-lg-5 col-lg-6 col-lg-7 col-lg-8").addClass("col-lg-7");

                // Revert Description carousel items count back to 2 and refresh
                var $carousel = $("#carDescriptions");
                if ($carousel.length && $carousel.data("owl.carousel")) {
                    $carousel.data("owl.carousel").options.items = 2; // Default for creation was 2
                    // Revert responsive fallback if modified
                    if ($carousel.data("owl.carousel").options.responsive) {
                        $carousel.data("owl.carousel").options.responsive = $.extend(true, {}, $carousel.data("plugin-options").responsive || {});
                    }
                    $carousel.trigger("refresh.owl.carousel");
                }

                // Revert Measurement Data carousel items count back to 3 and refresh
                var $carUoM = $("#carUoM");
                if ($carUoM.length && $carUoM.data("owl.carousel")) {
                    $carUoM.data("owl.carousel").options.items = 3;
                    // Revert responsive fallback if modified
                    if ($carUoM.data("owl.carousel").options.responsive) {
                        $carUoM.data("owl.carousel").options.responsive = $.extend(true, {}, $carUoM.data("plugin-options").responsive || {});
                    }
                    $carUoM.trigger("refresh.owl.carousel");
                }

                // Revert Distribution Center carousel items count back to 2 and refresh
                var $carDistCenter = $("#carDistCenter");
                if ($carDistCenter.length && $carDistCenter.data("owl.carousel")) {
                    $carDistCenter.data("owl.carousel").options.items = 2;
                    // Revert responsive fallback if modified
                    if ($carDistCenter.data("owl.carousel").options.responsive) {
                        $carDistCenter.data("owl.carousel").options.responsive = $.extend(true, {}, $carDistCenter.data("plugin-options").responsive || {});
                    }
                    $carDistCenter.trigger("refresh.owl.carousel");
                }

                // Recalculate dynamic height
                setTimeout(function () {
                    $(".main-panel").css("height", "calc(95vh - " + $(".tabs").offset().top + "px)");
                }, 100);
            });

            //initialize AI module
            App.CRAI.initialize();
        },
        /**
         * Scroll to section
         */
        scrollToSection: function (sectionId) {
            var section = document.getElementById(sectionId);
            if (section) {
                var panel = document.getElementById("panel");
                panel.scrollTop = section.offsetTop - panel.offsetTop;
            }
        },
        /**
         * Get sections by id
         */
        getSectionsById: function (id) {
            const section = bPerSection.find(item => item.id === id);
            return section ? section.sections : null;
        },
        /**
         * Get current panel
         */
        getCurrentPanel: function () {
            return currentPanel;
        }

    };

    App.CRDetails = CRDetails;

    // AI Assistant Module
    var CRAI = {
        suggestions: [
            "Rice Krispies Zak 400g",
            "Rice Krispies Sachet 4x400g (EA)",
            "Rice Krispies Sachet 4x400g (IP)",
            "Rice Krispies Sachet 4x400g (CV)",
            "Rice Krispies Sachet (EA)",
            "Rice Krispies Sachet (IP)",
            "Rice Krispies Sachet (CV)",
            "Rice Krispies Ticket Desc",
            "Rice Krispies Ticket IP",
            "Rice Krispies Ticket CV",
            "Rice Krispies E-com"
        ],

        initialize: function () {
            // Bind Generate Button
            $(document).on('click', '#btn-ai-generate', function (e) {
                e.preventDefault();
                var $btn = $(this);
                var originalHtml = $btn.html();

                $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Processing...');

                setTimeout(function () {
                    CRAI.generateSuggestions();
                    $btn.prop('disabled', false).html(originalHtml);
                }, 1500);
            });

            // Bind Badge Click (Delegated)
            $(document).on('click', '.ai-notification-badge', function (e) {
                e.stopPropagation();
                var $wrapper = $(this).closest('.input-ai-wrapper');
                if (!$wrapper.length) $wrapper = $(this).parent();
                CRAI.togglePopover($wrapper);
            });

            // Bind Accept/Reject (Delegated)
            $(document).on('click', '.btn-accept', function (e) {
                e.preventDefault();
                var $popover = $(this).closest('.ai-popover');
                var $wrapper = $popover.closest('.input-ai-wrapper');
                if (!$wrapper.length) $wrapper = $popover.parent();
                var suggestion = $popover.find('.suggestion-text').text();

                var $input = $wrapper.find('.ai-subscribable');
                $input.val(suggestion).trigger('change').trigger('input');

                // Cleanup
                $wrapper.find('.ai-notification-badge, .ai-popover').remove();
            });

            $(document).on('click', '.btn-reject', function (e) {
                e.preventDefault();
                var $popover = $(this).closest('.ai-popover');
                var $wrapper = $popover.closest('.input-ai-wrapper');
                if (!$wrapper.length) $wrapper = $popover.parent();

                // Cleanup
                $wrapper.find('.ai-notification-badge, .ai-popover').remove();
            });

            // Close popover when clicking outside
            $(document).on('click', function (e) {
                if (!$(e.target).closest('.input-ai-wrapper').length && 
                    !$(e.target).closest('.ai-popover').length && 
                    !$(e.target).hasClass('ai-notification-badge') &&
                    !$(e.target).hasClass('ai-subscribable')) {
                    $('.ai-popover').hide();
                }
            });
        },

        generateSuggestions: function () {
            var inputs = $('.ai-subscribable');

            inputs.each(function (index) {
                var $input = $(this);
                // Ensure we look for wrapper in parent if not direct parent (for input groups)
                var $wrapper = $input.closest('.input-ai-wrapper');
                if (!$wrapper.length) {
                    $wrapper = $input.parent();
                }

                // Clear existing
                $wrapper.find('.ai-notification-badge, .ai-popover').remove();

                // Create Badge with Text "AI"
                var $badge = $('<span class="ai-notification-badge">AI</span>');
                $wrapper.append($badge);

                // Show badge with slight delay for effect
                setTimeout(function () {
                    $badge.show();
                }, index * 100);
            });
        },

        togglePopover: function ($wrapper) {
            var $popover = $wrapper.find('.ai-popover');

            if ($popover.length && $popover.is(':visible')) {
                $popover.hide();
            } else {
                // Close all other popovers
                $('.ai-popover').hide();

                // Check if popover exists, if not create it
                if (!$popover.length) {
                    // Get suggestion (mock logic based on index or random)
                    // In real app, we would map input ID/name to suggestion type
                    var $input = $wrapper.find('.ai-subscribable');
                    var index = $('.ai-subscribable').index($input);
                    if (index < 0) index = 0; // fallback
                    var suggestion = CRAI.suggestions[index % CRAI.suggestions.length];

                    var popoverHtml = `
                        <div class="ai-popover">
                            <div class="popover-content">
                                <strong>AI:</strong> <span class="suggestion-text">${suggestion}</span>
                            </div>
                            <div class="popover-actions">
                                <button class="btn btn-xs btn-accept"><i class="fas fa-check"></i></button>
                                <button class="btn btn-xs btn-reject"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                    `;
                    $wrapper.append(popoverHtml);
                }
                $wrapper.find('.ai-popover').show();
            }
        }
    };

    App.CRAI = CRAI;

})(jQuery);
