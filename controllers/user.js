
var User = require('../models/user');
var Mood = require('../models/mood');
var Article = require('../models/article');
var util = require('./util');

var target;   //访问的用户对象

exports.base = function(req,res,next){
    User.getInfo(req.params.id,function(result){
        if(result.length > 0){
            target = result[0];
            next();
        }
    });
}

exports.center = function(req,res){
    Article.fetchsByUser(target.UserId,1,function(article){
        Mood.fetchsByUser(target.UserId,1,function(mood){
            res.render('user/center',{
                user:target,
                moods:mood,
                articles:article
            });
        });
    });
}

exports.article = function(req,res){
    Article.fetchsByUser(target.UserId,1,function(result){
        res.render('user/article',{
            user:target,
            articles:result
        })
    })
}

exports.mood = function(req,res){
    Mood.fetchsByUser(target.UserId,1,function(result){
        res.render('user/mood',{
            user:target,
            moods:result
        })
    })
}

exports.info = function(req,res){
    User.getInfo(target.UserId,function(result){
        res.render('user/info',{
            user:result[0]
        })
    });
}

exports.config = function(req,res){
    res.render('user/config',{
        user:result[0]
    });
}

exports.collection = function(req,res){
    User.getCollection(target.UserId,function(result){
        if(result.length>0){
            res.render('user/collection',{
                user:target,
                articles:result
            });
        }
    });
}

//用户登录
exports.login = function(req,res){
    var password = util.getMd5(req.body.password);
    var name = req.body.name;
    User.fetchByName(name,function(result){
        if(result.length <= 0){
            User.fetchByMail(name,function(result){
                if(result.length <= 0){
                    return res.send({status:'error',message:'用户不存在'});
                }
                loginHandler(result,req,res,name,password);
            });
        }else{
            loginHandler(result,req,res,name,password);
        }
    });
};
var loginHandler = function(result,req,res,value,key){
    if(key !== result[0].Password){
        return res.send({status:'error',message:'账号密码不正确'});
    }
    if(req.body.save === 'save'){
        res.cookie('username',value,{});
    }
    req.session.user = new User(result[0]);
    res.send({status:'success'});
};

//用户登出
exports.logout = function(req,res){
    req.session.user = null;
    res.clearCookie('username',{});
    return res.redirect('.');
}

//用户注册
exports.regist = function(req,res){
    var user = new User({
        NickName:req.body.name,
        Email:req.body.email,
        Password:util.getMd5(req.body.password)
    });
    User.fetchByName(user.NickName,function(result){
        if(result.length > 0){
            res.send({status:'error',message:'用户名已存在'});
        }else{
            User.fetchByMail(user.Email,function(result){
                if(result.length>0){
                    res.send({status:'error',message:'邮箱已注册'});
                }else{
                    user.save(function(result){
                        if(result.affectedRows>0){
                            user.UserId = result.insertId;
                            req.session.user = user;
                            res.send({status:'success'});
                        }else{
                            res.send({status:'error',message:'网络错误，注册失败'});
                        }
                    });
                }
            });
        }
    });
}


