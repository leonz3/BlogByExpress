var Article = require('../models/article');
var moment = require('moment');
var co = require('co');

exports.index = function (req, res, next) {
    var cid = req.params.CategoryId || '';
    if (cid && isNaN(cid)) {
        next();
    } else {
        var days = moment().subtract(100, 'days').format();
        co(function* () {
            var articles = yield Article.fetchsByCategory(cid, 1);
            var topList = yield Article.getTopList(days);
            res.render('home/index', {
                self: req.session.self,
                articles: articles,
                topList: topList
            });
        });
    }
};

exports.about = function (req, res) {
    res.render('home/index', {
        self: req.session.self
    });
};

exports.search = function (req, res) {
    var key = req.params.key;
    var days = moment().subtract(100, 'days').format();
    co(function*() {
        var articles = yield Article.fetchsByKey(key);
        var topList = yield Article.getTopList(days);
        res.render('home/index', {
            self: req.session.self,
            articles: articles,
            topList: topList
        });
    });
};

exports.page = function (req, res) {
    var category = req.params.category === 'all' ? '' : req.params.category;
    var index = req.params.index;
    co(function*() {
        var articles = yield Article.fetchsByCategory(category, index);
        articles.length > 0
            ? res.json(articles)
            : res.json([]);
    });
};

