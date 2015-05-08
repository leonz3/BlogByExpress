
require('../partial/header.js');
require('../partial/aside.js');

var loader = require('../plugin/rolloader.js');
var userHandler = require('../partial/user.js');

~function(){
    userHandler.newMood();
    userHandler.downCollect();

    var url = location.pathname;

    loader.run('rolloader', function(loader){
        loader.isEnd = true;
        $.ajax({
            url: url + '/' + (++loader.index),
            dataType: 'json',
            success: function(result){
                if(result.length > 0){
                    var html = '';
                    for(var i = 0, len = result.length; i < len; i ++){
                        var item = result[i];
                        html += '<li>'
                        + '<a href="/a' + item['ArticleId'] + '" >' + item['Title'] + '</a> '
                        + '<a href="javascript:;" class="btn-delete-collect hide small text-danger" data-id="' + item['ArticleId'] + '">取消收藏</a>'
                        + '</li>'
                    }
                    $('.list-collections').append($(html));
                    loader.isEnd = false;
                }
                if(result.length < 20){
                    loader.setText('没有更多收藏...').setClass('is-end');
                    loader.isEnd = true;
                }
            }
        });
    });
}();
