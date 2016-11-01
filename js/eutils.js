"use strict";
var _ = require('./lib/lodash');

module.exports = _;

var spaceSplitter = /\s+/;
(function(_) {
	var _id = 0;
	_.uniqueId = function(prefix) {
		var id = ++_id + '';
		return prefix ? prefix + id : id;
	};
	_.isLikeArray = function(value) {
		return value && typeof value == 'object' && typeof value.length == 'number';
	};
	_.uuid = function(noDash) {
		var d = new Date().getTime();
		var tmp = noDash ? 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx' : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
		var uuid = tmp.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	};
	_.clearCookie = function() {
		var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
		if (keys) {
			for (var i = keys.length; i--;) {
				document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
			}
		}
	};
	_.clearValue = function(obj) {
			_.each(obj, function(v, k) {
				if (k[0] != '$') {
					delete obj[k];
				}
			})

		},
		_.cloneAttrs = function(attrs) {
			var ret = {};
			_.each(attrs, function(v, k) {
				if (k[0] != '$') {
					ret[k] = v;
				}
			})
			return ret;
		}

	//比较简单类型索引
	_.simpleIndexOf = function(arr, value, fromIndex) {
		if(!arr) return -1;
		fromIndex = fromIndex || 0;
		for (var i = fromIndex, len = arr.length; i < len; i++) {
			if (value == arr[i]) {
				return i;
			}
		}
		return -1;
	};

	_.filterEmptyValue = function(obj) {
		var temp = {};
		_.each(obj, function(val, key) {
			if (val) {
				temp[key] = val;
			}
		});
		return temp;
	};

	_.pickValue = function(obj, key) {
		var props = key.split(".");
		var len = props.length;
		var ret = obj;
		for (var i = 0; i < len; i++) {
			ret = ret[props[i]];
			if (!ret)
				break;
		}
		return ret;
	}
	_.isPromiseLike = function(obj) {
		return obj && _.isFunction(obj.then);
	}
	_.capitalize = function(sting) {
		return sting.charAt(0).toUpperCase() + sting.slice(1);
	}

	// _.slice = Array.prototype.slice;
	_.slice = function(array, start, end) {
		if (_.isLikeArray(this)) {
			end = start;
			start = array;
			array = this;
		}

		start || (start = 0);
		if (typeof end == 'undefined') {
			end = array ? array.length : 0;
		}
		var index = -1,
			length = end - start || 0,
			result = new Array(length < 0 ? 0 : length);

		while (++index < length) {
			result[index] = array[start + index];
		}
		return result;
	}
	_.call = function() {
		var args = _.slice(arguments),
			fn = args.pop();
		return fn.apply(null, args);
	}

	_.isVisible = function(el) {
		/*if (el.length)
			el = el[0];
		return (el.offsetWidth > 0 || el.offsetHeight > 0);*/
		if (!el.length)
			el = $(el);
		return el.is(":visible");
	}
	_.undefined = _.call(function(undefined) {
		return undefined;
	})
	_.call(function() {
		var absolutePattern = /^https?:\/\//i;
		_.isAbsoluteUrl = function(url) {
			return absolutePattern.test(url);
		}
	})
	_.call(function() {
		var lowercase = function(string) {
			return _.isString(string) ? string.toLowerCase() : string;
		};
		var uppercase = function(string) {
			return _.isString(string) ? string.toUpperCase() : string;
		};
		var manualLowercase = function(s) {
			return _.isString(s) ? s.replace(/[A-Z]/g, function(ch) {
				return String.fromCharCode(ch.charCodeAt(0) | 32);
			}) : s;
		};
		var manualUppercase = function(s) {
			return _.isString(s) ? s.replace(/[a-z]/g, function(ch) {
				return String.fromCharCode(ch.charCodeAt(0) & ~32);
			}) : s;
		};
		// String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
		// locale, for this reason we need to detect this case and redefine lowercase/uppercase methods
		// with correct but slower alternatives.
		if ('i' !== 'I'.toLowerCase()) {
			lowercase = manualLowercase;
			uppercase = manualUppercase;
		}
		_.lowercase = lowercase;
		_.uppercase = uppercase;

		function int(str) {
			return parseInt(str, 10);
		}
		_.msie = function() {
			var msie = int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
			if (isNaN(msie)) {
				msie = int((/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
			}
			if (isNaN(msie))
				return _.undefined;
			else
				return msie;
		}
	})
	_.valueFn = function(value) {
		return function() {
			return value;
		}
	}


	//refrence https://github.com/yeikos/jquery.unparam/blob/master/jquery.unparam.js
	_.unparam = function(input) {
		var items, temp,
			// Expresiones regulares
			expBrackets = /\[(.*?)\]/g,
			expVarname = /(.+?)\[/,
			result = {};
		// Descartamos entradas que no sean cadenas de texto o se encuentren vacías
		if ((temp = $.type(input)) != 'string' || (temp == 'string' && !temp.length))
			return {};
		// Decodificamos la entrada y la dividimos en bloques
		items = decodeURIComponent(input).split('&');
		// Es necesario que los datos anteriores no se encuentren vacíos
		if (!(temp = items.length) || (temp == 1 && temp === ''))
			return result;
		// Recorremos los datos

		$.each(items, function(index, item) {

			// Es necesario que no se encuentre vacío

			if (!item.length)

				return;

			// Iniciamos la divisón por el caracter =

			temp = item.split('=');

			// Obtenemos el nombre de la variable

			var key = temp.shift(),

				// Y su valor

				value = temp.join('=').replace(/\+/g, ' '),

				size, link, subitems = [];

			// Es necesario que el nombre de la clave no se encuentre vacío

			if (!key.length)

				return;

			// Comprobamos si el nombre de la clave tiene anidaciones

			while ((temp = expBrackets.exec(key)))

				subitems.push(temp[1]);

			// Si no tiene anidaciones

			if (!(size = subitems.length)) {

				// Guardamos el resultado directamente

				result[key] = value;

				// Continuamos con el siguiente dato

				return;

			}

			// Decrementamos el tamaño de las anidaciones para evitar repetidas restas

			size--;

			// Obtenemos el nombre real de la clave con anidaciones

			temp = expVarname.exec(key);

			// Es necesario que se encuentre y que no esté vacío

			if (!temp || !(key = temp[1]) || !key.length)

				return;

			// Al estar todo correcto, comprobamos si el contenedor resultante es un objecto

			if ($.type(result[key]) != 'object')

			// Si no lo es forzamos a que lo sea

				result[key] = {};

			// Creamos un enlace hacia el contenedor para poder reccorrerlo a lo largo de la anidación

			link = result[key];

			// Recorremos los valores de la anidación

			$.each(subitems, function(subindex, subitem) {

				// Si el nombre de la clave se encuentra vacío (varname[])

				if (!(temp = subitem).length) {

					temp = 0;

					// Recorremos el enlace actual

					$.each(link, function(num) {

						// Si el índice es un número entero, positivo y mayor o igual que el anterior

						if (!isNaN(num) && num >= 0 && (num % 1 === 0) && num >= temp)

						// Guardamos dicho número y lo incrementamos en uno

							temp = Number(num) + 1;

					});

				}

				// Si se llegó al final de la anidación

				if (subindex == size) {

					// Establecemos el valor en el enlace

					link[temp] = value;

				} else if ($.type(link[temp]) != 'object') { // Si la anidación no existe

					// Se crea un objeto con su respectivo enlace

					link = link[temp] = {};

				} else { // Si la anidación existe

					// Cambiamos el enlace sin sobreescribir datos

					link = link[temp];

				}

			});

		});

		// Retornamos el resultado en forma de objeto

		return result;

	};


	_.deferred = function(func, context, args) {
		var dtd = $.Deferred(),
			ret = dtd.promise();
		ret.success = ret.done;
		ret.error = ret.fail;
		args = args || [];
		args.push(dtd)
		func.apply(context, args)
		return ret;
	}
	_.isRejected = function(r) {
		return typeof r === "object" && r.promise && typeof r.promise === 'function';
	}
	_.caseIf = function(_case) {
		var i = 1,
			len = arguments.length,
			ret
		while (i < len) {
			var argX = arguments[i]
			if (_.isArray(argX)) {
				_.each(argX, function(v) {
					if (_case == v) {
						ret = arguments[i + 1]
						return false
					}
				})
			} else if (_case == argX) {
				ret = arguments[i + 1]
				break;
			}
			i += 2;
		}
		if (!ret && (len % 2 === 0))
			return arguments[len - 1];
		if (typeof ret === 'function')
			return ret()
		else
			return ret;
	}
	_.escape = (function() {
		var htmlEscapes = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;'
		}
		var reUnescapedHtml = new RegExp("&(?!(lt;|gt;|amp;|quot;|#39;))|<|>|\"|'", 'g');

		function escapeHtmlChar(match) {
			return htmlEscapes[match];
		}

		return function(string) {
			return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
		}

	})()



	_.escapeObj = function(obj, reserves) {
		_.assert(function() {
			return _.type(obj) === "object" && (reserves ? _.type(reserves) === 'array' : true);
		})
		var path = {
				_path: [],
				_pathS: '',
				push: function(v) {
					this._path.push(v);
					this._pathS = this._path.join('.');
				},
				pop: function() {
					this._path.pop();
					this._pathS = this._path.join('.');
				},
				isReserv: reserves ? function(k) {
					return (this._pathS ? this._pathS + '.' + k : k) in reserves
				} : _.noop
			},
			_t;
		reserves = reserves ? function() {
			var ret = {};
			_.each(reserves, function(k) {
				ret[k] = null;
			})
			return ret;
		}() : {};

		function _escape(obj, keyword) {
			_.each(obj, function(v, k) {
				_t = typeof v;
				switch (_t) {
					case "object":
						path.push(k);
						_escape(v, keyword);
						path.pop();
						break;
					case "string":
						if (!path.isReserv(k))
							obj[k] = _.escape(v);
				}
			});
		}
		return _escape(obj);
	}
	_.override = function(newFn, oldFn, context) {
		var _oldFn = function() {
			return oldFn.apply(this || context, [].slice.call(arguments));
		};
		return function() {
			var args = [].slice.call(arguments).concat([_oldFn]);
			return newFn.apply(this || context, args);
		};
	};
})(_);
// 从 $.type 复制
(function() {
	var class2type = {},
		core_toString = class2type.toString;
	_.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});
	_.type = function(obj) {
		if (obj === null) {
			return String(obj);
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ? class2type[core_toString.call(obj)] || "object" :
			typeof obj;
	};

	_.isType = function(obj, types) {
		var t = _.type(obj);
		types = types.split(spaceSplitter);
		if (types.length) {
			for (var v in types) {
				if (types[v] === t)
					return true;
			}
		}
		return false;
	};
})();

//underscore template
// (function(_) {
// 	var _lodashTpl = _.template;
// 	var _syntaxs = {
// 		"jsp": {
// 			evaluate: /<%([\s\S]+?)%>/g,
// 			interpolate: /<%=([\s\S]+?)%>/g,
// 			escape: /<%-([\s\S]+?)%>/g,
// 			comment: /<!--(.+?)-->/g
// 		},
// 		"default": {
// 			interpolate: /<@=(.+?)@>/g,
// 			evaluate: /<@(.+?)@>/g,
// 			escape: /<@-(.+?)@>/g,
// 			comment: /<!--(.+?)-->/g
// 		}
// 	};
// 	$.extend(_.templateSettings, _syntaxs['default']);
// 	_.template = function(text, data, settings) {
// 		if (data === "jsp") {
// 			settings = settings || {};
// 			$.extend(settings, _syntaxs["jsp"]);
// 			data = null;
// 		}
// 		return _lodashTpl(text, data, settings);
// 	};
// })(_);

(function(_) {

	_.assert = function(condition, message) {
		if (typeof condition === 'function') {
			condition = condition();
		}
		message = message || "Assertion failed";
		if (window._debug && !condition) {
			alert(message + '\n\n 请查看浏览器日志');
		}
		_.console._assert(condition, message)
	};

	_.isMsie = (function() {
		var match = /(msie) ([\w.]+)/i.exec(navigator.userAgent);
		return match ? parseInt(match[2], 10) : false;
	})();

	_.isBlankString = function(str) {
		return !str || /^\s*$/.test(str);
	};
	/**
	 * @Description:获取字符串固定长度的子串，超出显示长度则截取（可以处理包含汉字的字符串）
	 * @author renzhongshan(shanren2000@126.com)
	 * @date 2013年7月22日 下午12:50:43
	 * @param str:String 源字符串
	 * @param len:int 要获取的长度
	 * @param hasDot:Boolean 超出长度时，后边是否追加后缀子串'...'
	 * @returns {String}
	 */
	_.getSubString = function(str, len, hasDot) {
		if (!str) return "";
		var newLength = 0;
		var newStr = "";
		var chineseRegex = /[^\x00-\xff]/g;
		var singleChar = "";
		var strLength = str.replace(chineseRegex, "**").length;
		var subLeng = (hasDot && strLength > len ? len - 3 : len);
		for (var i = 0; i < strLength; i++) {
			singleChar = str.charAt(i).toString();
			if (singleChar.match(chineseRegex)) {
				newLength += 2;
			} else {
				newLength++;
			}
			if (newLength > subLeng) {
				break;
			}
			newStr += singleChar;
		}

		if (hasDot === true && strLength > subLeng) {
			newStr += '...';
		}
		return newStr;
	};
})(_);
_.call(function() {
	var console = window.console || {}
	_.console = {};
	_.each(['memory', 'debug', 'error', 'info', 'log', 'warn', 'dir', 'dirxml', 'table', 'trace', 'assert', 'count', 'markTimeline', 'profile', 'profileEnd', 'time', 'timeEnd', 'timeStamp', 'timeline', 'timelineEnd', 'group', 'groupCollapsed', 'groupEnd', 'clear'], function(k) {
		var fn = console[k];
		if (!fn) {
			fn = console[k] = _.noop;
		}
		switch (k) {
			case 'debug':
			case 'info':
			case 'log':
			case 'warn':
			case 'error':
				_.console[k] = _.wrap(fn, function(orgFn) {
					if (k !== "error" && !window._debug) {
						orgFn = _.noop;
					}
					var args = [];
					_.each(_.slice(arguments, 1), function(arg) {
						args.push(formatError(arg));
					});
					orgFn.apply(console, args);
				})
				break;
			case 'assert':
				_.console._assert = _.wrap(fn, function(orgFn) {
					orgFn.apply(console, _.slice(arguments, 1));
				});
				_.console[k] = _.assert;
				break;
			default:
				_.console[k] = _.wrap(fn, function(orgFn) {
					if (!!window._debug) {
						orgFn.apply(console, _.slice(arguments, 1));
					}
				})
		}
	})

	function formatError(arg) {
		if (arg instanceof Error) {
			if (arg.stack) {
				arg = (arg.message && arg.stack.indexOf(arg.message) === -1) ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
			} else if (arg.sourceURL) {
				arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
			}
		}
		return arg;
	}
});
//eventTarget
(function(_) {
	_.eventTarget = function() {
		var core_rnotwhite = /\S+/g,
			rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
		return {
			on: function(eventName, handlers, data, one) {
				var that = this,
					idx,
					eventNames = _.type(eventName) === "string" ? eventName.match(core_rnotwhite) : eventName,
					length,
					handler,
					events;
				if (handlers === undefined) {
					_.each(eventNames, function(v, k) {
						that.on(k, v);
					});
					return that;
				}
				that._events = that._events || {};
				for (idx = 0, length = eventNames.length; idx < length; idx++) {
					var orgEventName = eventNames[idx],
						tmp = rtypenamespace.exec(orgEventName) || [];
					eventName = tmp[1];
					handler = _.type(handlers) === "function" ? handlers : handlers[eventName];
					if (handler) {
						if (one)
							handler = replaceHandler(orgEventName, handler);
						events = that._events[eventName] = that._events[eventName] || [];
						events.push({
							handler: handler,
							data: data
						});
					}
				}
				return that;

				function replaceHandler(eventName, handler) {
					var original = handler;
					var _newHandler = function() {
						that.off(eventName, _newHandler);
						original.apply(that, arguments);
					};
					return _newHandler;
				}
			},
			one: function(eventNames, handlers, data) {
				return this.on(eventNames, handlers, data, true);
			},
			trigger: function(eventName, e) {
				if (!this._events)
					return this;
				var that = this,
					events = eventName.match(core_rnotwhite),
					idx, event, callbacks,
					length;
				if (events.length === 0)
					return that;
				e = e || {};
				e.sender = that;
				e._defaultPrevented = false;
				e.preventDefault = function() {
					this._defaultPrevented = true;
				};
				e.isDefaultPrevented = function() {
					return this._defaultPrevented === true;
				};

				while (true) {
					event = events.shift();
					if (!event)
						break;
					callbacks = this._events[event];
					if (callbacks && callbacks.length) {
						for (var i = 0, len = callbacks.length; i < len; i++) {
							if (callbacks[i].data)
								callbacks[i].handler.call(that, callbacks.data, e);
							else
								callbacks[i].handler.call(that, e);
						}
					}
				}
				return that;
			},
			off: function(eventName, handler) {
				var that = this,
					idx,
					tmp = rtypenamespace.exec(eventName || "") || [],
					_eventName = tmp[1],
					events = _eventName ? (that._events || {})[_eventName] : null;
				if (eventName === undefined) {
					that._events = {};
				} else if (events) {
					if (handler) {
						for (idx = events.length - 1; idx >= 0; idx--) {
							if (events[idx].handler === handler) {
								events.splice(idx, 1);
							}
						}
					} else {
						that._events[_eventName] = [];
					}
				}
				return that;
			}
		};
	}();
})(_);

(function(_) {
	function Clazz() {}

	Clazz.extend = function(proto, cnstrctr) {
		var Base = function() {},
			member,
			that = this,
			fn,
			_defCnstrctr = function() {
				if (cnstrctr)
					this[cnstrctr].apply(this, arguments)
				else
					that.apply(this, arguments);
			},
			subclass = (cnstrctr && (proto[cnstrctr] || _defCnstrctr)) || (proto && proto.init) || _defCnstrctr;

		Base.prototype = that.prototype;
		fn = subclass.fn = subclass.prototype = new Base();

		for (member in proto) {
			if ($.isArray(proto[member])) {
				fn[member] = $.extend(true, [], Base.prototype[member], proto[member]);
			} else if (typeof proto[member] === "object" && proto[member] !== null) {
				// Merge object members
				fn[member] = $.extend(true, {}, Base.prototype[member], proto[member]);
			} else {
				fn[member] = proto[member];
			}
		}


		fn.constructor = subclass;
		subclass.extend = that.extend;

		return subclass;
	};
	_.Clazz = Clazz;

	function wrapfunc(wraper) {
		function _rap(obj) {
			if (!obj)
				return undefined;
			else if (obj.option)
				return $.proxy(obj.func, obj.context, obj.option);
			else
				return $.proxy(obj.func, obj.context);
		}

		var func = _rap(wraper.old),
			before = _rap(wraper.before),
			after = _rap(wraper.after);

		return function() {
			before && before.apply(this, arguments);
			func.apply(this, arguments);
			after && after.apply(this, arguments);
		};
	}
})(_);



if (!String.prototype.format) {
	String.prototype.format = function(arg1, arg2) {
		var self = this;

		function readV(obj, prop) {
			var tmpObj = obj[prop],
				len;
			if (tmpObj || tmpObj === '')
				return tmpObj;

			var args = prop.split(".");
			len = args.length;
			if (len > 1) {
				for (var i = 0; i < len; i++) {
					obj = obj[args[i]];
					if (obj && typeof obj !== 'object')
						break;
				}
				return obj;
			} else return tmpObj;
		}

		function rp(match, prop) { //{(.*?)}
			var v = readV(arg1, prop);
			return v !== undefined ? v : (arg2 !== undefined ? arg2 : match);
		}

		if (typeof arg1 === 'object' || typeof arg1 === 'function') {
			return self.replace(/{([^{]*?)}/g, rp);
		} else {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) {
				return typeof args[number] !== 'undefined' ? args[number] : match;
			});
		}
	};
	String.prototype.rSecond = (function() {
		var dtReg = /(^\d{4}-\d{2}-\d{2}\s{1}\d{2}:\d{2}):\d{2}$/
		return function() {
			return this.replace(dtReg, "$1")
		}
	})();
}
if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};
}
if (!String.prototype.trimLeft) {
	String.prototype.trimLeft = function() {
		return this.replace(/(^\s*)/g, "");
	};
}
if (!String.prototype.trimRight) {
	String.prototype.trimRight = function() {
		return this.replace(/(\s*$)/g, "");
	};
}

