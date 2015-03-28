
var Article = require('../models/article');
var moment = require('moment');

exports.index = function (req, res,next) {
    var _cid = req.params.CategoryId || '';
    if (_cid && isNaN(parseInt(_cid))) {
        next();
    } else {
        console.log(req.session.self)
        Article.fetchsByCategory(_cid, 1, function (result1) {
            getBordByDays(7, function (result2,result3) {
                res.render('home/index', {
                    self: req.session.self,
                    articles: result1,
                    hitList:result2,
                    commentList:result3
                });
            });
        });
    }
};

exports.about = function (req, res) {
    res.render('home/index',{
        self:req.session.self
    });
};

exports.search = function(req,res){
    var _key = req.params.key;
    Article.fetchsByKey(_key,function(result1){
        getBordByDays(7,function(result2,result3){
            res.render('home/index',{
                self:req.session.self,
                articles:result1,
                hitList:result2,
                commentList:result3
            });

        });
    });
};

exports.page = function(req,res){
    var category = req.params.category === 'all'?'':req.params.category;
    var index = req.params.index;
    Article.fetchsByCategory(category,index,function(result){
       if(result.length > 0){
           res.json(result)
       } else{
           res.json([]);
       }
    });
}

var getBordByDays = exports.getBordByDays = function(days,callback){
    var _days = moment().subtract(days, 'days').format();
    Article.getHitList(_days,function(hits){
       Article.getCommentList(_days,function(comments){
            callback(hits,comments);
       });
    });
};
