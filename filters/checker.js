var User = require('../models/user');

//自动登录
exports.autoLogin = function (req, res, next) {
    var username = req.cookies.self || '';
    if (username && !req.session.self) {
        User.fetchByName(username).then(function(result){
            if(result.length > 0){
                req.session.self = result[0];
            }
            next();
        });
    }
    next();
};

//是否已登录
exports.isLogin = function(req, res, next){
    req.session.self? true: false;
}

//获取访问用户对象
exports.checkTarget = function (req, res, next) {
    User.getIntro(req.params.id).then(function(result){
        if (result.length > 0) {
            req.target = result[0];
            next();
        } else {
            res.send('不存在用户');
        }
    });
};

//访问对象是否是登录用户
exports.isSelf = function (req, res, next) {
    req.isSelf = req.target.UserId === req.session.self.UserId ? 1 : 0;
    next();
};
