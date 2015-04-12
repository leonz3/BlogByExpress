
var User = require('../models/user');
var Article = require('../models/article');

//自动登录
exports.autoLogin = function(req,res,next){
    var username = req.cookies.self || '';
    if (username && !req.session.self) {
        User.fetchByName(username, function (result) {
            if (result.length > 0) {
                req.session.self = new User(result[0]);
            }
        });
    }
    next();
}

//获取访问用户对象
exports.checkTarget = function(req,res,next){
    User.getInfo(req.params.id,function(result){
        if(result.length > 0){
            req.target = result[0];
            next();
        }
    });
}

//访问对象是否是登录用户
exports.isSelf = function(req,res,next){
    req.isSelf = req.target.UserId === req.session.self.UserId?1:0;
    next();
}
