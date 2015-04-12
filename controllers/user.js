
var User = require('../models/user');
var Mood = require('../models/mood');
var Article = require('../models/article');
var utils = require('../utils/utils');
var mailer = require('../utils/mailer');

exports.center = function(req,res){
    var target = req.target;
    Article.fetchsByUser(target.UserId,1,function(article){
        Mood.fetchsByUser(target.UserId,1,function(mood){
            res.render('user/center',{
                self:req.session.self,
                target:target,
                moods:mood,
                articles:article
            });
        });
    });
}

exports.article = function(req,res){
    var target = req.target;
    Article.fetchsByUser(target.UserId,1,function(result){
        res.render('user/article',{
            self:req.session.self,
            target:target,
            articles:result
        })
    })
}

exports.mood = function(req,res){
    var target = req.target;
    Mood.fetchsByUser(target.UserId,1,function(result){
        res.render('user/mood',{
            self:req.session.self,
            target:target,
            moods:result
        })
    })
}

exports.info = function(req,res){
    //var target = req.target;
    res.render('user/info',{
        self:req.session.self,
        target:req.target
    })
    //User.getInfo(target.UserId,function(result){
    //    res.render('user/info',{
    //        self:req.self,
    //        target:result[0]
    //    });
    //});
};

exports.config = function(req,res,next){
    if(!req.isSelf){
        next();
    }
    res.render('user/config',{
        self:req.session.self,
        target:req.target
    });
};

exports.collection = function(req,res){
    var target = req.target;
    User.getCollection(target.UserId,function(result){
        if(result.length>0){
            res.render('user/collection',{
                self:req.session.self,
                target:target,
                articles:result
            });
        }
    });
}

//用户登录
exports.login = function(req,res){
    var password = utils.generateMd5(req.body.password);
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
        res.cookie('self',value,{maxAge:604800000});
    }
    req.session.self = result[0];
    res.send({status:'success'});
};

//用户登出
exports.logout = function(req,res){
    req.session.self = null;
    res.clearCookie('self',{});
    return res.redirect('.');
}

//用户注册
exports.regist = function(req,res){
    var user = new User({
        NickName:req.body.name,
        Email:req.body.email,
        Password:utils.generateMd5(req.body.password)
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
                            req.session.self = user;
                            mailer.send(user,function(err,info){
                                if(err){

                                }else{

                                }
                            });
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

exports.verify = function(req,res){
    var uid = req.query.uid;
    var lock = req.query.key;
    User.fetchById(uid,function(result){
        var user = new User(result[0]);
        var key = utils.generateMd5(user.NickName + user.Password);
        if(lock === key){

        }
    });
};