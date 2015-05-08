require('bootstrap/tooltip.js');
require('../partial/header.js');
require('../partial/aside.js');
require('../plugin/popup.js');
var simditorLite = require('../plugin/simditorlite.js');


var isSignIn = function (cb) {
    if ($('.user').length > 0) {
        cb();
    } else {
        $('#sign').modal('show').find('.text-danger').html('请先进行登录！').removeClass('hide');
    }
};

var formatDate = function(time){
    var date = new Date(time);
    var ymd = time.substring(0,10);
    var hms = [date.getHours(), date.getMinutes(), date.getSeconds()];
    for(var i = 0; i < 3; i ++){
        var item = hms[i].toString();
        hms[i] = item.length > 1? item: '0' + item;
    }
    return ymd + ' ' + hms.join(':');
};

var Article = {
    aid: '',
    uid: '',
    action: '',
    type: 'post',
    data: {},
    currNums: 0,
    currCommentIndex: 1,
    hasComment: true,
    isSuccess: false,
    run: function () {
        var _this = this;

        if($('.list-comments li').length === 0){
            $('#rolloader').html('暂无评论...');
            _this.hasComment = false;
        }

        $('.btn-collect').bind('click', function () {
            var $this = $(this);
            isSignIn(function () {
                //if ($this.hasClass('disabled')) {
                //    return false;
                //}
                var $nums = $('.collection-nums');
                var _nums = parseInt($nums.html());
                _this.getId().collect().submit(function (result) {
                    if (result === 'success') {
                        $nums.html(_nums + 1);
                        $this.addClass('disabled').attr({'title': '已收藏', 'data-original-title': '已收藏'});
                    }
                });
            });
        });

        $('.btn-praise').bind('click', function () {
            var $this = $(this);
            isSignIn(function () {
                //if ($this.hasClass('disabled')) {
                //    return false;
                //}
                var $nums = $('.praise-nums');
                var _nums = parseInt($nums.html());
                _this.getId().praise().submit(function (result) {
                    if (result === 'success') {
                        $nums.html(_nums + 1);
                        $this.addClass('disabled').attr({'title': '已点赞', 'data-original-title': '已点赞'});
                    }
                });
            });
        });

        $('.btn-comment').bind('click', function () {
            isSignIn(function () {
                //var $comments = $('.commnet-nums');
                //var _nums = parseInt($comments.html());
                _this.getId().newComment().submit(function (result) {
                    if (result === 'success') {
                        //$comments.html(_nums + 1);
                        //_this.appendComment();
                        window.location.reload();
                    }
                });
            }).call(this);
        });

        $('.list-comments').on('click', '.btn-delete-comment', function () {
            var cid = $(this).attr('data-id');
            $.popup({
                title: '提示',
                content: '确定删除该评论么？',
                size: 'sm',
                yep: {
                    txt: '确定',
                    callback: function () {
                        _this.getId().rmComment(cid).submit(function (result) {
                            if (result === 'success') {
                                window.location.reload();
                            }
                        });
                    }
                }
            }).show();
        });

        $('#rolloader').on('click', function () {
            if (!_this.hasComment) return false;
            var $this = $(this);
            _this.getId().getComment().submit(function (result) {
                if (result.length > 0) {
                    _this.appendComment(result);
                }
                if(result.length < 10){
                    $this.html('没有更多评论');
                    _this.hasComment = false;
                }
            });
        });
    },
    getId: function () {
        this.aid = $('.article-title').attr('data-id').trim();
        this.uid = $('.user').length > 0 ? $('.user').attr('data-id').trim() : '';
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
    getComment: function () {
        this.action = '/comment/' + this.aid + '/' + (++this.currCommentIndex);
        this.type = 'get';
        return this;
    },
    submit: function (callback) {
        var _this = this;
        $.ajax({
            url: _this.action,
            data: _this.data,
            type: _this.type,
            success: function (data) {
                callback(data);
            }
        });
    },
    appendComment: function (data) {
        var html = '';
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            html += '<li class="media">'
            + '<div class="media-left">'
            + '<a href="/u' + item['UserId'] + '">'
            + '<img class="media-object" src="' + item['Portrait'] + '"></a></div>'
            + '<div class="media-body">'
            + '<span class="pull-right">' + formatDate(item['PublishTime']) + '</span>'
            + '<h4 class="media-heading">' + item['NickName'] + '</h4>'
            + '<a href="javascript:void(0);" class="pull-right hide btn-delete-comment" data-id="' + item['CommentId'] + '">删除该评论</a>'
            + '<p>' + item['Content'] + '</p></div></li>';
        }
        $('.list-comments').append($(html));
    }
};


~function () {

    $('.article-btns>div').tooltip();

    Article.run();

    $('.btn-publish').on('click', function () {
        if ($('.user').length > 0) {
            window.location.href = '/article/edit';
        } else {
            $('#sign').modal('show').find('.text-danger').html('请先进行登录！').removeClass('hide');
        }
    });
}();