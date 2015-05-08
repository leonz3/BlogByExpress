
require('bootstrap/carousel.js');
require('../partial/header.js');
require('../partial/aside.js');

var loader = require('../plugin/rolloader.js');

var getUrl = function(){
    var pathname = window.location.pathname;
    if(pathname.indexOf('search') !== -1){
        return pathname + '/';
    }else{
        var category = pathname.match(/^\/([\w\d]+)/);
        if(category){
            $('.list-category li').eq(~~category[1] - 1).find('a').addClass('active');
        }
        return '/' + (category ? category[1] : 'all') + '/';
    }
};

~function () {

    var url = getUrl();

    loader.run('rolloader', function (loader) {
        loader.isEnd = true;
        $.ajax({
            url: url + (++loader.index),
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    var html = '';
                    for (var i = 0, len = data.length; i < len; i++) {
                        var item = data[i];
                        html += ('<div class="media"><div class="media-left"><a href="/u' + item['UserId'] + '">'
                        + '<img class="media-object" src="' + item['Portrait'] + '" width="60" height="60">'
                        + '<span>' + item['NickName'] + '</span></a></div><div class="media-body">'
                        + '<a class="media-heading" href="/a' + item['ArticleId'] + '">' + item['Title'] + '</a>'
                        + '<p>' + item['Intro'] + '...</p></div></div><hr/>');
                    }
                    $('.list-articles').append($(html));
                    loader.isEnd = false;
                }
                if(data.length < 10){
                    loader.setText('没有更多文章...').setClass('is-end');
                    loader.isEnd = true;
                }
            }
        });
    });

    $('.btn-publish').on('click',function(){
        if($('.user').length > 0){
            window.location.href = '/article/edit';
        }else{
            $('#sign').modal('show').find('.text-danger').html('请先进行登录！').removeClass('hide');
        }
    });
}();

