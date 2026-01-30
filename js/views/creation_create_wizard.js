/*
Name: 			Forms / Wizard - Examples
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version: 	3.0.0
*/

(function ($) {

	'use strict';

	$('#w4').bootstrapWizard({
		tabClass: 'wizard-steps',
		nextSelector: 'ul.pager li.next',
		previousSelector: 'ul.pager li.previous',
		firstSelector: null,
		lastSelector: null,
		onNext: function (tab, navigation, index, newindex) {
			// var validated = $('#w4 form').valid();
			// if( !validated ) {
			// 	$w4validator.focusInvalid();
			// 	return false;
			// }
		},
		onTabClick: function (tab, navigation, index, newindex) {
			// if ( newindex == index + 1 ) {
			// 	return this.onNext( tab, navigation, index, newindex);
			// } else if ( newindex > index + 1 ) {
			// 	return false;
			// } else {
			// 	return true;
			// }
		},
		onTabChange: function (tab, navigation, index, newindex) {
			// var $total = navigation.find('li').length - 1;
			// $w4finish[ newindex != $total ? 'addClass' : 'removeClass' ]( 'hidden' );
			// $('#w4').find(this.nextSelector)[ newindex == $total ? 'addClass' : 'removeClass' ]( 'hidden' );
		},
		onTabShow: function (tab, navigation, index) {
			// var $total = navigation.find('li').length - 1;
			var $current = index;
			// var $percent = Math.floor(( $current / $total ) * 100);

			navigation.find('li').removeClass('active');
			navigation.find('li').eq($current).addClass('active');

			// $('#w4').find('.progress-indicator').css({ 'width': $percent + '%' });
			// tab.prevAll().addClass('completed');
			// tab.nextAll().removeClass('completed');
			if (index === 0) {
				$("#btnRegNext").hide();
				$("#btnNext_input").show()
				if ($("#lblBrandType").text() === "D1 - Delhaize") {
					$("#btnNext_res").show();
				}
				$(".previous").hide();
				$(".gtinInputPanel").hide()
				$(".gtinInputPanel2").hide()
				$(".supRegInfoPanel").hide();
				$(".supNoRegInfoPanel").hide();
			} else {
				$("#btnRegNext").show();
				$("#btnNext_input").hide()
				$("#btnNext_res").hide();
				$(".previous").show();
				$(".gtinInputPanel").show()

				if ($("#lblGtinInput").is(":visible") && $("#lblGtinInput").text() === "-") {
					$("#pDetails").hide();
					$("#pNoDetailsMsge").show()
				} else {
					$("#pDetails").show();
					$("#pNoDetailsMsge").hide()
				}

				if (index === 3) {
					$("#btnRegNext").hide();
					$(".btnAction").show();
				} else {
					$("#btnRegNext").show();
					$(".btnAction").hide();
				}
			}
		}
	});

}).apply(this, [jQuery]);