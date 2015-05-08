require('../partial/header.js');
require('../plugin/popup.js');
var simditor = require('../plugin/simditor.js');

var $slc = $('#slc_cid');

var Article = {
    store: {},
    getData: function () {
        this.store = {
            uid: function () {
                var _val = $('#txt_uid').val().trim();
                if (_val) {
                    return _val;
                } else {
                    throw  new Error('no user');
                }
            }(),
            aid: function () {
                return $('#txt_aid').val().trim();
            }(),
            cid: function () {
                return $slc.val();
            }(),
            source: function () {
                return $(':radio:checked').val();
            }(),
            title: function () {
                var _val = $('#txt_title').val().trim();
                if (!_val) {
                    throw new Error('请填写文章标题！');
                } else {
                    return _val;
                }
            }(),
            content: function () {
                var _val = $('#txt_editor').val().trim();
                if (!_val) {
                    throw new Error('请填写文章内容！');
                } else {
                    return _val;
                }
            }(),
            intro: function () {
                return $('.simditor-body').text().trim().substring(0, 100);
            }()
        }
    },
    submit: function (callback) {
        var _this = this;
        try {
            _this.getData();
        } catch (e) {
            if (e.message === 'no user') {
                $('#sign').modal('show').find('.text-danger').html('请先进行登录！').removeClass('hide');
            } else {
                $('.txt-help').html(e.message).removeClass('hide');
            }
            return;
        }
        $.ajax({
            url: '/article/save',
            type: 'post',
            data: _this.store,
            success: function (data) {
                if (data.status === 'success') {
                    window.location.href = '/a' + data.id;
                }
            }
        });
    }
};

~function () {
    var cid = $slc.attr('data-category');
    if (cid) {
        $slc.val(cid);
    }
    var source = $('#chk_source').attr('data-source');
    $(':radio').each(function () {
        if (this.value == source) {
            this.checked = true;
        }
    });
    $('#btn_save').on('click', function () {
        Article.submit();
    });
}();
