
var Article = require('../models/article');
var moment = require('moment');

exports.index = function (req, res,next) {
    var _cid = req.params.CategoryId || '';
    if (_cid && isNaN(parseInt(_cid))) {
        next();
    } else {
        var _date = moment().subtract(7, 'days').format();
        Article.fetchsByCategory(_cid, 1, function (result1) {
            Article.getScanbord(_date,function(result2){
                res.render('home/index', {
                    self: req.session.self,
                    articles: result1,
                    scanbord:result2
                });
            });
        });
    }
}

exports.about = function (req, res) {
    res.render('home/index',{
        self:req.session.self
    });
}

exports.search = function(req,res){
    var _key = req.params.key;
    var _date = moment().subtract(7, 'days').format();
    Article.fetchsByKey(_key,function(result1){
        Article.getScanbord(_date,function(result2){
            res.render('home/index',{
                self:req.session.self,
                articles:result1,
                scanbord:result2
            })

        })
    });
}
