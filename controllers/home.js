
var Article = require('../models/article');

exports.index = function (req, res,next) {
    var _cid = req.params.CategoryId || '';
    if (_cid && isNaN(parseInt(_cid))) {
        next();
    } else {
        Article.fetchsByCategory(_cid, 1, function (result) {
            res.render('home/index', {
                self: req.session.self,
                articles: result
            });
        });
    }
}

exports.about = function (req, res) {
    res.render('home/index',{
        self:req.session.self
    });
}
