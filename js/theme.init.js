

// Animate
window.initAnimate = function () {
	if ($.isFunction($.fn['appear'])) {
		$('[data-plugin-animate], [data-appear-animation]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginAnimate(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initAnimate();
	});
}).apply(this, [jQuery]);

// Carousel
window.initCarousel = function () {
	if ($.isFunction($.fn['owlCarousel'])) {
		$('[data-plugin-carousel]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginCarousel(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initCarousel();
	});
}).apply(this, [jQuery]);

// Chart Circular
window.initChartCircular = function () {
	if ($.isFunction($.fn['easyPieChart'])) {
		$('[data-plugin-chart-circular], .circular-bar-chart:not(.manual)').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginChartCircular(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initChartCircular();
	});
}).apply(this, [jQuery]);

// Codemirror
window.initCodeMirror = function () {
	if (typeof CodeMirror !== 'undefined') {
		$('[data-plugin-codemirror]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginCodeMirror(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initCodeMirror();
	});
}).apply(this, [jQuery]);

// Colorpicker
window.initColorPicker = function () {
	if ($.isFunction($.fn['colorpicker'])) {
		$('[data-plugin-colorpicker]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginColorPicker(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initColorPicker();
	});
}).apply(this, [jQuery]);

// Datepicker
// Datepicker
window.initDatePicker = function () {
	if ($.isFunction($.fn['bootstrapDP'])) {

		$('[data-plugin-datepicker]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginDatePicker(opts);
		});

	}
};

(function ($) {

	'use strict';

	$(function () {
		window.initDatePicker();
	});

}).apply(this, [jQuery]);

// Header Menu Nav
window.initHeaderMenuNav = function () {
	if (typeof theme.Nav !== 'undefined') {
		theme.Nav.initialize();
	}
};

(function (theme, $) {
	'use strict';
	window.initHeaderMenuNav();
}).apply(this, [window.theme, jQuery]);

// iosSwitcher
window.initIOS7Switch = function () {
	if (typeof Switch !== 'undefined' && $.isFunction(Switch)) {
		$('[data-plugin-ios-switch]').each(function () {
			var $this = $(this);

			$this.themePluginIOS7Switch();
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initIOS7Switch();
	});
}).apply(this, [jQuery]);

// Lazy Load
window.initLazyLoad = function () {
	if ($.isFunction($.fn['themePluginLazyLoad'])) {
		$('[data-plugin-lazyload]:not(.manual)').each(function () {
			var $this = $(this),
				opts;

			var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginLazyLoad(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initLazyLoad();
	});
}).apply(this, [jQuery]);

// Lightbox
window.initLightbox = function () {
	if ($.isFunction($.fn['magnificPopup'])) {
		$('[data-plugin-lightbox], .lightbox:not(.manual)').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginLightbox(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initLightbox();
	});
}).apply(this, [jQuery]);

// Portlets
window.initPortlets = function () {
	if (typeof NProgress !== 'undefined' && $.isFunction(NProgress.configure)) {
		NProgress.configure({
			showSpinner: false,
			ease: 'ease',
			speed: 750
		});
	}
};

(function ($) {
	'use strict';
	window.initPortlets();
}).apply(this, [jQuery]);

// Markdown
window.initMarkdown = function () {
	if ($.isFunction($.fn['markdown'])) {
		$('[data-plugin-markdown-editor]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginMarkdownEditor(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initMarkdown();
	});
}).apply(this, [jQuery]);

// Masked Input
window.initMaskedInput = function () {
	if ($.isFunction($.fn['mask'])) {
		$('[data-plugin-masked-input]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginMaskedInput(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initMaskedInput();
	});
}).apply(this, [jQuery]);

// MaxLength
window.initMaxLength = function () {
	if ($.isFunction($.fn['maxlength'])) {
		$('[data-plugin-maxlength]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginMaxLength(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initMaxLength();
	});
}).apply(this, [jQuery]);

// MultiSelect
window.initMultiSelect = function () {
	if ($.isFunction($.fn['multiselect'])) {
		$('[data-plugin-multiselect]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginMultiSelect(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initMultiSelect();
	});
}).apply(this, [jQuery]);

window.initNonePlaceholder = function () {
	if ($.isFunction($.fn['placeholder'])) {
		$('input[placeholder]').placeholder();
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initNonePlaceholder();
	});
}).apply(this, [jQuery]);


// Popover
window.initPopover = function () {
	if ($.isFunction($.fn['popover'])) {
		$('[data-toggle=popover]').popover();
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initPopover();
	});
}).apply(this, [jQuery]);

// Portlets (Actual Plugin)
window.initPortletsPlugin = function () {
	$('[data-plugin-portlet]').each(function () {
		var $this = $(this),
			opts = {};

		var pluginOptions = $this.data('plugin-options');
		if (pluginOptions)
			opts = pluginOptions;

		$this.themePluginPortlet(opts);
	});
};

(function ($) {
	'use strict';
	$(function () {
		window.initPortletsPlugin();
	});
}).apply(this, [jQuery]);

