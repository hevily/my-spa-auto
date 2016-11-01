(function() {

    window.appView = $('#container'); //用于各个模块控制视图变化
    window.$ = $; //暴露必要的全局变量，没必要拘泥于requirejs的强制模块化

    require('./config');
    require('./lib/p-loading');
    require('./lib/bootbox');
/*    require('./lib/jquery.validate');
    require('./lib/additional-methods');
    require('./lib/jquery-validation-fix');*/

    require('./eutils');

    require('./lib/bootstrap-paginator');

    require('./lib/pnotify.fix');

    $.ajaxSetup({
        type: "POST",
        dataType: 'json',
        data:{
           
        }
    });

    
    var menu = require('./menu');

    menu($('#menu'));

}());