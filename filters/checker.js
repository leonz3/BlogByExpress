var User = require('../models/user');
var co = require('co');

//自动登录
exports.autoLogin = function (req, res, next) {
    var username = req.cookies.self || '';
    if (username && !req.session.self) {
        co(function*() {
            var result = yield User.fetchByName(username);
            if (result.length > 0) {
                req.session.self = result[0];
            }
            next();
        });
    }
    next();
};

//获取访问用户对象
exports.checkTarget = function (req, res, next) {
    co(function*() {
        var targetResult = yield User.getInfo(req.params.id);
        if (targetResult.length > 0) {
            req.target = targetResult[0];
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
