var Article = require('../models/article');
var Comment = require('../models/comment');
var moment = require('moment');
var co = require('co');

/**
 * 详细页视图
 */
exports.detail = function (req, res) {
    var id = req.params.id;
    var user = req.session.self;
    var days = moment().subtract(100, 'days').format();
    co(function*() {
        var article = new Article((yield Article.fetchById(id))[0]);
        var statistics = yield article.getStatistics();
        var comments = yield Comment.fetchsByRootId(id);
        //var userHandler = yield article.isOperateByUser();
        var topList = yield Article.getTopList(days);
        if (user) {
            var uid = user.UserId;
            var userHandler = yield article.isOperateByUser(uid);
            var isAuthor = uid == article.UserId ? true : false;
        } else {
            var isAuthor = false;
        }
        article.scanned();
        res.render('article/detail', {
            title: article.Title,
            self: user,
            article: article,
            comments: comments,
            statist: statistics,
            topList: topList,
            userHandler: userHandler,
            isAuthor: isAuthor
        });
    });
};

/**
 * 发布页视图
 */
exports.edit = function (req, res) {
    var id = req.params.id || '';
    var article = null;
    if (/^\d+$/g.test(id)) {
        Article.fetchById(id).then(function (result) {
            var article = new Article(result[0]);
            if (result.length > 0) {
                res.render('article/edit', {
                    title: article.Title,
                    self: req.session.self,
                    article: article
                })
            }
        });
    } else {
        res.render('article/edit', {
            title: '发表新文章',
            self: req.session.self
        });
    }
};

/**
 * 文章发布
 */
exports.save = function (req, res) {
    var article = new Article({
        ArticleId: req.body.aid,
        Title: req.body.title,
        Content: req.body.content,
        Intro: req.body.intro,
        UserId: req.body.uid,
        CategoryId: req.body.cid,
        Source: req.body.source,
        PublishTime: new Date()
    });
    article.save().then(function (result) {
        if (result.affectedRows > 0) {
            res.json({status: 'success', id: (article.ArticleId ? article.ArticleId : result.insertId)});
        } else {
            res.json({status: 'error'});
        }
    });
};

/**
 * 文章删除
 */
exports.delete = function (req, res) {
    Article.delete(req.params.id, req.body.uid).then(function (result) {
        if (result.affectedRows > 0) {
            res.send('success');
        }
    });
};

/**
 * 文章收藏
 */
exports.upCollection = function (req, res) {
    Article.upCollection(req.body.uid, req.body.aid).then(function (result) {
        if (result.affectedRows > 0) {
            res.send('success');
        }
    });
};

/**
 * 删除收藏
 */
exports.downCollection = function (req, res) {
    Article.downCollection(req.body.uid, req.body.aid).then(function (result) {
        if (result.affectedRows > 0) {
            res.send('success');
        }
    });
};

/**
 * 文章点赞
 */
exports.upPraise = function (req, res) {
    Article.upPraise(req.body.uid, req.body.aid).then(function (result) {
        if (result.affectedRows > 0) {
            res.send('success');
        }
    });
};

/**
 * 添加评论
 */
exports.upComment = function (req, res) {
    var comment = new Comment({
        Content: req.body.content,
        UserId: req.body.uid,
        RootId: req.body.aid
    });
    comment.save().then(function (result) {
        if (result.affectedRows > 0) {
            res.send('success');
        }
    });
};

/**
 * 删除评论
 */
exports.downComment = function (req, res) {
    Comment.delete(req.body.cid, req.body.uid).then(function (result) {
        if (result.affectedRows > 0) {
            res.send('success');
        }
    });
};

/**
 * 分页获取评论
 */
exports.getComment = function (req, res) {
    Comment.fetchsByRootId(req.params.aid, req.params.index).then(function (result) {
        result.length > 0 ? res.json(result) : res.json([]);
    });
};