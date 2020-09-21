(function () {
    function inherit(subType, superType) {
        //在new inheritFn 的时候将构造函数指向子类
        function inheritFn() { this.constructor = subType }
        inheritFn.prototype = superType.prototype;
        //将子类的原型指向父类原型的一个副本
        subType.prototype = new inheritFn();
    }

    function Trigger(config, callhandler) {
        this.config = config;
        this.callhandler = callhandler;
    } //触发器
    Trigger.prototype.listen = function () {
        var me = this;
        var ev = me.config.event;
        var t = me.config.target;
        var evname = ev.substr(2);//事件名称
        console.log("开始监听:", me.config.name);
        var tfun = function (e) { me.trigger(e); };
        return (ev != "onview" && ($.fn && $.fn.jquery && $(t)[evname](tfun) || $(t).on(evname, tfun))), 0;
    } //监听方法
    Trigger.prototype.trigger = function (obj) {
        console.log("me is trigger;");
        if (this.callhandler)
            this.callhandler(this, obj);
    } //触发

    function ViewTrigger(config, callhandler) {
        Trigger.call(this, config, callhandler);
        this.isSec = 1;//标志是否读秒成功
        this.isBottom = 1;//标志是否浏览到底部
        this.trigger = function () {
            return this.isSec && this.isBottom && Trigger.prototype.trigger.call(this) || 0;
        }
        this.listen = function () {
            var me = this;
            var op = me.config.options;
            op && (op.seconds && (me.isSec = 0, console.log('监听秒数'), me.listenSeconds()) || op.bottom && (me.isBottom = 0, console.log('监听底部'), me.listenBottom()));
            Trigger.prototype.listen.call(this);
        }
    } //浏览触发器
    inherit(ViewTrigger, Trigger);
    ViewTrigger.prototype.listenSeconds = function () {
        var me = this;

        var ni = me.config.options.seconds;
        setTimeout(loop, 1000);
        function loop() {
            console.log(ni);
            --ni && (setTimeout(loop, 1000), 1) || (me.isSec = 1, console.log("timer ok"), me.trigger(), 1);
        }
        return 0;
    } //监听浏览秒数
    ViewTrigger.prototype.listenBottom = function () {
        var me = this;
        document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) && $(window).scroll(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            !me.isBottom && (scrollTop + windowHeight == scrollHeight) && (console.log("bottom is true"), me.isBottom = 1, me.trigger());
        }) || (me.isBottom = 1, console.log("no scroll"), me.trigger());
        return 0;
    } //监听底部


    function ActionHandler(svrconfig) {
        this.svrconfig = svrconfig;
        this.viewid = 0;//浏览ID
    }//处理程序
    ActionHandler.prototype.viewHandler = function () {     
        var me = this;       
        $.ajax({
            type:"POST",
            url: me.svrconfig.viewsvr,
            data: { "url": location.href },
            dataType: 'json',
            success: function (rdata) {                
                if (!rdata.Result) {
                    alert(rdata.Message);
                    return false;
                }
                me.viewid = rdata.Data;                
            },
            error: function (e) {
                console.log(e);
            }
        });       
        console.log("浏览", location.href);
    }//浏览处理程序
    ActionHandler.prototype.triggerHandler = function (tg, e) {//tg:触发器，e目标
        var config = tg.config;
        console.log("config:", config);
        var val = e && config.event == "onchange" && $(e.target).val() || "";
        console.log("val:", val);
        var me = this;
        console.log(me);
        me.viewid && postdata() || function () {
            var i = 5;
            loop();
            function loop() {
                --i && me.viewid && postdata() || setTimeout(loop,1000), 1; 
            }
            return 1;
        }();       
        function postdata() {
            var tinfo = { "id": config.id, "name": config.name, "event": config.event, "param": val };
            var pdata = {
                "url": location.href,
                "viewid": me.viewid,
                "triggerInfo": tinfo
            };           
            $.ajax({
                type: "POST",
                url: me.svrconfig.triggersvr,
                data: pdata,
                dataType: 'json',
                success: function (rdata) {                   
                    if (!rdata.Result) {
                        alert(rdata.Message);                      
                    }                   
                },
                error: function (e) {
                    console.log(e);
                }
            });       
            console.log("触发", location.href);
            return 1;
        }
        if (config.ontrigger)
            config.ontrigger(config);
          
    }//触发处理程序



    function VTrigger(handler) {
        this.arrTrigger = [];//触发器数组
        var hostp =location.protocol + "//" + location.host
        var actionHandler = new ActionHandler({
            "viewsvr": hostp + "/commonproduct/exploit/browse",
            "triggersvr": hostp+"/commonproduct/exploit/trigger"
        });//创建处理实例
        this.handler = handler || actionHandler;//处理接口
                 
    }//触发器容器
    VTrigger.prototype.init = function (configs) {
        var me = this;
        configs && (Array.isArray(configs) && function () { for (var i = 0; i < configs.length; i++)myinit(configs[i]); return 1; }() || myinit(configs));
        function myinit(t) {
            var trItem = t.event == "onview"
                && new ViewTrigger(t, htrigger)
                || new Trigger(t, htrigger);
            me.arrTrigger.push(trItem);
            trItem.listen();//开始监听
        }
        function htrigger(vg, e) {
            me.handler.triggerHandler(vg, e);
        }
        me.handler.viewHandler(location.href);//调用浏览
    }

    function VTriggerCreater(handler) {
        var bt = new VTrigger(handler);
        return bt;
    }//实例工厂
    $VTrigger = VTriggerCreater;
})();