
var Article = require('../models/article');
var Comment = require('../models/comment');
var homeController = require('./home');

//详细页视图
exports.detail = function (req, res) {
    var _id = req.params.id;
    Article.fetch(_id, function (result1) {
        Comment.fetchsByRootId(_id,function(result2){
            homeController.getBordByDays(7,function(result3,result4){
                if (result1.length > 0) {
                    res.render('article/detail',{
                        self:req.session.self,
                        article:result1[0],
                        comments:result2,
                        hitList:result3,
                        commentList:result4
                    });
                }else{
                    return res.redirect('/');
                }
            })
        });
    });
}

//发布页视图
exports.edit = function (req, res) {
    var _id = req.params.id || '';
    var article = null;
    if (_id) {
        Article.fetch(_id, function (result) {
            if (result.length > 0) {
                res.render('article/edit', {
                    self: req.session.self,
                    article: result[0]
                })
            }
        });
    } else {
        res.render('article/edit', {
            self: req.session.self
        });
    }
}

//文章发布
exports.save = function (req, res) {
    var article = new Article({
        ArticleId:req.body.aid,
        Title: req.body.title,
        Content: req.body.content,
        Intro:req.body.intro,
        UserId: req.body.uid,
        CategoryId: req.body.cid,
        Source:req.body.source,
        PublishTime: new Date()
    });
    article.save(function (result) {
        if (result.affectedRows > 0) {
            res.send({status:'success',insertId:result.insertId});
        } else {
            res.send({status:'error'});
        }
    });
}

//文章删除
exports.delete = function(req,res){
    Article.delete(req.body.aid,req.body.uid,function(result){
        if(result.affectedRows>0){
            res.send('success');
        }
    });
}

//文章收藏
exports.upCollection = function(req,res){
    Article.upCollection(req.body.desc,req.body.uid,req.body.aid,function(result){
        if(result.affectedRows > 0){
            res.send('success');
        }
    });
}

//删除收藏
exports.downCollection = function(req,res){
    Article.downCollection(req.body.uid,req.body.aid,function(result){
        if(result.affectedRows >0){
            res.send('success');
        }
    });
}

//文章点赞
exports.upPraise = function(req,res){
    Article.upPraise(req.body.uid,req.body.aid,function(result){
        if(result.affectedRows > 0){
            res.send('success');
        }
    });
}