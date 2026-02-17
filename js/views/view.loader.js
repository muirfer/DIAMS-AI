(function ($) {
    'use strict';

    window.App = window.App || {};

    App.ViewLoader = {
        /**
         * Loads multiple views into their corresponding selectors.
         * @param {Array} views - Array of objects { selector: string, url: string }
         * @param {Function} callback - Function to execute when all views are loaded
         */
        loadViews: function (views, callback) {
            var promises = views.map(function (view) {
                return $.get(view.url).then(function (data) {
                    $(view.selector).replaceWith(data);
                }).fail(function () {
                    console.error("Failed to load view: " + view.url);
                    $(view.selector).html("<div class='alert alert-danger'>Error loading content</div>");
                });
            });

            $.when.apply($, promises).always(function () {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    };

})(jQuery);
