
var getCssProperty = function(elem, prop){
    if(elem.offsetWidth){
        return elem.offsetWidth;
    }else if(window.getComputedStyle){
        return window.getComputedStyle(elem,null).getPropertyValue(prop);
    }else if(elem.currentStyle){
        return elem.currentStyle.getPropertyValue(prop);
    }else{
        return elem.style.getPropertyValue(prop);
    }
}

exports.windowWidth = function () {
    return window.innerWidth
        ? window.innerWidth
        : document.documentElement && document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : document.body.clientWidth;
};

exports.windowHeight = function () {
    return window.innerHeight
        ? window.innerHeight
        : document.documentElement && document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : document.body.clientHeight;
};

exports.scrollTop = function () {
    return window.pageYOffset
        ? pageYOffset
        : document.documentElement && document.documentElement.scrollTop
        ? document.documentElement.scrollTop
        : document.body.scrollTop;
};

exports.toTop = function(){
    document.documentElement.scrollTop = document.body.scrollTop =0
};

exports.width = function(elem){
    return getCssProperty(elem, 'width');
};