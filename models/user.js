var db = require('../config/database');

var User = function (user) {
    this.UserId = user.UserId || null;
    this.NickName = user.NickName;
    this.Email = user.Email;
    this.Password = user.Password;
    this.Portrait = user.Portrait;
};

/**
* 新增用户
*/
User.prototype.save = function () {
    if (this.UserId) {
        return db.execute({
            sql: 'update users set NickName=?, Email=?, Password=?, Portrait=? where UserId=?',
            values: [this.NickName, this.Email, this.Password, this.Portrait, this.UserId],
            handler: function (result, resolve) {
                result.affectedRows > 0 ? resolve(true) : resolve(false);
            }
        });
    } else {
        return db.execute({
            sql: 'call createUser(?,?,?)',
            values: [this.NickName, this.Password, this.Email],
            handler: function (result, resolve) {
                result[0].length > 0 ? resolve(result[0][0]) : resolve(false);
            }
        });
    }
};

/**
* 通过ID查找用户
*/
User.fetchById = function (id) {
    return db.execute({
        sql: 'select UserId,NickName,Password,Email,Portrait,Status from users where UserId=?',
        values: [id]
    });
};

/**
* 通过昵称查找用户
*/
User.fetchByName = function (nickname) {
    return db.execute({
        sql: 'select UserId,NickName,Password,Email,Portrait,Status from users where nickname=?',
        values: [nickname]
    });
};

/**
* 通过邮箱查找用户
*/
User.fetchByMail = function (mail) {
    return db.execute({
        sql: 'select UserId,NickName,Password,Email,Portrait,Status from users where Email=?',
        values: [mail]
    });
};

/**
* 通过ID获取用户的简单信息
*/
User.getIntro = function (id) {
    return db.execute({
        sql: 'select u.UserId,u.NickName,u.Portrait,m.Content as Mood from users u left join user_moods m on u.UserId=m.UserId where u.UserId=? order by PublishTime desc limit 1',
        values: [id]
    });
};

/**
* 通过ID获取用户的完整信息
*/
User.getDetail = function (id) {
    return db.execute({
        sql: 'select u.UserId,u.NickName,u.Email,u.Portrait,i.Gender,i.RegTime,i.Job,i.Location,i.LastLogTime,m.Moods,c.Comments,a.Articles from users u left join user_info i on u.UserId=i.UserId left join (select UserId,count(ArticleId) as articles from articles group by UserId) a on u.UserId=a.UserId left join (select UserId,count(MoodId) as moods from user_moods group by UserId) m on u.UserId=m.UserId left join (select UserId,count(CommentId) as comments from comments group by UserId) c on u.UserId=c.UserId where u.userId=?',
        values: [id]
    });
};

/**
* 通过ID获取用户收藏列表
*/
User.getCollection = function (id, index) {
    if (!index) {
        index = 1;
    }
    var start = (~~index - 1) * 20;
    return db.execute({
        sql: 'select u.UserId,a.ArticleId,a.Title from users u left join user_article_collections c on u.UserId=c.UserId left join articles a on c.ArticleId=a.ArticleId where u.UserId=? order by ArticleId desc limit ?, ?',
        values: [id, start, start + 20]
    });
};

/**
* 更新用户信息
*/
User.setInfo = function (id, name, mail, portrait, gender, location, job) {
    return db.execute({
        sql: 'call setUserInfo(?,?,?,?,?,?,?)',
        values: [id, name, mail, portrait, gender, location, job]
    });
};

/**
* 更新用户登录时间
*/
User.prototype.logged = function () {
    return db.execute({
        sql: 'update user_info set LastLogTime=now() where UserId=?',
        values: [this.UserId]
    });
};

module.exports = User;
