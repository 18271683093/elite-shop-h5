
$(function(){
  
    $('#btn-buy-hook').click(function(){
        cons('xx')
        $('#shade-hook').show();
        $('#buy-card-hook').slideDown(300);
    })

    $('#close-buy-card-hook,#shade-hook').click(function(){
        $('#shade-hook').hide();
        $('#buy-card-hook').slideUp(100);
    })
})




function cons(){
    Array.prototype.forEach.call(arguments,(function(v){console.log(v)}))
}

// 基于jq
function NumControl(
    inputQuery,
    addQuery,
    subQuery,opts
){
    var _this = this;
    _this.opts={
        disabled:"disabled",
        min:1,
        max:10000
    },opts&&$.extend(_this.opts,opts);
    _this.$input = $(inputQuery);
    _this.$addBtn = $(addQuery);
    _this.$subBtn = $(subQuery);
    _this.value = Number(_this.$input.val());

    // 初始化
    if(_this.value<_this.opts.min){
        _this.value = _this.opts.min;
        _this.$input.val(_this.value)
    }

    if(_this.value>_this.opts.max){
        _this.value = _this.opts.max;
        _this.$input.val(_this.value)
    }
    _this.$input.keyup(function(){ 
        var reg = /^[0-9]*[1-9][0-9]*$/;
        // 输入数字 并且当前值当min和max之间 包括断电
        // 否则 当前值恢复输入之前 结束
       if(!reg.test(this.value) ||  (this.value < _this.opts.min ) || (this.value > _this.opts.max )){
           this.value = _this.value;
           return;
       }

       _this.value = Number(this.value)
       cons(this.value,_this.value)
    })
    _this.$addBtn.click(function(){
        if(_this.disabled ==="add") return;
        _this.value++;
        _this.$input.val(_this.value);
        _this.resetDisable();
    })
    _this.$subBtn.click(function(){
        if(_this.disabled ==="sub") return;
        _this.value--;
        _this.$input.val(_this.value);
        _this.resetDisable();
    })

    _this.resetDisable();

 
}

NumControl.prototype.resetDisable=function(){
  
  if(this.disabled === 'add')  {
    this.$addBtn.removeClass(this.opts.disabled);
    this.disabled="";
  };
   if(this.disabled === 'sub') {
    this.$subBtn.removeClass(this.opts.disabled);
    this.disabled="";
   };
    if(this.value -1< this.opts.min) {
        this.disabled = "sub";
        this.$subBtn.addClass(this.opts.disabled)
    };

    if(this.value+1 >  this.opts.max) {
        this.disabled = "add";
        this.$addBtn.addClass(this.opts.disabled)
    };
}


function CountDownHook(query,opts){
    this.timeInterval =1000;
    this.$el = $(query);
    this.timeStamp = opts.timeStamp;
    this.cb = opts.cb;
    this.$hourEl = $('<span class="bg-white"></span>');
    this.$minuteEl = $('<span class="bg-white"></span>');
    this.$secondEl = $('<span class="bg-white"></span>');
    this.$el.append( this.$hourEl) ;
    this.$el.append( "<span>:</span>") ;
    this.$el.append( this.$minuteEl) ;
    this.$el.append( "<span>:</span>") ;
    this.$el.append( this.$secondEl) ;
    this.timer = setInterval(this.timechange.bind(this),this.timeInterval);
    this.timechange()
}

CountDownHook.prototype.timechange = function(){
    this.timeStamp -=this.timeInterval;
    if(this.timeStamp<0){
        this.timeStamp =0;
        clearInterval(this.timer) ;
        this.cb();
    }
    var curTime = this.calculate( this.timeStamp);
    this.$hourEl.text(curTime.hour)
    this.$minuteEl.text(curTime.minute)
    this.$secondEl.text(curTime.second)
}

CountDownHook.prototype.calculate  = function (ms) { 
    var days = parseInt(ms / (1000 * 60 * 60 * 24));
    var hours = parseInt((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((ms % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (ms % (1000 * 60)) / 1000;
  
    return {
        day:days,
        hour:hours<9?"0"+hours:hours,
        minute:minutes<9?"0"+minutes:minutes,
        second:seconds<9?"0"+seconds:seconds,
    }
} 





