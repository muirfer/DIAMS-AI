(function ($) {

    'use strict';

    // Namespace
    window.App = window.App || {};

    var ViewCommon = {

        initialize: function (opts) {
            opts = opts || {};
            this.initModals();
            this.initThemePlugins(opts);
            this.initOptionalPlugins(opts);

            $("#mainSection").css("background", "white");
        },

        /**
         * Standard Magnific Popup initialization.
         * Replaces the need for js/examples/examples.modals.js
         */
        initModals: function () {
            if (!$.isFunction($.fn.magnificPopup)) {
                return;
            }

            /*
            Basic
            */
            $('.modal-basic').magnificPopup({
                type: 'inline',
                preloader: false,
                modal: true
            });

            /*
            Sizes
            */
            $('.modal-sizes').magnificPopup({
                type: 'inline',
                preloader: false,
                modal: true
            });

            /*
            Modal with CSS animation
            */
            $('.modal-with-zoom-anim').magnificPopup({
                type: 'inline',

                fixedContentPos: false,
                fixedBgPos: true,

                overflowY: 'auto',

                closeBtnInside: true,
                preloader: false,

                midClick: true,
                removalDelay: 300,
                mainClass: 'my-mfp-zoom-in',
                modal: true
            });

            $('.modal-with-move-anim').magnificPopup({
                type: 'inline',

                fixedContentPos: false,
                fixedBgPos: true,

                overflowY: 'auto',

                closeBtnInside: true,
                preloader: false,

                midClick: true,
                removalDelay: 300,
                mainClass: 'my-mfp-slide-bottom',
                modal: true
            });

            /*
            Modal Dismiss
            */
            $(document).on('click', '.modal-dismiss', function (e) {
                e.preventDefault();
                $.magnificPopup.close();
            });

            /*
            Modal Confirm
            */
            $(document).on('click', '.modal-confirm', function (e) {
                e.preventDefault();
                $.magnificPopup.close();

                if (typeof PNotify !== 'undefined') {
                    new PNotify({
                        title: 'Success!',
                        text: 'Modal Confirm Message.',
                        type: 'success'
                    });
                }
            });

            /*
            Form
            */
            $('.modal-with-form').magnificPopup({
                type: 'inline',
                preloader: false,
                focus: '#name',
                modal: true,

                callbacks: {
                    beforeOpen: function () {
                        if ($(window).width() < 700) {
                            this.st.focus = false;
                        } else {
                            this.st.focus = '#name';
                        }
                    }
                }
            });

            /*
            Ajax
            */
            $('.simple-ajax-modal').magnificPopup({
                type: 'ajax',
                modal: true
            });
        },

        /**
         * Initializes common theme plugins that are globally available.
         * Checks for existence before calling to avoid errors.
         */
        initThemePlugins: function (opts) {
            var plugins = [
                'initToggle',
                'initSelect2',
                'initMultiSelect',
                'initDatePicker',
                'initSpinner',
                'initMaskedInput',
                'initMaxLength',
                'initTextAreaAutoSize',
                'initTimePicker',
                'initTooltip',
                'initPopover',
                'initIOS7Switch',
                'initSlider',
                'initSummerNote',
                'initColorPicker',
                'initCodeMirror'
            ];

            $.each(plugins, function (i, funcName) {
                if (opts.exclude && opts.exclude.indexOf(funcName) > -1) {
                    return;
                }
                if (window[funcName]) {
                    window[funcName]();
                }
            });
        },

        /**
         * Initializes optional View/Example specific plugins if their standard global init function exists.
         * This covers plugins like Widgets, Advanced Forms, Wizard, etc.
         */
        initOptionalPlugins: function (opts) {
            var optionalPlugins = [
                'initWidgets',
                'initAdvancedForm', // Often used in examples
                'initAdvancedForms', // Variant plural
                'initWizard',
                'initCharts',
                'initGoogleMaps', // Be careful with this one if not handled safely, but we added checks.
                'initCalendar',
                'initEcommerceForm'
            ];

            $.each(optionalPlugins, function (i, funcName) {
                if (opts.exclude && opts.exclude.indexOf(funcName) > -1) {
                    return;
                }
                if (window[funcName]) {
                    window[funcName]();
                }
            });
        }
    };

    App.ViewCommon = ViewCommon;

})(jQuery);
