(function ($) {
    'use strict';

    // Ensure global App namespace exists
    window.App = window.App || {};

    App.spanElement = null;
    App.fieldObject = null;
    App.origDS = ["01", "04", "06"];
    App.focusableClasses = ["changed", "approved", "rejected", "requestable", "c_requested"];
    App.approvalLevels = [
        { id: 1, inputStyle: "approvedL1", checkStyle: "success", color: "darkgreen", icon: "fas fa-check", tooltip: "Updated" },
        { id: 2, inputStyle: "approvedL2", checkStyle: "primary", color: "darkblue", icon: "fas fa-check-double", tooltip: "Accepted" }
    ];
    App.btnGoConfig = [
        { id: "f5", top: "127px", right: "320px", width: "inherit", height: "inherit" },
        { id: "f11", top: "-12px", left: "-10px", width: "inherit", height: "inherit" }, //checkbox
    ];
    App.Actions = {
        APPROVE: "approve",
        ACCEPT: "accept",
        REJECT: "reject",
        REQUEST: "request"
    };
    App.buttonTemplate = $('<button type="button" class="mb-1 mt-1 mr-1 btn btn-info btn-go">Go</button>');

    // Module for handling common update logic in Full view details panel
    var CRUpdate = {
        /**
         * Initializes the Update module.
         * Sets up event handlers.
         */
        initialize: function () {
            //store span element
            App.spanElement = $('#titleDet span');

            //store all fields original values
            this.storeAllFieldsOriginalValues();

            //common functionality
            this.initializeCommonFeatures();

            //init update initial status for current scenario
            App.CRUpdateStepSpecific.initialize();

            //initialize focus and change events
            this.initializeAllFieldsFocusEvent();
            this.initializeAllFieldsChangeEvent();
        },

        /**
         *  On laod, store all fields original values
         */
        storeAllFieldsOriginalValues: function () {
            /** On laod, store all fields original values for input and select values */
            $('input:not(.ctrl), select:not(.ctrl), textarea:not(.ctrl,#cComment,#fComment)').each(function () {
                var input = $(this);
                input.data('originalValue', input.val());
                input.attr("readonly", "readonly")
                input.attr("disabled", "disabled")
            });

            /** On laod, store all checkbox fields original values */
            $('input[type="checkbox"]:not(.ctrl)').each(function () {
                $(this).data('originalValue', $(this).is(':checked'));
                $(this).attr("disabled", "disabled")
            });
        },
        /**
         * On field focus, determine fieldObject to treat and focus on change details if applies
         */
        initializeAllFieldsFocusEvent: function () {
            $(".changed, .approved, .rejected, .c_requested").on('focus', function () {
                let fieldId = $(this).attr('id');

                //get field object
                App.fieldObject = App.updateFields.find(item => item.id === ("r" + fieldId));

                if (App.fieldObject) {
                    App.CRUpdate.showChangeDetailsForCurrentField();
                } else {
                    App.CRSummaryLog.goBack();
                }
            });
        },
        /**
        * On field update, check if value is still a change or a new change.
        * Apply updates accordingly if the status changes for the field 
        */
        initializeAllFieldsChangeEvent: function () {
            $('input[type="text"]:not(.dateInput),input[type="date"],textarea:not(#cComment,#fComment)').filter('.changed, .approved, .rejected, .c_requested').on('input', function () { App.CRUpdateStepSpecific.doOnFieldValueUpdated($(this)); });
            $('.dateInput').filter('.changed, .approved, .rejected, .c_requested').on('changeDate', function () { App.CRUpdate.doOnFieldValueUpdated($(this)); });
            $('select').filter('.changed, .approved, .rejected, .c_requested').on('change', function () { App.CRUpdate.doOnFieldValueUpdated($(this)); });

            /** Same as above but for checkboxes - special case*/
            $('input[type="checkbox"]').filter('.changed, .approved, .rejected, .c_requested').on('change', function () {
                let currentValue = $(this).is(':checked');
                let fieldId = $(this).attr('id')
                let isComplexStructure = $(this).is('input[type="checkbox"]') && $(this).closest('#f4').length > 0;

                if (currentValue === $(this).data('originalValue')) {
                    $(this).removeClass('changed');
                    $(this).parent().removeClass('checkbox-warning');
                    $(this).parent().addClass('checkbox-default');

                    if (!isComplexStructure) {
                        App.CRUpdate.discard();
                        App.CRSummaryLog.goBack();
                    }
                } else if (!$(this).hasClass('changed')) {
                    $(this).addClass('changed');
                    $(this).parent().addClass('checkbox-warning');
                    $(this).parent().removeClass('checkbox-default');

                    if (!isComplexStructure) {
                        App.CRUpdate.addNewChange();
                    }
                }

                //check for complex multi-select structures
                if (isComplexStructure) {
                    App.fieldObject = App.updateFields[3];
                    let changesInStructure = $('#f4').find('.changed').length;

                    console.log(App.fieldObject + " - " + changesInStructure);
                    if (changesInStructure === 1) {
                        App.CRUpdate.addNewChange();
                    } else if (changesInStructure === 0) {
                        App.CRUpdate.discard();
                        App.CRSummaryLog.goBack();
                    }
                }
            });
        },
        /**
         * More common initializations
         */
        initializeCommonFeatures: function () {
            if ($('#cComment')) {
                $('#cComment').on('change', function () {
                    App.fieldObject.comment = $(this).val();
                });
            }

            if ($('#blockStatement')) {
                $("#blockStatement").click(function () {
                    App.CRSummaryLog.switchToChangeView();
                });
            }
        },
        /**
         * Show change details for current field being focused
         */
        showChangeDetailsForCurrentField: function () {
            $('#titleDet').text(App.fieldObject.label);
            $("#cComment").val(App.fieldObject.comment);

            //switch panels
            App.CRSummaryLog.switchToChangeView();
            $('#pChangeDet').show('flip', function () {
                // Hide the "pChangeDet" panel with a flip animation
                $('#pChangeMain').hide('flip');
            });

            //hide or show action buttons
            App.CRUpdateStepSpecific.showOrHideActionButtons();

            //show relevant timeline
            App.CRUpdate.showTimelineForCurrentField();
        },
        /** 
         * Handle field value updates
         */
        doOnFieldValueUpdated: function (element) {
            let currentValue = $(element).val()
            let fieldId = $(element).attr('id')

            if (currentValue === $(element).data('originalValue')) {
                //back to the value requested to be updated
                this.undoChangeEvaluation();

            } else if ($(element).hasClass('changed')) {
                //new value but different from the one requested to be updated
                this.approveChange(1);

            } else if ($(element).hasClass('rejected')) {
                //new value but different from the one requested to be updated
                // overrides a previously rejected evaluation
                this.undoChangeEvaluation();
                this.approveChange(1);

            }
        },
        /**
         * Discard update request
         */
        discard: function () {
            let fieldId = "#" + App.fieldObject.id.replace("r", "");

            //reset value
            if ($(fieldId).is('input[type="checkbox"]')) {
                $(fieldId).prop('checked', $(this).data('originalValue'));
                $(fieldId).parent().removeClass('checkbox-warning');
                $(fieldId).parent().addClass('checkbox-default');
            } else {
                $(fieldId).val($(fieldId).data('originalValue'));
            }

            //hide in table
            $("#" + App.fieldObject.id).hide()
            App.fieldObject.comment = "";
            App.fieldObject.reviewDone = false;

            //remove change highlight and move back
            $(fieldId).removeClass(App.focusableClasses.join(" "));
            App.CRSummaryLog.goBack();
        },
        /**
         * Add new change on log and switch to change details view
         */
        addNewChange: function () {
            //show row on change log    
            $("#" + App.fieldObject.id).show();

            //to change view if not yet in there
            App.CRUpdate.showChangeDetailsForCurrentField();
        },
        /**
         * Focus on change
         */
        focusOnChange: function (fieldId) {
            //get field object
            App.fieldObject = App.updateFields.find(item => item.id === (fieldId));

            //to tab and field    
            $('.tab-pane').removeClass('active');
            $('#' + App.fieldObject.tab).tab('show');
            $('#' + App.fieldObject.tab).addClass('active');


            //to change view if not yet in there
            App.CRUpdate.showChangeDetailsForCurrentField();
        },
        /**
         * Discard all updates
         */
        discardAll: function () {
            $('input[type="text"],input[type="checkbox"], input[type="date"],select').each(function () {
                if ($(this).is('input[type="checkbox"]')) {
                    $(this).prop('checked', $(this).data('originalValue'));
                    $(this).parent().removeClass('checkbox-warning');
                    $(this).parent().addClass('checkbox-default');
                } else {
                    $(this).val($(this).data('originalValue'));
                }

                //$(this).removeClass(App.discardRemoveClass);
                $(this).removeClass(App.focusableClasses.join(" "));
            });

            $('[id^="rf"]').hide();
            App.CRSummaryLog.switchToProductMainInfoView();
        },
        /**
        * Confirm on submit
        */
        submitUpdateRequest: function () {
            //set all to readonly
            $('input[type="text"]').prop('readonly', true);
            $('input[type="checkbox"], select').prop('disabled', true);

            //show block comment
            $("#blockStatement").show();

            //reset change log
            $('[id^="rf"]').hide();

            //display main info and hide change log
            App.CRSummaryLog.switchToProductMainInfoView();
        },
        /** 
         * Attach the button to all input elements starting with "f" and position it
         */
        attachGoButtons: function () {
            $('input[id^="f"]:disabled,select[id^="f"]:disabled,textarea[id^="f"]:disabled:not(#cComment,#fComment),.dTable').hover(
                function () {
                    App.CRUpdate.openNavigationFeatureToField($(this))
                },
                function () {
                    var button = $(this).parent().find(".btn-go")
                    if (!button.is(':hover')) {
                        button.slideUp(200)
                    }
                }
            );
        },
        /** 
         * Open navigation feature to field
         */
        openNavigationFeatureToField: function (input) {
            var button = input.parent().find(".btn-go");

            //get field object
            let btnConfigValues = App.btnGoConfig.find(item => item.id === (input.attr('id')));

            if (button.length === 0) {
                button = App.buttonTemplate.clone().css({
                    position: 'absolute',
                    top: (btnConfigValues) ? btnConfigValues.top : '-4px',
                    right: (btnConfigValues) ? btnConfigValues.right : 0,
                    left: (btnConfigValues) ? btnConfigValues.left : 'e',
                    height: (btnConfigValues) ? btnConfigValues.height : '100%',
                    width: (btnConfigValues) ? btnConfigValues.width : '30%',
                    opacity: 0.6,
                    display: 'none',
                    'z-index': 999999
                }).appendTo(input.parent());

                button.click(function () {
                    button.css("opacity", "0.6")

                    //get field object
                    App.fieldObject = App.updateFields.find(item => item.id === ("r" + input.attr('id')));
                    App.CRUpdate.showChangeDetailsForCurrentField();
                });

                button.hover(
                    function () {
                        button.css("opacity", "1")
                    },
                    function () {
                        button.css("opacity", "0.6")
                        if (!input.is(':hover')) {
                            button.slideUp(200)
                        }
                    }
                )
            }

            button.slideDown(200).show()
        },
        /**
         * Undo change evaluation
         */
        undoChangeEvaluation: function () {
            //discard request
            if (App.fieldObject.requestable && App.discardWhenRequestableIsUndone) {
                App.CRUpdate.discard();
                return;
            }

            //discard last evaluation
            App.fieldObject.reviewDone = false;
            $("#cComment").removeClass("rejected");
            $("#txtRequired").hide();
            App.CRUpdateStepSpecific.showOrHideActionButtons()

            //remove last comment done
            $('.tm-items li.' + App.fieldObject.timeline + ':last').remove();

            //get field object
            let fieldId = "#" + App.fieldObject.id.replace("r", "");

            //update field border color
            if ($(fieldId).is('input[type="checkbox"]')) {
                $(fieldId).parent().removeClass();
                $(fieldId).parent().addClass('checkbox-custom checkbox-warning');
            } else {
                $(fieldId).removeClass('approvedL1 approvedL2 rejected c_requested');

                if (App.fieldObject.review) {
                    $(fieldId).addClass(App.fieldObject.initStatus ? App.fieldObject.initStatus : "changed");
                }
            }

            //update in table
            let tableIcon = $("#" + App.fieldObject.id).find('i:first');

            if (App.fieldObject.review) {
                let icon = 'fas fa-plus';
                let color = 'darkgray';
                let title = 'New';
                let level = App.approvalLevels.find(item => item.inputStyle === App.fieldObject.initStatus);

                if (level) {
                    icon = level.icon;
                    color = level.color;
                    title = level.title;
                } else if (App.fieldObject.initStatus === "rejected") {
                    icon = 'fas fa-ban';
                    color = 'darkred';
                    title = 'Rejected';
                }

                tableIcon.removeClass();
                tableIcon.addClass(icon);
                tableIcon.css("color", color);
                tableIcon.attr('data-original-title', title);
            } else {
                $("#" + App.fieldObject.id).hide()
            }
        },
        /**
         * Reject change
         */
        rejectChange: function () {
            //comment is mandatory on rejection
            if (!App.CRUpdate.isValidRequiredComment()) {
                return;
            }

            App.fieldObject.reviewDone = true;

            //review done and rejected correctly            
            App.CRUpdateStepSpecific.doOnReject();
            App.CRUpdate.addCommentOnApproveOrReject(App.Actions.REJECT);
            App.CRUpdateStepSpecific.showOrHideActionButtons();

            //get field object
            let fieldId = "#" + App.fieldObject.id.replace("r", "");

            //update field border color
            if ($(fieldId).is('input[type="checkbox"]')) {
                $(fieldId).parent().removeClass();
                $(fieldId).parent().addClass('checkbox-custom checkbox-danger');
            } else {
                $(fieldId).removeClass('changed approvedL1');
                $(fieldId).addClass('rejected');
            }

            //update in table
            let tableIcon = $("#" + App.fieldObject.id).find('i:first');
            tableIcon.removeClass();
            tableIcon.addClass('fas fa-ban');
            tableIcon.css("color", 'darkred');
            tableIcon.attr('data-original-title', 'Rejected');
        },
        /**
         * Approve change
         */
        approveChange: function (appLevel) {
            //get field object
            let level = App.approvalLevels.find(item => item.id === appLevel);
            let fieldId = "#" + App.fieldObject.id.replace("r", "");

            //update field border color
            if ($(fieldId).is('input[type="checkbox"]')) {
                $(fieldId).parent().removeClass();
                $(fieldId).parent().addClass('checkbox-custom checkbox-' + level.checkStyle);
            } else {
                $(fieldId).removeClass('changed approvedL1 rejected');
                $(fieldId).addClass(level.inputStyle);
            }

            App.fieldObject.reviewDone = true;
            App.CRUpdate.addCommentOnApproveOrReject(appLevel === 1 ? App.Actions.APPROVE : App.Actions.ACCEPT);
            App.CRUpdateStepSpecific.showOrHideActionButtons();

            //update in table
            let tableIcon = $("#" + App.fieldObject.id).find('i:first');
            tableIcon.removeClass();
            tableIcon.addClass(level.icon);
            tableIcon.css("color", level.color);
            tableIcon.attr('data-original-title', level.tooltip);
        },
        /**
         * Request field update
         */
        requestFieldUpdate: function () {
            //comment is mandatory on rejection
            if (!App.CRUpdate.isValidRequiredComment()) {
                return;
            }

            App.fieldObject.reviewDone = true;

            //show row on change log    
            $("#" + App.fieldObject.id).show();
            App.CRUpdate.addCommentOnApproveOrReject(App.Actions.REQUEST);

            //show only relevant fields
            App.CRUpdateStepSpecific.showOrHideActionButtons();

            //ADD organge color to field
            let fieldId = "#" + App.fieldObject.id.replace("r", "");
            $(fieldId).addClass('changed');

            //show relevant timeline
            App.CRUpdate.showTimelineForCurrentField();
        },
        /**
         * Handle error on comment missing
         * @returns 
         */
        isValidRequiredComment: function () {
            if (!App.fieldObject.comment) {
                $("#txtRequired").show();
                $("#cComment").addClass("rejected");
                return false;
            } else {
                $("#txtRequired").hide();
                $("#cComment").removeClass("rejected");
                return true;
            }
        },
        /**
         * Add new comment and hide input for new ones
         * @param {} action 
         */
        addCommentOnApproveOrReject: function (action) {
            var cObject;
            var color;
            var actionText;

            switch (action) {
                case App.Actions.APPROVE:
                    color = "darkgreen";
                    actionText = "Updated ";
                    break;
                case App.Actions.ACCEPT:
                    color = "darkblue";
                    actionText = "Accepted ";
                    break;
                case App.Actions.REJECT:
                    color = "darkred";
                    actionText = "Rejected ";
                    break;
                case App.Actions.REQUEST:
                    color = "darkorange";
                    actionText = "Change requested ";
                    break;
                default:
                    color = "gray";
                    actionText = "Unknown";
            }

            $('.' + App.fieldObject.timeline).each(function () {
                if (!$(this).is(':visible')) {
                    cObject = $(this);

                    //update span with action
                    var spanElement = cObject.find('span:first')
                    spanElement.css("color", color)
                    spanElement.text(actionText)

                    cObject.show();
                }
            });

            if (!cObject) {
                cObject = $('.' + App.fieldObject.timeline).first().clone();
                cObject.find('p:first').text(App.commentText);
                cObject.find('p:first span').remove()
                cObject.find('p:first').prepend('<span style="color:' + color + ';font-size:larger">' + actionText + '</span>');
                // Append the cloned `<ol>` to the last `<li>`
                $('#secTimeline .tm-items').append(cObject);
            }

            //udpate comment
            cObject.find('p:last').text(App.fieldObject.comment);
        },
        /**
         * Show timeline for current field
         */
        showTimelineForCurrentField: function () {
            //show relevant timeline
            if (App.CRUpdateStepSpecific.displayTimeline()) {
                $("#secTimeline").show();
                $('[class^="time_if"]').hide();
                $("." + App.fieldObject.timeline).show();
            } else {
                $("#secTimeline").hide();
            }
        }

    };

    App.CRUpdate = CRUpdate;

})(jQuery);