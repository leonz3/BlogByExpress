
require('../partial/header.js');

var userHandler = require('../partial/user.js');
var loader = require('../plugin/rolloader.js');

~function () {
    userHandler.newMood();
    userHandler.rmArticle();

    loader.run('rolloader', function (loader) {
        $.ajax({
            url: '/u1' + '/article/' + (++loader.index),
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    var html = '';
                    for (var i = 0, len = data.length; i < len; i++) {
                        var item = data[i];
                        html += ('<div class="media"><div class="media-body">'
                        + '<a class="media-heading" href="/a' + item['ArticleId'] + '">' + item['Title'] + '</a>'
                        + '<a href="javascript:void(0);" class="btn-delete-article small hide text-muted" data-id="' + item['ArticleId'] + '">删除</a>'
                        + '<p>' + item['Intro'] + '</p> </div> <hr/> </div>');
                    }
                    $('.list-articles').append($(html));
                } else {
                    console.log('there is no articles more');
                    loader.isEnd = true;
                }
            }
        });
    });
}();


