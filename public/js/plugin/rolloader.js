var getWindowHeight = function () {
    return window.innerHeight ? window.innerHeight :
        document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight :
            document.body.clientHeight;
};

var getScrollTop = function () {
    return window.pageYOffset ? pageYOffset :
        document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop :
            document.body.scrollTop;
};

var Rolloader = function (id, callback) {
    var elem = document.getElementById(id);
    var windowHeight = getWindowHeight();

    this.index = 1;
    this.isEnd = false;

    this.run = function () {
        var _this = this;
        window.onscroll = function () {
            if (((getScrollTop() + windowHeight) >= elem.offsetTop) && !_this.isEnd) {
                callback.call(Rolloader, _this);
            }
        }
    }

};

module.exports  = {
    run: function (id, callback){
        new Rolloader(id, callback).run();
    }
};