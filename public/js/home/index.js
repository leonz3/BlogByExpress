
require('bootstrap/carousel.js');
require('../partial/header.js');

var loader = require('../plugin/rolloader.js');

~function () {

    loader.run('rolloader', function (loader) {
        $.ajax({
            url: '/page/all/' + (++loader.index),
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    var html = '';
                    for (var i = 0, len = data.length; i < len; i++) {
                        var item = data[i];
                        html += ('<div class="media"><div class="media-left"><a href="/u' + item['UserId'] + '">'
                        + '<img class="media-object" src="' + item['Portrait'] + '" width="60" height="60">'
                        + '<span>' + item['NickName'] + '</span></a></div><div class="media-body">'
                        + '<a class="media-heading" href="/article/' + item['ArticleId'] + '">' + item['Title'] + '</a>'
                        + '<p>' + item['Intro'] + '...</p></div></div><hr/>');
                    }
                    $('.list-articles').append($(html));
                } else {
                    console.log('there is no articles more');
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
