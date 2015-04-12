
var Article = require('../models/article');
var User = require('../models/user');
var moment = require('moment');

//通过指定天数内的排行榜
exports.getBordByDays = function(days,callback){
    var _days = moment().subtract(days, 'days').format();
    Article.getHitList(_days,function(hits){
        Article.getCommentList(_days,function(comments){
            callback(hits,comments);
        });
    });
};
