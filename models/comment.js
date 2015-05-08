
var db = require('../config/database');

var Comment = function(comment){
    this.CommentId = comment.CommentId || null;
    this.Content = comment.Content;
    this.UserId = comment.UserId;
    this.RootId = comment.RootId;
    this.ParentId = comment.ParentId || null;
    this.PublishTime = comment.PublishTime || new Date();
};

/**
 * 根据文章ID获取评论
 */
Comment.fetchsByRootId = function(rid, index){
    if(!index){
        index = 1;
    }
    var start = (~~index - 1) * 10;
    return db.execute({
        sql:'select c.CommentId,c.PublishTime,c.Content,u.UserId,c.ParentId,u.Portrait,u.NickName from comments c right join users u on c.UserId=u.UserId where RootId=? order by c.CommentId desc limit ?,?',
        values:[rid, start, 10]
    })
};

/**
 * 保存评论
 */
Comment.prototype.save = function(){
    return db.execute({
        sql:'insert into comments(Content,PublishTime,UserId,RootId,ParentId) values(?,?,?,?,?)',
        values:[this.Content,this.PublishTime,this.UserId,this.RootId,this.ParentId]
    });
};

/**
 * 删除评论
 */
Comment.delete = function(aid,uid){
    return db.execute({
        sql:'delete from comments where CommentId=? AND UserId=?',
        values:[aid,uid]
    });
};

module.exports = Comment;