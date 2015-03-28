define(function (require, exports, module) {

    var getWindowHeight = function () {
        return window.innerHeight ? window.innerHeight :
            document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight :
                document.body.clientHeight;
    }
    var getScrollTop = function () {
        return window.pageYOffset ? pageYOffset :
            document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop :
                document.body.scrollTop;
    }

    exports.run = function(id, callback){
        var elem = document.getElementById(id);
        var windowHeight = getWindowHeight();
        var index = 1;
        var isEnd = false;
        window.onscroll = function(){
            if((getScrollTop() + windowHeight) >= elem.offsetTop && !isEnd){
                callback(++index,isEnd);
            }
        }
    };
});