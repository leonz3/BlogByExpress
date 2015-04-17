
var db = require('../config/database');

var Mood = function (mood) {
    this.UserId = mood.UserId;
    this.Content = mood.Content;
    this.PublishTime = mood.PublishTime;
};

//通过用户ID分页获取用户心情
Mood.fetchsByUser = function (uid, index) {
    var sql = 'select m.MoodId,m.Content,m.PublishTime,u.UserId from user_moods m left join users u on m.userId=u.userId where u.userid=? limit ?,?';
    var start = (~~index - 1) * 20;
    return db.execute({
        sql: sql,
        values: [uid, start, start + 20]
    });
};

//发表心情
Mood.prototype.save = function () {
    return db.execute({
        sql:'insert into user_moods(Content,UserId,PublishTime) values(?,?,?)',
        values:[this.Content,this.UserId,this.PublishTime]
    });
};

module.exports = Mood;