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
};

/**
 * 通过文章ID获取单篇文章
 */
Article.fetchById = function (id) {
    return db.execute({
        sql: 'select ArticleId,Title,PublishTime,ScanTimes,Content,Intro,Source,UserId,CategoryId from articles where ArticleId=?',
        values: [id]
    });
};

/**
 * 通过用户ID分页获取用户下无分类文章
 */
Article.fetchsByUser = function (uid, index) {
    var sql = 'select a.ArticleId,a.Title,a.PublishTime,a.Intro,u.UserId from articles a left join users u on a.userId=u.UserId where u.userid=? order by a.PublishTime desc limit ?,?';
    var start = (~~index - 1) * 10;
    return db.execute({
        sql: sql,
        values: [uid, start, start + 10]
    });

};

/**
 * 分类分页获取所有用户文章
 */
Article.fetchsByCategory = function (cid, index) {
    var sql = 'select a.ArticleId,a.Title,a.Intro,a.CategoryId,u.UserId,u.Portrait,u.NickName from articles a left join users u on a.UserId = u.UserId'
    var start = ~~index === 1 ? 0 : 20 + (index - 2) * 10;
    var end = ~~index === 1 ? start + 20 : start + 10;
    if (cid) {
        sql += ' where CategoryId=?';
        var vals = [cid, start, end];
    } else {
        var vals = [start, end];
    }
    sql += ' order by a.PublishTime desc limit ?,?';
    return db.execute({
        sql: sql,
        values: vals
    });
};

/**
 * 关键字搜索
 */
Article.fetchsByKey = function (key) {
    return db.execute({
        sql: 'select a.ArticleId,a.Title,a.Intro,a.CategoryId,u.UserId,u.Portrait,u.NickName from articles a left join users u on a.UserId=u.UserId where a.Title like "%' + key + '%" or a.Intro like "%' + key + '%"'
    });
};

/**
 * 新增，修改文章
 */
Article.prototype.save = function () {
    if (this.ArticleId) {
        var sql = 'update articles set title=?,content=?,scantimes=?,categoryid=?,intro=?,source=? where articleid=? and userid=?';
        var vals = [this.Title, this.Content, this.ScanTimes, this.CategoryId, this.Intro, this.Source, this.ArticleId, this.UserId];
    } else {
        var sql = 'insert into articles(title,content,publishtime,scantimes,categoryid,userid,intro,source) values(?,?,?,?,?,?,?,?)';
        var vals = [this.Title, this.Content, this.PublishTime, this.ScanTimes, this.CategoryId, this.UserId, this.Intro, this.Source];
    }
    return db.execute({
        sql: sql,
        values: vals
    });
};

/**
 * 删除文章
 */
Article.delete = function (aid, uid) {
    return db.execute({
        sql: 'delete from articles where ArticleId=? And UserId=?',
        values: [aid, uid]
    });
};

/**
 * 收藏文章
 */
Article.upCollection = function (desc, uid, aid) {
    return db.execute({
        sql: 'insert into user_article_collections values(?,?)',
        values: [desc, uid, aid]
    });
};

/**
 * 取消收藏文章
 */
Article.downCollection = function (uid, aid) {
    return db.execute({
        sql: 'delete from user_article_collections where UserId=? and ArticleId=?',
        values: [uid, aid]
    })
};

/**
 * 点赞文章
 */
Article.upPraise = function (uid, aid) {
    return db.execute({
        sql: 'insert into user_article_praise values(?,?)',
        values: [uid, aid]
    });
};

/**
 * 获取排行榜
 */
Article.getTopList = function (period) {
    return db.execute({
        sql: 'call getTopList(?)',
        values: [period],
        handler: function (result, resovle, reject) {
            resovle({byHit:result[0],byComment:result[1]});
        }
    });
};

/**
 * 获取文章的收藏数量和点赞数量
 */
Article.prototype.getStatistics = function () {
    return db.execute({
        sql: 'call getArticleStatistics(?)',
        values: [this.ArticleId],
        handler: function (result, resolve, reject) {
            var praises = result[0].length > 0 ? result[0][0].praises : 0;
            var collections = result[1].length > 0 ? result[1][0].collections : 0;
            var comments = result[2].length > 0 ? result[2][0].comments : 0;
            resolve({praises: praises, collections: collections, comments: comments});
        }
    })
};

/**
 * 是否被用户收藏或点赞
 */
Article.prototype.isOperateByUser = function (uid) {
    return db.execute({
        sql: 'call isOperatedByUser(?,?)',
        values: [uid, this.ArticleId],
        handler: function (result, resolve, reject) {
            var isPraised = result[0].length > 0 ? true : false;
            var isCollected = result[1].length > 0 ? true : false;
            resolve({isPraised: isPraised, isCollected: isCollected});
        }
    });
};

/**
 * 文章被浏览
 */
Article.prototype.scanned = function(){
    return db.execute({
        sql: 'update articles set ScanTimes=ScanTimes+1 where ArticleId=?',
        values: [this.ArticleId]
    });
};

module.exports = Article;