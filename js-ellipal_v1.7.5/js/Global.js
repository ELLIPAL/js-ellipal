var ell = {};
var format;
var _g;

_g = typeof self == 'object' && self.self === self && self ||
     typeof global == 'object' && global.global === global && global ||
     this ||
     {};

ell.SCAN_TYPE_SYNC_COLD_WALLET    = "1";
ell.SCAN_TYPE_SIGN_QR_CODE        = "2";
ell.SCAN_TYPE_Address_QR_CODE     = "3";

ell.ELLIPAL_APPLY_API_KEY = "http://wallet.ellipal.com/key-reg";

var ELLIPAL_API_KEY = "";

var CheckApiKey = {
    init: function(){
        if(GetQueryString("gApikey") && GetQueryString("gApikey") !== ""){
            ELLIPAL_API_KEY = GetQueryString("gApikey");
            sessionStorage["gApikey"] = GetQueryString("gApikey");
            ellipal.setApiKey(ELLIPAL_API_KEY);
            CheckApiKey.check();
        }
        else if(sessionStorage["gApikey"] && sessionStorage["gApikey"] !== ""){
            ELLIPAL_API_KEY = sessionStorage["gApikey"];
            ellipal.setApiKey(ELLIPAL_API_KEY);
            CheckApiKey.check();
        }
        else{
            layer.open({
                content: '<p>Please enter apiKey</p><input type="text" name="apiKey" class="layui-input" id="apiKey" autocomplete="off">'
                ,btn: ['Ok', 'Cancel']
                ,yes: function(index){
                    if($("#apiKey").val()){
                        sessionStorage["gApikey"] = $("#apiKey").val();
                        ELLIPAL_API_KEY = $("#apiKey").val();
                        ellipal.setApiKey(ELLIPAL_API_KEY);
                        layer.closeAll();
                        window.location.reload();
                    }
                    else{
                        layer.closeAll();
                    }
                }
                ,no: function(index){
                }
             });
        }
    },
    check: function(){
        var ret = false;
        $.ajax({
            type: 'POST',
            url: "https://wallet.ellipal.com/api/getBalance",
            async: false,
            data: {
                gApikey: ELLIPAL_API_KEY,
                gPlatform: "Web"
            },
            dataType: 'json',
            success: function(data, status, xhr){
                if(data.code == 10002){
                    layer.open({
                        content: data.code +':'+ data.msg
                        ,btn: ['Apply', 'Cancel']
                        ,yes: function(){
                            sessionStorage.clear("gApikey");
                            window.location.href = ell.ELLIPAL_APPLY_API_KEY;
                        }
                        ,no: function(index){
                            sessionStorage.clear("gApikey");
                        }
                    });
                }
                else{
                    ret = true;
                }
            }
        })
        return ret;
    }
}
CheckApiKey.init();

// cTYPE
ell.ELLIPAL_COIN_TYPE_ETH = "ETH";
ell.ELLIPAL_COIN_TYPE_ERC = "ERC"
ell.ELLIPAL_COIN_TYPE_BTC = "BTC";
ell.ELLIPAL_COIN_TYPE_BCH = "BCH";

ell.ELLIPAL_CODE_XX = "{0}:{1}@";
ell.ELLIPAL_CODE_APP_TO_COLD = "elp://{0}tosign/{1}/{2}/{3}/{4}/{5}";  // "elp://2:8@tosign/ETH/address/tx/POLY/decimal"

ell.STORAGE_CLEAR_ARRAY = ["pubkey", "cAddress", "dAddress", "aType", "contractAddr", "fee", "amount", "decimal", "gasUnit", "remark"];

/**
 * 获取参数
 */
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  decodeURI(r[2]); return null;
};

/**
 * 关于Cookie设置
 * 1.新建cookie
 * 2.读取cookies
 * 3.删除cookie
 */
var CookieHandle = {
	//新建cookie
	setCookie:function(name,value,Days){
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ value + ";expires=" + exp.toGMTString();
	},
	//读取cookies
	getCookie:function(name){
	    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	    if(arr=document.cookie.match(reg))
	        return (arr[2]);
	    else
	        return null;
	},
	//删除cookie
	delCookie:function(name){
	    var exp = new Date();
	    exp.setTime(exp.getTime() - 1);
	    var cval=CookieHandle.getCookie(name);
	    if(cval!=null)
	        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}
};

if(!String.prototype.format){
    String.prototype.format = function(){
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, num){
            return typeof args[num] !== "undefined" ? args[num] : match;
        });
    };
}
if(!String.prototype.trim){
    String.prototype.trim = function(){
        return String.prototype.replace.call(this,/^\s+|\s+$/g,'');
    };
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1减去arg2的精确结果
 **/
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/** 
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

