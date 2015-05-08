
var measure = require('../plugin/measure.js')

var monitor = function (id, callback) {
    var elem = document.getElementById(id);
    var windowHeight = measure.windowHeight();

    this.index = 1;
    this.isEnd = false;

    this.setText = function(txt){
        elem.innerHTML = txt;
        return this;
    };

    this.setClass = function(cls){
        var clsName = elem.className;
        if(clsName.indexOf(cls) === -1){
            elem.className = cls;
        }
    };

    this.run = function () {
        var _this = this;
        if(typeof window.onscroll === 'function'){
            var temporary = window.onscroll;
        }
        window.onscroll = function () {
            temporary && temporary();
            if (!_this.isEnd && ((measure.scrollTop() + windowHeight) >= elem.offsetTop)) {
                callback.call(monitor, _this);
            }
        }
    };

};

exports.run = function (id, callback) {
    new monitor(id, callback).run();
};