define(function(require){

    //获取字符串真实长度，加上匹配的全角字符长度
    String.prototype.getActualLength = function(){
        return this.length + (this.match(/[^\x00-\xff]/g) || '').length;
    }

    String.prototype.limitLength = function(length){
        if(this.getActualLength() > length){
            this.substring(0,length).limitLength();
        }
        return this;
    }

    var limitLength = function(elem,length){
        var _val = elem.value;
        if(_val.limitLength() > length){
            _val = _val.substring(0,length);
            while(_val.limitLength() > length){
                _val = _val.substring(0,_val.length-1);
            }
        }
        elem.value = _val;
    }


});