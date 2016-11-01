(function($) {
	"use strict";
	$.extend($.validator.messages, {
		required: "必选字段",
		remote: "请修正该字段",
		email: "请输入正确格式的电子邮件",
		url: "请输入合法的网址",
		date: "请输入合法的日期",
		dateISO: "请输入合法的日期 (ISO).",
		number: "请输入合法的数字",
		digits: "只能输入整数",
		creditcard: "请输入合法的信用卡号",
		equalTo: "请再次输入相同的值",
		accept: "请输入拥有合法后缀名的字符串",
		maxlength: $.validator.format("请输入一个长度最多是 {0} 的字符串"),
		minlength: $.validator.format("请输入一个长度最少是 {0} 的字符串"),
		rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
		range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
		max: $.validator.format("请输入一个最大为 {0} 的值"),
		min: $.validator.format("请输入一个最小为 {0} 的值")
	});

	// 重写验证中获取字符串长度的方法，使之支持中文
	$.validator.methods.getLength = function(value, element) {
		switch (element.nodeName.toLowerCase()) {
			case "select":
				return $("option:selected", element).length;
			case "input":
				if (this.checkable(element)) {
					return this.findByName(element.name).filter(":checked").length;
				}
		}
		// 支持中文处理replace(/[^\x00-\xff]/g,"aa")
		return value.replace(/[^\x00-\xff]/g, "aa").length;
	};

	// check String length is too lang ,support Chinese
	$.validator.addMethod("stringmaxlengh", function(value, element, param) {
		var len = value ? value.replace(/[^\x00-\xff]/g, "aa").length : 0;
		return len <= param;
	}, $.validator.format("最多只能输入{0}个字符"));

	$.validator.addMethod("stringminlengh", function(value, element, param) {
		var len = value ? value.replace(/[^\x00-\xff]/g, "aa").length : 0;
		return len >= param;
	}, $.validator.format("不能少于{0}个字符"));

	//		// 只能输入字母、数字和下划线
	//		$.validator.addMethod("abc123_", function(value, element, param) {
	//			return true;//!value || /^[a-zA-Z0-9_]$/.test(value);
	//		}, $.validator.format("只能输入字母、数字和下划线"));
	$.validator.addMethod("data-rule-required", function(value, element, param) {
		return !value || $.trim(value);
	}, $.validator.format("{0}输入不能为空"));

	$.validator.addMethod("abc123_", function(value, element, param) {
		return !value || /^(\w+)$/.test(value);
	}, $.validator.format("只能输入字母、数字和下划线"));

	$.validator.addMethod("data-email", function(value, element, param) {

		var patten = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

		return patten.test(value);

	}, $.validator.format("请输入正确格式的电子邮件"));

	$.validator.addMethod("specialstr", function(value, element, param) {
		return !value || (!!$.trim(value) && /^[\u4e00-\u9fa5_a-zA-Z0-9 ()]+$/.test(value));
	}, function(name, input) {
		if (!$.trim($(input).val())) {
			return '输入不能为空';
		} else {
			return $.validator.format("{0}只能输入中文、英文字母、数字、下划线、空格和小括号", name)
		}

	});

	$.validator.addMethod("reservedkey", function(value, element, param) {
		var reg = new RegExp('^(' + $.epm.syscfg.SYSTEM_RESERVED_KEYS + ')$')
		return !value || !reg.test(value)
	}, function(name, input) {
		return $.validator.format("{0}名称已存在", name)
	});

})($);