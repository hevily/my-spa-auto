(function($) {
	require('./pnotify');
	PNotify.prototype.options.styling = "bootstrap3";
	$.pnotify = function(params) {
		params = $.extend({
			delay: 1000,
			stack: {
				"dir1": "down",
				"dir2": "right",
				"firstpos1": 25,
				"firstpos2": ($(window).width() / 2) - (Number(PNotify.prototype.options.width.replace(/\D/g, '')) / 2)
			}
		}, params || {});
		new PNotify(params);
	}
}($));