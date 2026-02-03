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
        { id: "#pPrices", sections: ["Search criteria", "Price structure", "Sales prices", "Price grouping", "Others"] }
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
        }
    };

    App.FVDetails = FVDetails;

})(jQuery);
