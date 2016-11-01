var tpl = require('../views/menu.html');
var controller = function(ele) {
	var menuStr = _.template(tpl)({
		data: {
			list: window.MenuMap
		}
	});
	ele.html(menuStr);

	var route = window.location.hash.slice(2);
	if (route) { //默认有hash
		var str = 'a[href="#/{0}"]';
		str = str.format(route);
		ele.find(str).addClass('active');
	} else {
		ele.find('a').eq(0).addClass('active');
		location.href = '#' + window.MenuMap[0].url;
	}

	var router = require('./router');

	ele.find('a').on('click',function(){
		$(this).siblings('.active').removeClass('active');
		$(this).addClass('active');
	})
};


module.exports = controller;