var tpl = require('../../views/integrated.html');
var controller = function() {
	appView.html(_.template(tpl)({
	}));
}
	
controller.onRouteChange = function() {
};

module.exports = controller;