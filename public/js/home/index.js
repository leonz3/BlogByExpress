var $ = require('jquery');
var loader = require('../plugin/rolloader.js');

(function () {
    $(document).bind('keyup', function (event) {
        if (event.keyCode === 13) {
            if ($('.txt-key:focus').length > 0) {
                $('.btn-search').trigger('click');
            }
            if ($('#login .form-control').filter(':focus').length > 0) {
                $('.btn-submit').trigger('click');
            }
        }
    });
    $('.btn-search').bind('click', function () {
        var _key = $('.txt-key').val().trim();
        console.log(_key);
        if (!_key) return;
        window.location.href = '/search/' + _key;
    });

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
})();
