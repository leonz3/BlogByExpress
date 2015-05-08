require('../partial/header.js');
require('../partial/aside.js');

var userHandler = require('../partial/user.js');
var loader = require('../plugin/rolloader.js');

var numFixed2 = function (num) {
    return num.toString().length > 1 ? num : '0' + num;
};

var dateFormat = function (time) {
    var date = new Date(time);
    var ymd = time.substring(0, 10);
    var hms = [date.getHours(), date.getMinutes(), date.getSeconds()];
    for (var i = 0; i < 3; i++) {
        hms[i] = numFixed2(hms[i]);
    }
    return ymd + ' ' + hms.join(':');
};

var fetchMoods = function (index, cb) {
    var url = window.location.pathname + '/';
    $.ajax({
        url: url + index,
        dataType: 'json',
        success: function (data) {
            cb(data);
        }
    });
};

var recent2 = function () {
    var ymd = new Date().toLocaleDateString().split('/');
    ymd[1] = numFixed2(ymd[1]);
    ymd[2] = numFixed2(ymd[2]);
    var today = ymd.join('-');
    ymd[2] = numFixed2(~~ymd[2] - 1);
    return {
        today: today,
        yesterday: ymd.join('-')
    };
};

var generateList = function (list) {
    var store = {}
    var r2 = recent2();
    for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        var date = item['PublishTime'].substring(0, 10);
        if (date === r2.today) {
            var key = '今天';
        } else if (date === r2.yesterday) {
            var key = '昨天';
        } else {
            var key = date.substring(5).replace('-', '月') + '日';
        }
        if (!store[key]) {
            store[key] = [];
        }
        store[key].push(item);
    }
    return store;
};

var generateHtml = function(args){
    var data = generateList(args);
    var html = '';
    var currDay = $('.list-moods h3').last().html();
    for (var key in data) {
        if (currDay !== key) {
            html += '<h3 class="page-header">' + key + '</h3>';
        }
        var values = data[key];
        for (var i = 0, len = values.length; i < len; i++) {
            var value = values[i];
            html += '<li class="media">'
            + '<small class="pull-right">' + dateFormat(value['PublishTime']) + '</small>'
            + '<div class="media-body">' + value['Content'] + '</div>'
            + '</li>';
        }
    }
    $('.list-moods').append($(html));
};

~function () {

    userHandler.newMood();

    fetchMoods(1, function (result) {
        generateHtml(result);
    });

    loader.run('rolloader', function (loader) {
        loader.isEnd = true;
        fetchMoods(++loader.index, function(result){
            if(result.length > 0){
                generateHtml(result);
                loader.isEnd = false;
            }
            if(result.length < 20){
                loader.setText('没有更多心情...').setClass('is-end');
                loader.isEnd = true;
            }
        });
    });
}();


