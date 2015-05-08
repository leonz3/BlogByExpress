var User = require('../models/user');

/**
 * 自动登录
 */
exports.autoLogin = function (req, res, next) {
    var baseName = req.cookies.self || '';
    if (baseName && !req.session.self) {
        var name = new Buffer(decodeURIComponent(baseName), 'base64').toString();
        User.fetchByName(name).then(function(result){
            if(result.length > 0){
                req.session.self = result[0];
            }
            next();
        });
    }else{
        next();
    }
};

/**
 * 是否已登录
 */
exports.isLogin = function(req, res, next){
    req.session.self? true: false;
}

/**
 * 获取访问用户对象
 */
exports.checkTarget = function (req, res, next) {
    var matched = req.path.match(/^\/u(\d+)/);
    User.getIntro(matched[1]).then(function(result){
        if (result.length > 0) {
            req.target = result[0];
            next();
        } else {
            res.send('不存在用户');
        }
    });
};

/**
 * 访问对象是否是登录用户
 */
exports.isSelf = function (req, res, next) {
    if(!req.session.self){
        req.isSelf = false;
    }else{
        req.isSelf = req.target.UserId === req.session.self.UserId ? true : false;
    }
    next();
};
