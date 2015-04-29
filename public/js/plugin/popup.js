var $ = require('jquery');

var Modal = {
    root: '#popup_modal',
    wrap: '#popup_modal>.modal-dialog',
    header: '#popup_modal .modal-title',
    body: '#popup_modal .modal-body',
    buttons: '#popup_modal .modal-footer>.btn'
};

var defaults = {
    title: '',
    content: '',
    yep: {txt: '确定', callback: null},
    nope: {txt: '关闭', callback: null},
    type: 'alert',
    size: 'noraml'      //lg --> large   sm--> small
};

module.exports = function () {

    var $root = $(Modal.root),
        $wrap = $(Modal.wrap),
        $btn_nope = $(Modal.buttons).eq(0),
        $btn_yep = $(Modal.buttons).eq(1)

    $.extend({
        popup: function (opts) {
            var _modal = this;
            var settings = $.extend({}, defaults, opts);
            $(Modal.header).html(settings.title);
            $(Modal.body).html(settings.content);
            $btn_nope.html(settings.nope.txt);
            $btn_yep.html(settings.yep.txt);
            if (settings.nope.callback) {
                $btn_nope.bind('click', settings.nope.callback);
            } else {
                $btn_nope.unbind('click');
            }
            if (settings.yep.callback) {
                $btn_yep.bind('click', settings.yep.callback);
            } else {
                $btn_yep.unbind('click');
            }
            if ('alert' === settings.type) {
                $btn_yep.attr('data-dismiss', 'modal');
            } else {
                $btn_yep.removeAttr('data-dismiss');
            }
            if (settings.size) {
                $wrap.addClass('modal-' + settings.size);
            }
            $root.on('hidden.bs.modal', function () {
                $wrap.removeClass('modal-' + settings.size);
            });
            this.show = function () {
                $root.modal('show');
            };
            this.hide = function () {
                $root.modal('hide');
            }
            return this;
        }
    });
}();
