var Article = require('../models/article');
var User = require('../models/user');

exports.auto = function (req, res, next) {
    var username = req.cookies.username || '';
    if (username && !req.session.user) {
        User.fetch(username, function (result) {
            if (result.length > 0) {
                req.session.user = new User(result[0]);
            }
        });
    }
    next();
}

exports.index = function (req, res,next) {
    var _cid = req.params.CategoryId || '';
    if (_cid && isNaN(parseInt(_cid))) {
        next();
    } else {
        Article.fetchsByCategory(_cid, 1, function (result) {
            res.render('home/index', {
                user: req.session.user,
                articles: result
            });
        });
    }
}

exports.about = function (req, res) {
    res.render('home/index',{
        user:req.session.user
    });
}
