function test1() {
    $VTrigger().init();
}//纯浏览日志，页面无触发器



function test2() {
    var myTg = $VTrigger();
    myTg.init({
        "event": "onview",//事件类型
        "options": { "seconds": 10, "bottom": 1 },//seconds浏览秒数，bottom是否要监听底部，如需监听为1，不需要监听底部为0
        "name": "触发器名称-测试活动",
        "id": "0",//触发器编号                
        "ontrigger": function () { //当触发器被触发时，前端回调
            console.log("准备发红包动画");
        }
    });
}//注册页面浏览时长和底部监听触发器




function test3() {
    var myTg = $VTrigger();
    myTg.init({
        "event": "onclick",//事件类型                
        "name": "触发器名称测试按钮",
        "target": "#btnB",//被监听元素id或class
        "id": "0"//触发器编号                                
    });
} //注册某个按钮被点击触发器




function test4() {
    var myTg = $VTrigger();
    myTg.init({
        "event": "onchange",//事件类型                
        "name": "触发器名称测试输入",
        "target": ".mytext",//被监听元素id或class
        "id": "0"//触发器编号                                
    });
}//注册某个输入框change触发器



function test5() {
    var myTg = $VTrigger();
    var regconfig = [
        {
            "event": "onchange",//事件类型                
            "name": "触发器名称测试输入",
            "target": ".mytext",//被监听元素id或class
            "id": "2"//触发器编号                                
        },
        {
            "event": "onchange",//事件类型                
            "name": "触发器名称测试输入",
            "target": ".mytext2",//被监听元素id或class
            "id": "3"//触发器编号                                
        },
        {
            "event": "onview",//事件类型
            "options": { "seconds": 10, "bottom": 1 },//seconds浏览秒数，bottom是否要监听底部，如需监听为1，不需要监听底部为0
            "name": "触发器名称-测试活动",
            "id": "1",//触发器编号                
            "ontrigger": function () { //当触发器被触发时，前端回调
                console.log("准备发红包动画");
            }
        },
    ];
    myTg.init(regconfig);
}//注册多个触发器
