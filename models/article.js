var db = require('../config/database');

var Article = function (article) {
    this.Title = article.Title;
    this.Content = article.Content;
    this.UserId = article.UserId;
    this.ArticleId = article.ArticleId || null;
    this.PublishTime = article.PublishTime || new Date();
    this.ScanTimes = article.ScanTimes || 0;
    this.CategoryId = article.CategoryId;
    this.Intro = article.Intro;
    this.Source = article.Source;
}

//通过文章ID获取单篇文章
Article.fetch = function (id, callback) {
    db.execute({
        sql: 'select a.ArticleId,a.Title,a.PublishTime,a.ScanTimes,a.Content,a.Intro,a.Source,a.UserId,a.CategoryId,c.Comments from articles a left join (select RootId As ArticleId,COUNT(RootId) AS Comments from comments group by RootId) c on a.ArticleId=c.ArticleId where a.ArticleId=?',
        values: [id],
        handler: function (result) {
            callback(result);
        }
    });
}

//通过用户ID分页获取用户下无分类文章
Article.fetchsByUser = function (uid, index, callback) {
    var _sql = 'select a.ArticleId,a.Title,a.PublishTime,a.Intro,u.UserId from articles a left join users u on a.userId=u.UserId where u.userid=? limit ?,?';
    var start = (~~index - 1) * 10;
    db.execute({
        sql:_sql,
        values:[uid,start,start+10],
        handler:function(result){
            callback(result);
        }
    })

}

//分类分页获取所有用户文章
Article.fetchsByCategory = function (cid, index, callback) {
    var _sql = 'select a.ArticleId,a.Title,a.Intro,a.CategoryId,u.UserId,u.Portrait,u.NickName from articles a left join users u on a.UserId = u.UserId order by a.PublishTime desc'
    var start = ~~index === 1 ? 0 : 20 + (index - 2) * 10;
    var end = ~~index === 1 ? start + 20 : start + 10;
    if (cid) {
        _sql += ' where CategoryId=?';
        var _vals = [cid, start, end];
    } else {
        var _vals = [start, end];
    }
    _sql += ' limit ?,?';
    db.execute({
        sql: _sql,
        values: _vals,
        handler: function (result) {
            callback(result);
        }
    });
}

//关键字搜索
Article.fetchsByKey = function(key, callback){
    db.execute({
        sql:'select a.ArticleId,a.Title,a.Intro,a.CategoryId,u.UserId,u.Portrait,u.NickName from articles a left join users u on a.UserId=u.UserId where a.Title like "%' + key + '%" or a.Intro like "%' + key + '%"',
        handler:function(result){
            callback(result);
        }
    })
}

//新增，修改文章
Article.prototype.save = function (callback) {
    if(this.ArticleId){
        var _sql = 'update articles set title=?,content=?,scantimes=?,categoryid=?,intro=?,source=? where articleid=? and userid=?';
        var _val = [this.Title, this.Content, this.ScanTimes, this.CategoryId, this.Intro,this.Source,this.ArticleId, this.UserId];
    }else{
        var _sql = 'insert into articles(title,content,publishtime,scantimes,categoryid,userid,intro,source) values(?,?,?,?,?,?,?,?)';
        var _val = [this.Title, this.Content, this.PublishTime, this.ScanTimes, this.CategoryId, this.UserId, this.Intro,this.Source];
    }
    db.execute({
        sql: _sql,
        values: _val,
        handler: function (result) {
            callback(result);
        }
    })
};

//删除文章
Article.delete = function(aid,uid,callback){
    db.execute({
        sql:'delete from articles where ArticleId=? And UserId=?',
        values:[aid,uid],
        handler:function(result){
            callback(result);
        }
    })
}

//收藏文章
Article.upCollection = function(desc,uid,aid,callback){
    db.execute({
        sql:'insert into user_article_collections values(?,?,?)',
        values:[desc,uid,aid],
        handler:function(result){
            callback(result);
        }
    });
}

//取消收藏文章
Article.downCollection = function(uid,aid,callback){
    db.execute({
        sql:'delete user_article_collection where UserId=? and ArticleId=?',
        values:[uid,aid],
        handler:function(result){
            callback(result);
        }
    })
}

//点赞文章
Article.upPraise = function(uid,aid,callback){
    db.execute({
        sql:'insert into user_article_praise values(?,?)',
        values:[uid,aid],
        handler:function(result){
            callback(result);
        }
    });
}

//获取点击排行榜
Article.getHitList = function(period,callback){
    db.execute({
        sql:'select ArticleId,Title from articles where PublishTime>? order by Scantimes desc limit 0,10',
        values:[period],
        handler:function(result){
            callback(result);
        }
    });
};

//获取评论排行榜
Article.getCommentList = function(period,callback){
    db.execute({
        sql:'select a.ArticleId,a.Title from articles a left join (select RootId as ArticleId,Count(CommentId) as Comments from comments group by RootId) c on a.ArticleId=c.ArticleId where a.PublishTime>? order by c.Comments desc limit 0,10',
        values:[period],
        handler:function(result){
            callback(result);
        }
    });
};

//获取文章的点赞数量
Article.prototype.getPraiseNums = function(callback){
    db.execute({
        sql:'select count(UserId) as nums from user_article_praise where ArticleId=? group by ArticleId',
        values:[this.ArticleId],
        handler:function(result){
            callback(result);
        }
    });
};

//获取文章的收藏数量
Article.prototype.getCollectNums = function(callback){
    db.execute({
        sql:'select count(UserId) as nums from user_article_collections where ArticleId=? group by ArticleId',
        values:[this.ArticleId],
        handler:function(result){
            callback(result);
        }
    });
};

//是否被用户收藏
Article.prototype.isPraisedByUser = function(uid){
    db.execute({
        sql:'select UserId from user_article_praise where UserId=? and ArticleId=?',
        values:[uid,this.ArticleId],
        handler:function(result){
            return result.length > 0 ? true : false;
        }
    });
};

//是否被用户点赞
Article.prototype.isCollectedByUser = function(uid){
    db.execute({
        sql:'select UserId from user_article_collections where UserId=? and ArticleId=?',
        values:[uid,this.ArticleId],
        handler:function(result){
            return result.length > 0 ? true : false;
        }
    });
};

module.exports = Article;