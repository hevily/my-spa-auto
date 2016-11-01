    var director = require('./lib/director');
    //先设置一个路由信息表，可以由html直出，纯字符串配置
    var routes = {
        '/home': require('./module/home'),
        '/integrated': require('./module/integrated'),
        '/category': require('./module/category'),
        '/reminder': require('./module/reminder'),
        '/complaint': require('./module/complaint'),
        //director内置了普通必选参数的写法，这种路由，
        //必须用路径"#module2/kenko"才能匹配，无法缺省
        //'module2/?([^\/]*)/?([^\/]*)': 'module2/controller2.js' 
        //可缺省参数的写法，其实就是正则表达式,括号内部分会被抽取出来变成参数值。
        //backbone做得比较好，把这个语法简化了
        //  " /?([^\/]*) "  这样的一段表示一个可选参数，接受非斜杠/的任意字符
    };
    var currentController = null;

    //用于把字符串转化为一个函数，而这个也是路由的处理核心
    var routeHandler = function(controller) {
        return function() {
            var params = arguments;
            if (currentController && currentController !== controller) {
                currentController.onRouteChange && currentController.onRouteChange();
            }
            currentController = controller;
            controller.apply(null, params);
        }
    };

    for (var key in routes) {
        routes[key] = routeHandler(routes[key]);
    }
    var router = director.Router(routes);
    router.init(); //开始监控url变化
    //module.exports = router;