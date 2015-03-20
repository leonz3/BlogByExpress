
var db = require('../config/database');

var Comment = function(comment){
    this.CommentId = comment.CommentId || null;
    this.Content = comment.Content;
    this.UserId = comment.UserId;
    this.RootId = comment.RootId;
    this.ParentId = comment.ParentId || null;
    this.publishTime = comment.publishTime || new Date();
};

Comment.fetchsByRootId = function(rid,callback){
    db.execute({
        sql:'select c.CommentId,c.PublishTime,c.Content,u.UserId,c.ParentId,u.Portrait,u.NickName from comments c right join users u on c.UserId=u.UserId where RootId=?',
        values:[rid],
        handler:function(result){
            callback(result);
        }
    })
};

Comment.prototype.save = function(callback){
    db.execute({
        sql:'insert into comments(Content,PublishTime,UserId,RootId,ParentId) values(?,?,?,?,?)',
        values:[this.Content,this.PublishTime,this.UserId,this.RootId,this.ParentId],
        handler:function(result){
            callback(result);
        }
    });
};

module.exports = Comment;