var $ = require('jquery');

var Login = {
    type: 1  //1=login,0=regist
    , link: '/login'
    , data: {}
    , redraw: function () {
        var _type = this.type;
        $('.modal-title').html((_type ? '欢迎登录' : '欢迎注册'));
        $('.btn-redraw').html((_type ? '我要注册' : '我要登录'));
        $('.btn-submit').html((_type ? '登录' : '注册并登录'));
        this.link = (_type ? '/login' : '/register');
        if (_type === 1) {
            $('.input-group.flag').removeClass('flag').addClass('hide');
            $('.checkbox').removeClass('hide');
        } else {
            $('.input-group.hide').removeClass('hide').addClass('flag');
            $('.checkbox').addClass('hide');
        }
    }
    , getData: function () {
        var _this = this;
        this.data = {
            name: function () {
                var _val = $('#txt_name').val().trim();
                if (_val) {
                    return _val;
                } else {
                    throw new Error('请输入用户名');
                }
            }(),
            email: function () {
                var _val = $('#txt_mail').val().trim();
                if (!_this.type) {
                    var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                    if (!_val || !reg.test(_val)) {
                        throw new Error('请输入正确邮箱');
                    } else {
                        return _val;
                    }

                }
            }(),
            password: function () {
                var _val = $('#txt_pwd').val().trim();
                if (!_val) {
                    throw new Error('请输入用户密码');
                }
                if (!_this.type) {
                    var _reVal = $('#txt_repwd').val().trim();
                    if (!_reVal) {
                        throw new Error('请再一次输入密码');
                    } else if (_val !== _reVal) {
                        throw new Error('两次密码不正确');
                    }
                }
                return _val;
            }(),
            save: function () {
                if (_this.type) {
                    return $('input[type="checkbox"]:checked').val() || 'unsave';
                }
            }()
        }
    }
    , submit: function () {
        var _this = this;
        $('.text-danger').addClass('hide');
        try {
            _this.getData();
        } catch (e) {
            $('.text-danger').html(e.message).removeClass('hide');
            return;
        }
        $.ajax({
            url: _this.link,
            type: 'post',
            data: _this.data,
            success: function (data) {
                if (data.status === 'success') {
                    window.location.reload();
                } else {
                    $('.text-danger').html(data.message).removeClass('hide');
                }
            }
        });
    }
};

module.exports = function () {
    $('.btn-redraw').on('click', function () {
        Login.type = Login.type == 1 ? 0 : 1;
        Login.redraw();
    });
    $('.btn-submit').on('click', function () {
        Login.submit();
    })
}();
