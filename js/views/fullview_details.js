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
        { id: "#pLogistics", sections: ["Logistics", "Distribution center", "Replenishment for stores", "Replenishment for suppliers"] },
        { id: "#pPurchasing", sections: ["Purchasing data", "Reappro"] },
        { id: "#pLinks", sections: ["Links"] },
        { id: "#pAssortment", sections: ["JDA driven", "No-JDA driven for Belgium", "No-JDA driven for Luxembourg", "Others"] },
        { id: "#pPrices", sections: ["Search criteria", "Price structure", "Sales prices", "Price grouping", "Others"] },
        { id: "#pPricesNew", sections: ["Information", "Price structure", "Sales prices"] }
    ];

    /**
     * Current panel
     */
    let currentPanel = bPerSection[0].id;

    // Module for handling Full view details logic
    var FVDetails = {
        /**
         * Initializes the Full view details module.
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
                let sections = App.FVDetails.getSectionsById($(this).attr("href"));

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

                //for full view update - Go Back if tab focus changes:
                App.FVSummaryLog.goBack();
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
                $(".sFixed").removeClass("col-lg-5").addClass("col-lg-4");
                $(".sCarousel").removeClass("col-lg-7").addClass("col-lg-8");

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
                $(".sFixed").removeClass("col-lg-4").addClass("col-lg-5");
                $(".sCarousel").removeClass("col-lg-8").addClass("col-lg-7");

                // Revert Description carousel items count back to 2 and refresh
                var $carousel = $("#carDescriptions");
                if ($carousel.length && $carousel.data("owl.carousel")) {
                    $carousel.data("owl.carousel").options.items = 2;
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

                // Recalculate dynamic height
                setTimeout(function () {
                    $(".main-panel").css("height", "calc(95vh - " + $(".tabs").offset().top + "px)");
                }, 100);
            });

            // Add a 'focus' event listener to each input
            $('input[type="text"]').each(function () {
                $(this).on('focus', function () {
                    this.select();
                });
            });
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
        },
        /**
         * Reset date history filter
         */
        resetDateHistoryFilter: function () {
            $(".hDate").val("")
            $(".offDate").show()
        },
        /**
         * On date history entered
         */
        onDateHistoryEntered: function () {
            if ($(".offDate").is(":visible")) {
                $(".offDate").hide()
            } else {
                $(".offDate").show()
            }
        },
        /**
         * Filter for
         */
        filterFor: function (value) {
            var searchElement = $("#datatable-purh_filter input");

            //set value
            $(searchElement).focus().val(value)
            $(searchElement).trigger("input")
        }
    };

    App.FVDetails = FVDetails;

})(jQuery);
