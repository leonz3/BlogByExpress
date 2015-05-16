require('../partial/header.js');
require('../plugin/popup.js');

var userHandler = require('../partial/user.js');

userHandler.newMood();

var UserId = $('.user').attr('data-id').trim();

var Config = {
    default: {},
    data: {},
    url: '',
    type: 'get',
    isValid: true,
    setDefault: function () {
        this.default = this.getPostData();
    },
    poster: function () {
        if (!this.isValid) {
            return false;
        }
        this.type = 'post';
        this.url = '/u' + UserId + '/config';
        this.data = this.getPostData();
        this.submit(function (result) {
            if (result === 'success') {
                Popup('信息更改成功');
            } else {
                Popup('信息更改失败，请刷新重试！');
            }
        })
    },
    getPostData: function () {
        var _default = this.default;
        return {
            id: UserId,
            portrait: function () {
                return $('.img-portrait').attr('src');
            }(),
            name: function () {
                return $('.txt-name').val() || _default.NickName;
            }(),
            email: function () {
                return $('.txt-email').val() || _default.Email;
            }(),
            gender: function () {
                return $('.txt-gender:checked').val();
            }(),
            location: function () {
                return $('.txt-location').val() || _default.location;
            }(),
            job: function () {
                return $('.txt-job').val() || _default.job;
            }()
        };
    },
    submit: function (callback) {
        var _this = this;
        $.ajax({
            url: _this.url,
            type: _this.type,
            data: _this.data,
            success: function (data) {
                callback(data);
            }
        });
    },
    checker: function (field, type) {
        var _this = this;
        if (type === 'mail') {
            var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (!reg.test(field)) {
                $('.form-group>p.text-danger').eq(1).html('* 请输入有效的邮箱地址').removeClass('hidden');
                _this.isValid = false;
                return;
            }
            var nindex = 1, message = '* 邮箱已被使用';
        } else {
            var nindex = 0, message = '* 昵称已被使用';
        }
        _this.type = 'get';
        _this.url = '/user/isExists';
        _this.data = {id: UserId, field: field, type: type};
        _this.submit(function (result) {
            if (result.exists === true && result.equals === false) {
                $('.form-group>p.text-danger').eq(nindex).html(message).removeClass('hidden');
                _this.isValid = false;
            } else {
                $('.form-group>p.text-danger').addClass('hidden');
                _this.isValid = true;
            }
        });
    }
};

var Password = {
    run: function(){
        var _this = this;
        _this.show(function(){
            try{
                _this.getData().submit(function(result){
                    if(result.error){
                        if(result.message = 'wrong'){
                            throw new Error('当前密码错误！')
                        }else{
                            throw new Error('密码修改失败！')
                        }
                    }else{
                        alert('更改成功，请退出重新登录');
                        $.popup().hide();
                    }
                });
            }catch(e){
                $('#popup_modal').find('p').html(e.message).removeClass('hide');
            }
        });
    },
    show: function (cb) {
        $.popup({
            title: '修改密码',
            content: '<div class="clearfix"><div class="form-horizontal col-sm-10 col-sm-offset-1">'
            + '<p class="text-danger text-center hide"></p>'
            + '<div class="form-group"><input type="password" class="form-control txt-org-pwd" placeholder="当前密码" /></div>'
            + '<div class="form-group"><input type="password" class="form-control txt-new-pwd" placeholder="新密码"/></div>'
            + '<div class="form-group"><input type="password" class="form-control txt-new-repwd" placeholder="确认密码"/></div>'
            + '</div></div>',
            type: 'prompt',
            yep: {
                txt: '确定修改',
                callback: cb
            }
        }).show();
    },
    getData: function(){
        var url = window.location.pathname;
        this.url = url.replace('config', 'password');
        this.data =  {
            orgPwd: function(){
                var val = $('.txt-org-pwd').val().trim();
                if(!val){
                    throw new Error('请填写当前密码！');
                }
                return val;
            }(),
            newPwd: function(){
                var val = $('.txt-new-pwd').val().trim();
                var reVal = $('.txt-new-repwd').val().trim();
                if(!val){
                    throw new Error('请填写新密码！');
                }else if(!reVal){
                    throw new Error('请确认新密码！');
                }else if(val !== reVal){
                    throw new Error('确认密码不一致');
                }
                return val;
            }()
        };
        return this;
    },
    submit: function (cb) {
        var _this = this;
        $.ajax({
            url: _this.url,
            data: _this.data,
            type: 'post',
            success: function (result) {
                cb(result);
            }
        })
    }
}

var Popup = function (msg) {
    $.popup({
        title: '提示',
        content: msg,
        size: 'sm'
    }).show();
}

var Upload = function () {
    var formdata = new FormData();
    formdata.append('img', this.files[0]);
    $.ajax({
        url: '/imgUpload',
        data: formdata,
        type: 'post',
        processData: false,
        contentType: false,
        success: function (result) {
            if (result.success === true) {
                $('.img-portrait').attr('src', result.file_path);
            } else {
                Popup('上传失败，请刷新后重试！');
            }
        }
    });
};


~function () {

    Config.setDefault();

    $('.txt-name, .txt-email').on('blur', function () {
        var $this = $(this);
        var sname = $this.val().trim();
        var stype = $this.hasClass('txt-name') ? 'name' : 'mail';
        Config.checker(sname, stype);
    });

    $('#btn_save').on('click', function () {
        Config.poster();
    });

    $('.btn-upload').on('click', function () {
        $('.btn-file').trigger('click');
    });

    $('.btn-file').on('change', function () {
        Upload.call(this);
    });

    $('.btn-edit-password').on('click', function(){
        Password.run();
    });
}();