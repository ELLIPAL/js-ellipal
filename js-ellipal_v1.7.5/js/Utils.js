(function(){
	var utils = {};

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

    //将科学计数法转换为小数
	var toNonExponential = function(num) {
        var n = new Number(num);
	    var m = n.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
	    return n.toFixed(Math.max(0, (m[1] || '').length - m[2]));
	}

    //小数点保留显示方法
    var toFixNum = function(num, turnZero){
        var n = utils.toNonExponential(num)
        var result;
        if(parseFloat(num) == 0){
            return 0;
        }
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

    var toLimitNum = function(n, bit){
        var result;
        var rs = n.indexOf('.');
        if (rs < 0) {
            result = n;
        }
        else{
            rs = Math.min(bit, n.split(".")[1].length);
            result = n.substring(0,n.lastIndexOf('.') + parseFloat(bit) + 1);
        }
        return result;
    }

    var isSyncWrong = function(str){
        var bool = true;
        if(str.indexOf("//sync/") > -1 || str.indexOf("@sync2") > -1){
            bool = false;
        }
        return bool;
    }
    var isSignWrong = function(str){
        var bool = true;
        if(str.indexOf("signed/") > -1){
            bool = false;
        }
        return bool;
    }

    var getBalanceMultiParamBySyncTx = function(tx){
        var ret = '';
        var list = tx.split("]");
        for(var i = 0; i < list.length; i++){
            ret += list[i].split("[")[0] + "|" + list[i].split("[")[1];
            if(i < list.length - 1){
                ret += "&"
            }
        }
        return ret;
    }

    var getInfoByAccAddr =  function(accAddr, cType){
        var ret;
        var list = accAddr.split("]");
        for(var i = 0; i < list.length; i++){
            var items = list[i].split("[");
            var obj = {};
            for(var j = 0; j < items.length; j++){
                if (items.length > 0) {
                    obj["type"]    = items[0];
                    obj["addr"]    = items[1];
                    if(items.length > 2){
                        obj["pubkey"] = items[2];
                    }
                    if(items.length > 3){
                        obj["legacyAddr"] = items[3];
                    }
                }
            }
            if(obj.type == cType){
                ret = obj;
            }
        }
        return ret;
    }

    utils.trim = trim;
    utils.toNonExponential = toNonExponential;
    utils.toFixNum = toFixNum;
    utils.toLimitNum = toLimitNum;
    utils.isSyncWrong = isSyncWrong;
    utils.isSignWrong = isSignWrong;
    utils.getBalanceMultiParamBySyncTx = getBalanceMultiParamBySyncTx;
    utils.getInfoByAccAddr = getInfoByAccAddr;


    _g.utils = utils;

})();
utils = _g.utils;