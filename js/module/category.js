var tpl = require('../../views/category.html');
var controller = function() {
	appView.html(_.template(tpl)({
	}));
}
	
controller.onRouteChange = function() {
};

module.exports = controller;