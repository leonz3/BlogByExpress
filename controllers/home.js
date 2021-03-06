var Article = require('../models/article');
var moment = require('moment');
var co = require('co');

/**
 * 主页视图，及分页获取
 */
exports.index = function (req, res, next) {
    var cid = req.params.category || '';
    if (cid && cid !== 'all' && isNaN(cid)) {
        next();
    } else {
        var index = req.params.index;
        if (index) {
            if(cid === 'all'){
                cid = '';
            }
            Article.fetchsByCategory(cid, index).then(function (result) {
                result.length > 0 ? res.json(result) : res.json([]);
            });
        } else {
            var days = moment().subtract(100, 'days').format();
            co(function* () {
                var articles = yield Article.fetchsByCategory(cid, 1);
                var topList = yield Article.getTopList(days);
                res.render('home/index', {
                    title: 'Fade2Coding',
                    self: req.session.self,
                    articles: articles,
                    topList: topList
                });
            });
        }
    }
};

/**
 * about视图
 */
exports.about = function (req, res) {
    res.render('home/index', {
        self: req.session.self
    });
};

/**
 * 搜索
 */
exports.search = function (req, res) {
    var key = req.params.keyword;
    var index = req.params.index;
    if (index) {
        Article.fetchsByKey(key, index).then(function (result) {
            result.length > 0 ? res.json(result) : res.json([]);
        });
    } else {
        var days = moment().subtract(100, 'days').format();
        co(function*() {
            var articles = yield Article.fetchsByKey(key);
            var topList = yield Article.getTopList(days);
            res.render('home/index', {
                title: key,
                self: req.session.self,
                articles: articles,
                topList: topList
            });
        });
    }
};

/**
 * 分页
 */
/*exports.page = function (req, res) {
    var category = req.params.category === 'all' ? '' : req.params.category;
    var index = req.params.index;
    Article.fetchsByCategory(category, index).then(function (result) {
        result.length > 0 ? res.json(result) : res.json([]);
    });
};*/

