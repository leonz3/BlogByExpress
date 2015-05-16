var measure = require('../plugin/measure.js');

var getElementByClass = function (root, className) {
    var elements = [];
    var childs = root.childNodes;
    for (var i = 0, len = childs.length; i < len; i++) {
        var item = childs[i];
        if (item.nodeType === 1 && hasClass(item, className)) {
            elements.push(item);
        }
    }
    return elements;
};

var hasClass = function (node, cls) {
    var reg = RegExp('(^|[^\\S])' + cls + '(?![^\\s])');
    return reg.test(node.className);
};

var removeClass = function (node, cls) {
    var reg = RegExp('(^|[^\\S])' + cls + '(?![^\\s])');
    var className = node.className;
    return node.className = className.replace(reg, '');
};

var addClass = function (node, cls) {
    if (hasClass(node, cls)) {
        return;
    } else {
        node.className += (' ' + cls);
    }
};

var parseWidth = function (elem) {
    return parseInt(measure.width(elem).toString().match(/^(\d+)[a-zA-Z]*$/)[1]);
};

var appendAsideBar = function () {
    var aside = document.createElement('aside');
    var btnTop = document.createElement('a');
    aside.className = 'aside';
    btnTop.className = 'btn btn-block glyphicon glyphicon-menu-up';
    aside.appendChild(btnTop);
    document.body.appendChild(aside);
}

~function () {
    appendAsideBar();

    var windowHeight = measure.windowHeight();

    var body = document.body;
    var container = getElementByClass(body, 'container')[0],
        aside = getElementByClass(body, 'aside')[0],
        btnTop = getElementByClass(aside, 'glyphicon-menu-up')[0];

    var setAsidePosition = function () {
        var bodyWidth = parseWidth(body);
        var elemWidth = parseWidth(container)
        if (elemWidth > 1000 && (bodyWidth - elemWidth > 300)) {
            var offsetX = (bodyWidth - elemWidth) / 2 - 65;
            aside.style.right = offsetX + 'px';
        } else {
            aside.style.right = '5%'
        }
    };

    setAsidePosition();

    window.onresize = setAsidePosition;


    if (typeof window.onscroll === 'function') {
        var temporary = window.onscroll;
    }
    window.onscroll = function () {
        temporary && temporary();
        if (measure.scrollTop() > windowHeight * 2) {
            addClass(aside, 'rise');
        } else {
            removeClass(aside, 'rise');
        }
    };

    btnTop.addEventListener('click', function () {
        measure.toTop();
        return false;
    }, false);
}();
