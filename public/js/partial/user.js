
require('../plugin/popup.js');

var userId = function () {
    try{
        return $('.user').attr('data-id').trim()
    }catch(e){
        return '';
    }
}();

var currMood = function () {
    try{
        return $('.txt-mood').val().trim();
    }catch(e){
        return '';
    }
}();

var rmHandler = function (args) {
    $.popup({
        title: '提示',
        content: args.msg,
        size: 'sm',
        yep: {
            txt: '确定',
            callback: function () {
                $.ajax({
                    url: args.url,
                    data: args.data,
                    type: 'delete',
                    success: function (result) {
                        args.cb(result);
                    }
                });
            }
        }
    }).show();
};

var Mood = {
    getData: function () {
        try {
            return {
                uid: userId,
                content: function () {
                    var mood = $('.txt-mood').val().trim();
                    if (mood == currMood) {
                        throw new Error('repeat');
                    } else {
                        return mood;
                    }
                }()
            }
        } catch (e) {
            return false;
        }
    },
    submit: function () {
        var data = this.getData();
        if (data) {
            $.ajax({
                url: '/mood',
                type: 'post',
                data: data,
                success: function () {
                    window.location.reload();
                }
            });
        }
    }
};

var downArticle = function (aid, uid, $root) {
    rmHandler({
        msg: '您确定要删除文章么？',
        url: '/a' + aid,
        data: {uid: uid},
        cb: function (result) {
            if (result === 'success') {
                $.popup().hide();
                $root.remove();
            }
        }
    });
};

var downCollection = function (aid, uid, $root) {
    rmHandler({
        msg: '您确定取消收藏文章么？',
        url: '/aricle/collect',
        data: {aid: aid, uid: uid},
        cb: function (result) {
            if (result === 'success') {
                $.popup().hide();
                $root.remove();
            }
        }
    });
};


exports.rmArticle = function(){
    $('.list-articles').on('click', '.btn-delete-article', function () {
        var aid = $(this).attr('data-id');
        downArticle(aid, userId, $(this).parents('.media'));
    });
};

exports.downCollect = function(){
    $('.list-collections').on('click', '.btn-delete-collect', function () {
        var aid = $(this).attr('data-id');
        downCollection(aid, userId, $(this).parents('li'));
    });
};

exports.newMood = function() {
    $('.btn-save-mood').on('click', function(){
        Mood.submit();
    });

    $('.txt-mood').on('click', function (e) {
        $(this).addClass('actived');
        e.stopPropagation();
    });

    $(document).on('click', function () {
        $('.txt-mood').removeClass('actived');
    });
};