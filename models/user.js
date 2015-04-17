var db = require('../config/database');

var User = function (user) {
    this.UserId = user.UserId || null;
    this.NickName = user.NickName;
    this.Email = user.Email;
    this.Password = user.Password;
    this.Portrait = user.Portrait;
};

//新增用户
User.prototype.save = function () {
    return db.execute({
        sql: 'call createUser(?,?,?)',
        values: [this.NickName, this.Password, this.Email],
        handler: function (result, resolve) {
            result[0].length > 0 ? resolve(result[0][0]) : resolve(false);
        }
    });
};

//通过ID查找用户
User.fetchById = function (id) {
    return db.execute({
        sql: 'select UserId,NickName,Password,Email,Portrait,Status from users where UserId=?',
        values: [id]
    });
};

//通过昵称查找用户
User.fetchByName = function (nickname) {
    return db.execute({
        sql: 'select UserId,NickName,Password,Email,Portrait,Status from users where nickname=?',
        values: [nickname]
    });
};

//通过邮箱查找用户
User.fetchByMail = function (mail) {
    return db.execute({
        sql: 'select UserId,NickName,Password,Email,Portrait,Status from users where Email=?',
        values: [mail]
    });
};

//通过ID查看用户信息
User.getInfo = function (id) {
    return db.execute({
        sql: 'select u.UserId,u.NickName,u.Email,u.Portrait,i.Gender,i.RegTime,i.Job,i.Location,m.Moods,c.Comments,a.Articles from users u left join user_info i on u.UserId=i.UserId left join (select UserId,count(ArticleId) as articles from articles group by UserId) a on u.UserId=a.UserId left join (select UserId,count(MoodId) as moods from user_moods group by UserId) m on u.UserId=m.UserId left join (select UserId,count(CommentId) as comments from comments group by UserId) c on u.UserId=c.UserId where u.userId=?',
        values: [id]
    });
};

//通过ID获取用户收藏列表
User.getCollection = function (id) {
    return db.execute({
        sql: 'select u.UserId,a.ArticleId,a.Title,c.Describe from users u left join user_article_collections c on u.UserId=c.UserId left join articles a on c.ArticleId=a.ArticleId where u.UserId=?',
        values: [id]
    });
}

module.exports = User;
