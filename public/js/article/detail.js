
require('bootstrap/tooltip.js');
require('../partial/header.js');
require('../plugin/popup.js');
var simditorLite = require('../plugin/simditorlite.js');


var isSignIn = function(cb){
    if($('.user').length > 0){
        cb();
    }else{
        $('#sign').modal('show').find('.text-danger').html('请先进行登录！').removeClass('hide');
    }
};

var Article = {
    aid: '',
    uid: '',
    action: '',
    type: 'post',
    data: {},
    currNums: 0,
    isSuccess: false,
    run: function () {
        var _this = this;
        $('.btn-collect').bind('click', function () {
            isSignIn(function(){
                var $this = $(this);
                if ($this.hasClass('actived')) {
                    return false;
                }
                var $nums = $('.collection-nums');
                var _nums = parseInt($nums.html());
                _this.getId().collect().submit(function () {
                    $nums.html(_nums + 1);
                    $this.addClass('actived').attr({'title': '已收藏', 'data-original-title': '已收藏'});
                });
            }).call(this);
        });
        $('.btn-praise').bind('click', function () {
            isSignIn(function(){
                var $this = $(this);
                if ($this.hasClass('actived')) {
                    return false;
                }
                var $nums = $('.praise-nums');
                var _nums = parseInt($nums.html());
                _this.getId().praise().submit(function () {
                    $nums.html(_nums + 1);
                    $this.addClass('actived').attr({'title': '已点赞', 'data-original-title': '已点赞'});
                });
            }).call(this);
        });
        $('.btn-comment').bind('click', function () {
            isSignIn(function(){
                //var $comments = $('.commnet-nums');
                //var _nums = parseInt($comments.html());
                _this.getId().newComment().submit(function () {
                    //$comments.html(_nums + 1);
                    //_this.appendComment();
                    window.location.reload();
                });
            }).call(this);
        });

        $('.btn-delete-comment').on('click', function () {
            var cid = $(this).attr('data-id');
            $.popup({
                title: '提示',
                content: '确定删除该评论么？',
                size: 'sm',
                yep: {
                    txt: '确定',
                    callback: function () {
                        _this.getId().rmComment(cid).submit(function () {
                            window.location.reload();
                        });
                    }
                }
            }).show();
        });
    },
    getId: function () {
        this.aid = $('.article-title').attr('data-id').trim();
        this.uid = $('.user').attr('data-id').trim();
        return this;
    },
    praise: function () {
        this.action = '/article/praise';
        this.type = 'post';
        this.data = {aid: this.aid, uid: this.uid};
        return this;
    },
    collect: function () {
        this.action = '/article/collect';
        this.type = 'post';
        this.data = {aid: this.aid, uid: this.uid};
        return this;
    },
    newComment: function () {
        this.action = '/comment';
        this.type = 'post';
        this.data = {aid: this.aid, uid: this.uid, content: $('#txt_editor').val().trim()};
        return this;
    },
    rmComment: function (id) {
        this.action = '/comment';
        this.type = 'delete';
        this.data = {cid: id, uid: this.uid};
        return this;
    },
    submit: function (callback) {
        var _this = this;
        $.ajax({
            url: _this.action,
            data: _this.data,
            type: _this.type,
            success: function (data) {
                if (data === 'success') {
                    callback();
                }
            }
        });
    },
    appendComment: function () {
        //var sportrait = $('.user img').attr('src');
        //var sname = $('.user a').html().trim()
        //var shtml = '<li class="media"><div class="media-left"><a href="/u' + this.uid + '">'
        //            + '<img class="media-object" src="' + sportrait + '"></a></div>'
        //            + '<div class="media-body"><h4 class="media-heading">' +  sname + '</h4>'
        //            +  '<p>' + this.data.content + '</p></div></li>';
        //$('.list-comments').append($(shtml));
    }
};


~function () {

    $('.article-btns>div').tooltip();

    Article.run();

}();