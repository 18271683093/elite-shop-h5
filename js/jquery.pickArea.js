/*
* pluginName:pickCity,
* author:yangyang2010cs@163.com
* Individual contact method:986372959(It's my QQ)
* date:2017/09/07 18:45:00
* */
;(function($,window,document,undefined){
    'use strict'; //严格模式，提高效率
    var pluginName = 'pickArea', //定义插件的名字
        defaults = {},//定义一个默认的参数
        liH,//每一个li的高度
        $list,//滑动列表
        globalThis_launchHtml,
        data,
        pluginThis;//指代指向plugin的this
    var global = {
        options:''
    };
    function Plugin(options){ //创建构造函
        //this -- Plugin对象
        pluginThis = this;
        this.options = options;
        this.init(); //初始化
    }
    Plugin.prototype = {
        init:function(){
            global.options = this.options;
            data = dataJson.provinces;//获取数据   data[i].code省code  data[i].name省name
            console.log(data)
            this.render(); //渲染
        },
        render:function(){
            //this -- Plugin对象
            var str = '<div class="pick-container touches">'+
                '<div class="row pick-m0">'+
                '<div class="col s3 center-align">'+
                '<a href="javascript:void(0)" class="pick-cancel">取消</a>'+
                '</div>'+
                '<div class="col s6 center-align pick-title">设置地区</div>'+
                '<div class="col s3 center-align">'+
                '<a href="javascript:void(0)" class="pick-sure">确定</a>'+
                '</div>'+
                '</div>'+
                '<div class="row pick-m0">'+
                '<div class="col s4 pick-timer">'+
                    '<div class="pick-bgTop"></div>'+
                    '<ul class="list pick-province">'+
                    '</ul>'+
                    '<div class="current current-date-right"></div>'+
                    '<div class="pick-bgBottom"></div>'+
                '</div>'+
                '<div class="col s4 pick-timer">'+
                    '<div class="pick-bgTop"></div>'+
                    '<ul class="list pick-city">'+
                    '</ul>'+
                    '<div class="current current-date-left current-date-right"></div>'+
                    '<div class="pick-bgBottom"></div>'+
                '</div>'+
                '<div class="col s4 pick-timer">'+
                    '<div class="pick-bgTop"></div>'+
                    '<ul class="list pick-county">'+
                    '</ul>'+
                    '<div class="current current-date-left"></div>'+
                    '<div class="pick-bgBottom"></div>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '<div class="pick-layer"></div>';
            $("body").append(str);
            $list = $(".list");
            $(".pick-cancel,.pick-layer").on("click",function(){
                $(".touches,.pick-layer").remove();
                $("body").unbind("touchmove"); //恢复了body的拖动事件
            });
            $(".pick-sure").on("click",function(){
                var val = '';
                $(".pick-active").each(function(){
                    val += $(this).text()+'-';
                });
                $(globalThis_launchHtml).val(val.substring(0,val.length-1));
                $(".touches,.pick-layer").remove();
                $("body").unbind("touchmove"); //恢复了body的拖动事件
            });
            $("body").on('touchmove',function (e){
                e.preventDefault();
            });
            liH = 44;//li的高度
            this.createProvince();
            this.handleEvent(); //绑定事件
            return this;
        },
        createProvince:function(){
            for(var i=0;i<data.length;i++){
                $list.eq(0).append('<li data-provinceCode="'+data[i].id+'" data-provinceIndex="'+i+'">' +data[i].name+'</li>'); //data[i].code省code  data[i].name省name
            }
            $list.eq(0).find("li").eq(0).addClass("pick-active");//一开始默认第三行选中
            $list.eq(0).css("top",2*liH);
            this.createCity();
        },
        createCity:function(){
            $list.eq(1).html('');
            var selectProCode = $list.eq(0).find("li.pick-active").attr("data-provinceCode");
            var getCityArr = '';
            for(var i=0;i<data.length;i++){
                if(data[i].id == selectProCode){
                    getCityArr = data[i].cities;
                }
            }
            console.log(getCityArr);
            for(var j=0;j<getCityArr.length;j++){
                $list.eq(1).append('<li data-cityCode="'+getCityArr[j].id+'" data-cityIndex="'+j+'">' +getCityArr[j].name+'</li>');
            }
            $list.eq(1).find("li").eq(0).addClass("pick-active");//一开始默认第三行选中
            $list.eq(1).css("top",2*liH);
            this.createCounty();
        },
        createCounty:function(){
            $list.eq(2).html('');
            var selectProIndex = $list.eq(0).find("li.pick-active").attr("data-provinceIndex");
            var selectCityIndex = $list.eq(1).find("li.pick-active").attr("data-cityIndex");
            var getCountyArr = data[selectProIndex].cities[selectCityIndex].areas;

            for(var j=0;j<getCountyArr.length;j++){
                $list.eq(2).append('<li data-cityCode="'+getCountyArr[j].id+'">' +getCountyArr[j].name+'</li>');
            }
            $list.eq(2).find("li").eq(0).addClass("pick-active");//一开始默认第三行选中
            $list.eq(2).css("top",2*liH);
        },
        handleEvent:function(){ //函数绑定
            //this -- Plugin对象
            $list.each(function(){
                var startY = null,//开始的pageY
                    endY = null,//结束的pageY
                    distY = null,//endY - startY
                    cTop = null,//currentTop
                    _top = null,//ul.list的top值
                    timeS = null,//滚动的开始时间
                    distT = null,//每一次滚动的时间差
                    speed = null;//速度
                var SE = null;
                var ME = null;
                function startCallBack(e){
                    //这里的this指向当前滑动的$list
                    if(e.originalEvent.touches){
                        SE=e.originalEvent.targetTouches[0];
                        console.log(SE)
                    }
                    startY = SE.pageY;
                    cTop = $(this).position().top;
                    timeS = new Date();
                }
                function moveCallBack(e){
                    //这里的this指向当前滑动的$list
                    if(e.originalEvent.touches){
                        ME=e.originalEvent.targetTouches[0];
                        //console.log(ME)
                    }
                    var scrollSpeed = pluginThis.options.speed || 2;
                    endY = ME.pageY;
                    distY = scrollSpeed*(endY - startY);
                    //console.log(distY);//往下滑动是正直，往上是负值
                    if($(this).find("li").length==2){
                        if(cTop+distY>88){//从顶部往下滑动
                            _top = 88;
                        } else if(cTop+distY<$(this).parent().height()-$(this).height()-44){//从底部往上滑动
                            _top = $(this).parent().height() - $(this).height()-44;
                        } else {//中间地方滑动
                            _top = cTop+distY;
                        }
                    } else if($(this).find("li").length==1){
                        return;
                    } else {
                        if(cTop+distY>88){//从顶部往下滑动
                            _top = 88;
                        } else if(cTop+distY<$(this).parent().height()-$(this).height()-88){//从底部往上滑动
                            _top = $(this).parent().height() - $(this).height()-88;
                        } else {//中间地方滑动
                            _top = cTop+distY;
                        }
                    }
                    _top = _top - _top % liH;//取整
                    $(this).css('top',_top);
                    if(_top==44){
                        $(this).find("li").eq(1).addClass("pick-active").siblings().removeClass("pick-active");
                    } else if(_top==88){
                        $(this).find("li").eq(0).addClass("pick-active").siblings().removeClass("pick-active");
                    } else {
                        $(this).find("li").eq(Math.abs(_top/liH)+2).addClass("pick-active").siblings().removeClass("pick-active");
                    }
                }
                function endCallBack(e){
                    //这里的this指向当前滑动的$list
                    var $this = $(this);
                    console.log()
                    var dir = distY < 0 ? 1 : -1;//方向 上移为1，下移为-1
                    distT = new Date() - timeS;
                    speed = Math.abs(distY / distT);//单位px/ms
                    if($(this).find("li").length==1){
                        return;
                    } else {
                        if(speed>0.6) {
                            /*alert(1)*/
                            if (dir == 1 && Math.abs(_top / liH) + 3 == $(this).find('li').length) { //手指向上滑动
                                if($this.attr('class')==$list.eq(0).attr("class")){
                                    pluginThis.createCity();
                                } else if($this.attr('class')==$list.eq(1).attr("class")){
                                    pluginThis.createCounty();
                                }

                                return;//到底了，不能滑了
                            } else if(dir==-1 && _top==88){ //手指向下滑动
                                if($this.attr('class')==$list.eq(0).attr("class")){
                                    pluginThis.createCity();
                                } else if($this.attr('class')==$list.eq(1).attr("class")){
                                    pluginThis.createCounty();
                                }
                                return;//到顶了，不能滑了
                            }
                        }
                        setTimeout(function(){
                            $this.css("top",_top);
                            if(_top==44){
                                $(this).find("li").eq(1).addClass("pick-active").siblings().removeClass("pick-active");
                            } else if(_top==88){
                                $(this).find("li").eq(0).addClass("pick-active").siblings().removeClass("pick-active");
                            } else {
                                $(this).find("li").eq(Math.abs(_top/liH)+2).addClass("pick-active").siblings().removeClass("pick-active");
                            }

                            if($this.attr('class')==$list.eq(0).attr("class")){
                                pluginThis.createCity();
                            } else if($this.attr('class')==$list.eq(1).attr("class")){
                                pluginThis.createCounty();
                            }
                        },50);
                    }
                }
                $(this).off('touchstart').on('touchstart',startCallBack); //下滑开始 这里的this指向plugin对象
                $(this).off('touchmove').on('touchmove',moveCallBack); //滑动的时候 这里的this指向plugin对象
                $(this).off('touchend').on('touchend',endCallBack); //滑动完了 这里的this指向plugin对象
            })
        }
    };
    $.fn[pluginName] = function(options){
        $(this).click(function(){
                globalThis_launchHtml = this;
                new Plugin(options);
        });
        return this;//返回调用插件的对象，以便支持链式调用
    }
})(jQuery,window,document);

