
require('../partial/header.js');
require('../partial/aside.js');

var userHandler = require('../partial/user.js');
var loader = require('../plugin/rolloader.js');

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

~function () {
    userHandler.newMood();
    userHandler.rmArticle();

    var isSelf =$('.btn-delete-article').length > 0 ? true : false;
    var url = window.location.href + '/';
    loader.run('rolloader', function (loader) {
        loader.isEnd = true;
        $.ajax({
            url:  url + (++loader.index),
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    var html = '';
                    for (var i = 0, len = data.length; i < len; i++) {
                        var item = data[i];
                        html += '<div class="media"><div class="media-body">'
                        + '<small class="pull-right">' + formatDate(item['PublishTime']) + '</small>'
                        + '<a class="media-heading" href="/a' + item['ArticleId'] + '">' + item['Title'] + '</a> ';
                        if(isSelf){
                            html += '<a href="/a' + item['ArticleId'] + '/edit" class="btn-edit-article small hide text-warning" >编辑</a> '
                            + '<a href="javascript:void(0);" class="btn-delete-article small hide text-danger" data-id="' + item['ArticleId'] + '">删除</a>'
                        }
                        html += '<p>' + item['Intro'] + '</p> </div> <hr/> </div>';
                    }
                    $('#rolloader').before($(html));
                    loader.isEnd = false;
                }
                if(data.length < 10){
                    loader.setText('没有更多文章...').setClass('is-end');
                    loader.isEnd = true;
                }
            }
        });
    });
}();