// Scroll to Top
window.initScrollToTop = function () {
	if (typeof theme.PluginScrollToTop !== 'undefined') {
		theme.PluginScrollToTop.initialize();
	}
};

(function (theme, $) {
	window.initScrollToTop();
}).apply(this, [window.theme, jQuery]);

// Scrollable
window.initScrollable = function () {
	if ($.isFunction($.fn['nanoScroller'])) {
		$('[data-plugin-scrollable]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions) {
				opts = pluginOptions;
			}

			$this.themePluginScrollable(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initScrollable();
	});
}).apply(this, [jQuery]);

// Select2
window.initSelect2 = function () {
	if ($.isFunction($.fn['select2'])) {
		$('[data-plugin-selectTwo]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginSelect2(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initSelect2();
	});
}).apply(this, [jQuery]);

// Sidebar Widgets
(function ($) {

	'use strict';

	function expand(content) {
		content.children('.widget-content').slideDown('fast', function () {
			$(this).css('display', '');
			content.removeClass('widget-collapsed');
		});
	}

	function collapse(content) {
		content.children('.widget-content').slideUp('fast', function () {
			content.addClass('widget-collapsed');
			$(this).css('display', '');
		});
	}

	var $widgets = $('.sidebar-widget');

	$widgets.each(function () {

		var $widget = $(this),
			$toggler = $widget.find('.widget-toggle');

		$toggler.on('click.widget-toggler', function () {
			$widget.hasClass('widget-collapsed') ? expand($widget) : collapse($widget);
		});
	});

}).apply(this, [jQuery]);

// Slider
window.initSlider = function () {
	if ($.isFunction($.fn['slider'])) {
		$('[data-plugin-slider]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions) {
				opts = pluginOptions;
			}

			$this.themePluginSlider(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initSlider();
	});
}).apply(this, [jQuery]);

// Spinner
window.initSpinner = function () {
	if ($.isFunction($.fn['spinner'])) {
		$('[data-plugin-spinner]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginSpinner(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initSpinner();
	});
}).apply(this, [jQuery]);

// SummerNote
window.initSummerNote = function () {
	if ($.isFunction($.fn['summernote'])) {
		$('[data-plugin-summernote]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginSummerNote(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initSummerNote();
	});
}).apply(this, [jQuery]);

// TextArea AutoSize
window.initTextAreaAutoSize = function () {
	if (typeof autosize === 'function') {
		$('[data-plugin-textarea-autosize]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginTextAreaAutoSize(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initTextAreaAutoSize();
	});
}).apply(this, [jQuery]);

// TimePicker
window.initTimePicker = function () {
	if ($.isFunction($.fn['timepicker'])) {
		$('[data-plugin-timepicker]').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginTimePicker(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initTimePicker();
	});
}).apply(this, [jQuery]);

// Toggle
window.initToggle = function () {
	$('[data-plugin-toggle]').each(function () {
		var $this = $(this),
			opts = {};

		var pluginOptions = $this.data('plugin-options');
		if (pluginOptions)
			opts = pluginOptions;

		$this.themePluginToggle(opts);
	});
};

(function ($) {
	'use strict';
	$(function () {
		window.initToggle();
	});
}).apply(this, [jQuery]);

// Tooltip
window.initTooltip = function () {
	if ($.isFunction($.fn['tooltip'])) {
		$('[data-toggle=tooltip],[rel=tooltip]').tooltip({ container: 'body' });
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initTooltip();
	});
}).apply(this, [jQuery]);

// Widget - Todo
window.initWidgetTodoList = function () {
	if ($.isFunction($.fn['themePluginWidgetTodoList'])) {
		$('[data-plugin-todo-list], ul.widget-todo-list').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginWidgetTodoList(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initWidgetTodoList();
	});
}).apply(this, [jQuery]);

// Widget - Toggle
window.initWidgetToggleExpand = function () {
	if ($.isFunction($.fn['themePluginWidgetToggleExpand'])) {
		$('[data-plugin-toggle-expand], .widget-toggle-expand').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginWidgetToggleExpand(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initWidgetToggleExpand();
	});
}).apply(this, [jQuery]);

// Word Rotator
window.initWordRotator = function () {
	if ($.isFunction($.fn['themePluginWordRotator'])) {
		$('[data-plugin-wort-rotator], .wort-rotator:not(.manual)').each(function () {
			var $this = $(this),
				opts = {};

			var pluginOptions = $this.data('plugin-options');
			if (pluginOptions)
				opts = pluginOptions;

			$this.themePluginWordRotator(opts);
		});
	}
};

(function ($) {
	'use strict';
	$(function () {
		window.initWordRotator();
	});
}).apply(this, [jQuery]);

// Base
window.initBase = function () {
	theme = theme || {};
	theme.Skeleton.initialize();
};

(function (theme, $) {
	'use strict';
	window.initBase();
}).apply(this, [window.theme, jQuery]);

// Mailbox
window.initMailbox = function () {
	$('[data-mailbox]').each(function () {
		var $this = $(this);

		$this.themeMailbox();
	});
};

(function ($) {
	'use strict';
	$(function () {
		window.initMailbox();
	});
}).apply(this, [jQuery]);