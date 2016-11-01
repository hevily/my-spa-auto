var tpl = require('../../views/home.html');
var controller = function() {
	appView.html(_.template(tpl)({
	}));
	$(".form_datetime").datetimepicker({format: 'yyyy-mm-dd'});
}
	
controller.onRouteChange = function() {
};

module.exports = controller;