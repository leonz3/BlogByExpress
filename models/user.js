
var db = require('../config/database');

var User = function(user){
    this.UserId = user.UserId || null;
    this.NickName = user.NickName;
    this.Email = user.Email;
    this.Password = user.Password;
};

//新增用户
User.prototype.save = function(callback){
    db.execute({
        sql:'insert into users(NickName,Password,Email) values(?,?,?)',
        values:[this.NickName,this.Password,this.Email],
        handler:function(res){
            db.execute({
                sql:'insert into user_info(RegTime,UserId) values(?,?)',
                values:[new Date(),res.insertId],
                handler:function(result){
                    callback(result);
                }
            });
        }
    });
};

//通过昵称查找用户
User.fetchByName = function(nickname,callback){
    db.execute({
        sql:'select UserId,NickName,Password,Email,Portrait from users where nickname=?',
        values:[nickname],
        handler:function(result){
            callback(result);
        }
    });
};

//通过邮箱查找用户
User.fetchByMail = function(mail,callback){
    db.execute({
        sql:'select UserId,NickName,Password,Email,Portrait from users where Email=?',
        values:[mail],
        handler:function(result){
            callback(result);
        }
    });
};

//通过ID查看用户信息
User.getInfo = function(id,callback){
    db.execute({
        sql:'select u.UserId,u.NickName,u.Email,u.Portrait,i.Gender,i.RegTime,i.Job,i.Location from users u left join user_info i on u.UserId=i.UserId where u.userId=?;',
        values:[id],
        handler:function(result){
            callback(result);
        }
    });
};

//通过ID获取收藏列表
User.getCollection = function(id,callback){
    db.execute({
        sql:'select u.UserId,a.ArticleId,a.Title,c.Describe from users u left join user_article_collections c on u.UserId=c.UserId left join articles a on c.ArticleId=a.ArticleId where u.UserId=?',
        values:[id],
        handler:function(result){
            callback(result);
        }
    });
}


module.exports = User;