/*
	对Date的扩展，将 Date 转化为指定格式的String
	月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
	年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	例子：
	(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
	(new Date()).format("yyyy-M-d h:m.S")      ==> 2006-7-2 8:9:4.18
*/
if (!Date.prototype.format) {
	Date.prototype.format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	};
}
(function(_) {

	//比较函数
	function _cp(v1, v2) {

		if (_.isObject(v1) && _.isObject(v2)) {
			v1 = JSON.stringify(v1);
			v2 = JSON.stringify(v2);
		}
		return v1 == v2;
	}
	//回调函数
	function _cb(p, v1, v2, getPath) {
		return false;
	}
	//_.compare = function(a, b, props)
	_.compare = function(a, b, option) {
		//cpfn,props,cbFn			
		a = a || {}
		b = b || {};
		var props, cpFn = _cp,
			cbFn = _cb;
		if (_.isObject(option) && option.length === undefined) {
			option = _.extend({
				cpFn: _cp,
				cbFn: _cb
			}, option);
			props = option.props;
			cpFn = option.cpFn;
			cbFn = option.cbFn;
		} else
			props = option;

		if (props == undefined) {
			props = _.intersection(_.keys(a), _.keys(b));
		} else if (_.isString(props)) {
			props = (props || "").split(spaceSplitter);
		}


		for (var prop in props) {
			var v1 = a[props[prop]];
			var v2 = b[props[prop]];
			var cpRet = cpFn(v1, v2)
			if (cpRet == false) {
				var cbRet = cbFn(prop, v1, v2);
				if (cbRet === false)
					return false;
			}
		}
		return true;
	};

})(_);
window._ = _;