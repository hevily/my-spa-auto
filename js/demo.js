var tpl = '12312';
var controller = function() {
	appView.html(_.template(tpl)({
	}));
}
	
controller.onRouteChange = function() {
};

module.exports = controller;