
var Article = require('../models/article');
var Comment = require('../models/comment');
var Service = require('../services/service');

//详细页视图
exports.detail = function (req, res) {
    var _id = req.params.id;
    var user = req.session.self;
    Article.fetch(_id, function (result1) {
        if (result1.length > 0) {
            var article = new Article(result1[0]);
            console.log(article.isCollectedByUser(user.UserId));
            article.getPraiseNums(function(pnums){
                article.getCollectNums(function(cnums){
                    Comment.fetchsByRootId(_id,function(comments){
                        Service.getBordByDays(7,function(hitList,commentList){
                            res.render('article/detail',{
                                self:req.session.self,
                                article:result1[0],
                                comments:comments,
                                hitList:hitList,
                                commentList:commentList,
                                PraiseNums:pnums[0],
                                CollectNums:cnums[0],
                                //isCollected:article.isCollectedByUser(uid),
                                //isPraised:article.isPraisedByUser(uid)
                            });
                        });
                    });
                })
            });
        }else{
            return res.redirect('/');
        }
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
};

//添加评论
exports.upComment = function(req,res){
    var comment = new Comment({
        Content:req.body.content,
        UserId:req.body.uid,
        RootId:req.body.aid
    });
    console.log(comment);
    comment.save(function(result){
        if(result.affectedRows > 0){
            res.send('success');
        }
    });
}

//删除评论
exports.downComment = function(req,res){
    Comment.delete(req.body.aid,req.body.uid,function(result){
        if(result.affectedRows > 0){
            res.send('success');
        }
    });
};