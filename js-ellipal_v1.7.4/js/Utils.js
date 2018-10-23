// 		(c)2018 Ellipal Limited
//		Web App demo & JavaScript Lib

(function(){
	var utils = {};

	 var subStr = function(str, length, suffix) {
        var ret;
        str = str || "";
        if(!isValid(suffix)){
            suffix = "...";
        }
        length = length || 10;
        if (_getStrLen(str) > length) {
            var len = 0;
            var code;
            ret = "";
            for(var i = 0; i < str.length; i++){
                ret += str[i];
                code = str.charCodeAt(i);
                if(code >= 0x20 && code <= 0x7e){
                    len++;
                }
                else{
                    len += 2;
                }
                if(len >= length){
                    break;
                }
            }
            ret += suffix;
        }
        else{
            ret = str;
        }
        return ret;
    };
    
    var trim = function(str ,is_global){
        if(!is_global) {is_global = "g"}
       var result;
       result = str.replace(/(^\s+)|(\s+$)/g,"");
       if(is_global.toLowerCase()=="g"){
           result = result.replace(/\s/g,"");
           result = result.replace(/\//g, "_")
       }
       return result;
   }

	var toNonExponential = function(num) {
        var n = new Number(num);
	    var m = n.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
	    return n.toFixed(Math.max(0, (m[1] || '').length - m[2]));
	}

    var toFixNum= function(num, turnZero){
        var n = utils.toNonExponential(num)
        var result;
        if(n < 1e-6){
            result = "<0.000001";
            if(turnZero) {
                result = "0";
            }
        }
        else{
            var rs = n.indexOf('.');
            if (rs < 0) {
                rs = 0;
            }
            else{
                rs = Math.min(6, n.split(".")[1].length);
            }
            result = parseFloat(n).toFixed(rs);
        }
        return result;
    }

    var isSyncWrong = function(str){
        var bool = false;
        if(!ellipal.connectWallet(str)){
            bool = true;
        }
        return bool;
    }
    var isSignWrong = function(str){
        var bool = false;
        if(!ellipal.getSignedTx(str)){
            bool = true;
        }
        return bool;
    }

    utils.subStr = subStr;
    utils.trim = trim;
    utils.toNonExponential = toNonExponential;
    utils.toFixNum = toFixNum;
    utils.isSyncWrong = isSyncWrong;
    utils.isSignWrong = isSignWrong;

    _g.utils = utils;

})();
utils = _g.utils;