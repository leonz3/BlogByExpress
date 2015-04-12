
var Article = require('../models/article');
var Service = require('../services/service');

exports.index = function (req, res,next) {
    var _cid = req.params.CategoryId || '';
    if (_cid && isNaN(parseInt(_cid))) {
        next();
    } else {
        Article.fetchsByCategory(_cid, 1, function (articles) {
            Service.getBordByDays(30, function (hitList,commentList) {
                res.render('home/index', {
                    self: req.session.self,
                    articles: articles,
                    hitList:hitList,
                    commentList:commentList
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
        Service.getBordByDays(7,function(result2,result3){
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

