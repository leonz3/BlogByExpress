
var db = require('../config/database');

var Mood = function (mood) {
    this.UserId = mood.UserId;
    this.Content = mood.Content;
    this.PublishTime = mood.PublishTime;
}

//通过用户ID分页获取用户心情
Mood.fetchsByUser = function (uid, index, callback) {
    var _sql = 'select m.MoodId,m.Content,m.PublishTime,u.UserId from user_moods m left join users u on m.userId=u.userId where u.userid=? limit ?,?';
    var start = (~~index - 1) * 20;
    db.execute({
        sql: _sql,
        values: [uid, start, start + 20],
        handler: function (result) {
            callback(result);
        }
    });
}

//发表心情
Mood.prototype.save = function () {
    db.execute({
        sql:'insert into user_moods(Content,UserId,PublishTime) values(?,?,?)',
        values:[this.Content,this.UserId,this.PublishTime],
        handler:function(result){
            callback(result);
        }
    });
}

module.exports = Mood;