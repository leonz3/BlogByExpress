var User = require('../models/user');
var Mood = require('../models/mood');
var Article = require('../models/article');
var utils = require('../utils/utils');
var mailer = require('../utils/mailer');
var co = require('co');

//用户中心视图
exports.center = function (req, res) {
    var target = req.target;
    co(function*() {
        var articles = yield Article.fetchsByUser(target.UserId, 1);
        var moods = yield Mood.fetchsByUser(target.UserId, 1);
        res.render('user/center', {
            self: req.session.self,
            target: target,
            moods: moods,
            articles: articles
        });
    });
};

//用户文章视图
exports.article = function (req, res) {
    var target = req.target;
    Article.fetchsByUser(target.UserId, 1).then(function (result) {
        res.render('user/article', {
            self: req.session.self,
            target: target,
            articles: result
        });
    });
};

//用户心情视图
exports.mood = function (req, res) {
    var target = req.target;
    Mood.fetchsByUser(target.UserId, 1).then(function (result) {
        res.render('user/mood', {
            self: req.session.self,
            target: target,
            moods: result
        });
    });

};

//用户资料页视图
exports.info = function (req, res) {
    var target = req.target;
    User.getDetail(target.UserId).then(function (result) {
        res.render('user/info', {
            self: req.session.self,
            target: req.target,
            user: result[0]
        });
    });
};

//信息设置页视图
exports.config = function (req, res, next) {
    if (!req.isSelf) {
        next();
    }
    var target = req.target;
    User.getDetail(target.UserId).then(function (result) {
        res.render('user/config', {
            self: req.session.self,
            target: req.target,
            user: result[0]
        });
    });
};

//用户收藏页视图
exports.collection = function (req, res) {
    var target = req.target;
    User.getCollection(target.UserId).then(function (result) {
        res.render('user/collection', {
            self: req.session.self,
            target: target,
            articles: result
        });
    });
};

//用户登录
exports.login = function (req, res) {
    var password = utils.generateMd5(req.body.password);
    var name = req.body.name;
    co(function*() {
        var nameResult = yield User.fetchByName(name);
        if (nameResult.length <= 0) {
            var mailResult = yield User.fetchByMail(name);
            if (mailResult.length <= 0) {
                res.send({status: 'error', message: '用户不存在'});
            } else {
                loginHandler(mailResult, req, res, name, password);
            }
        } else {
            loginHandler(nameResult, req, res, name, password);
        }
    });
};
var loginHandler = function (result, req, res, value, key) {
    if (key !== result[0].Password) {
        return res.send({status: 'error', message: '密码不正确'});
    }
    if (req.body.save === 'save') {
        res.cookie('self', value, {maxAge: 604800000});
    }
    req.session.self = result[0];
    res.send({status: 'success'});
};

//用户登出
exports.logout = function (req, res) {
    req.session.self = null;
    res.clearCookie('self', {});
    return res.redirect(req.headers.referer);
};

//用户注册
exports.register = function (req, res) {
    var user = new User({
        NickName: req.body.name,
        Email: req.body.email,
        Password: utils.generateMd5(req.body.password)
    });
    co(function*() {
        var isNameExist = yield User.fetchByName(user.NickName);
        if (isNameExist.length > 0) {
            res.send({status: 'error', message: '用户名已存在'});
        } else {
            var isMailExist = yield User.fetchByMail(user.Email);
            if (isMailExist.length > 0) {
                res.send({status: 'error', message: '邮箱已注册'});
            } else {
                var saveResult = yield user.save();
                if (!saveResult) {
                    res.send({status: 'error', message: '网络错误，注册失败'});
                } else {
                    user.UserId = saveResult.uid;
                    req.session.self = user;
                    mailer.send(user, function (err, info) {
                        if (err) {

                        } else {

                        }
                    });
                    res.send({status: 'success'});
                }
            }
        }
    });
};

//用户验证
exports.verify = function (req, res) {
    var uid = req.query.uid;
    var key = req.query.key;
    co(function*() {
        var user = new User((yield User.fetchById(uid))[0]);
        var patt = utils.generateMd5(user.NickName + user.Password);
        if (key === patt) {

        }
    });
};

//发表心情
exports.saveMood = function (req, res) {
    var mood = new Mood({
        UserId: req.body.uid,
        Content: req.body.content
    });
    mood.save().then(function (result) {
        if (result.length > 0) {
            res.send('success');
        }
    });
};

//保存信息
exports.saveConfig = function (req, res) {
    var store = req.body;
    User.setInfo(store.id, store.name, store.email, store.portrait, store.gender, store.location, store.job).then(function(result){
        if(result.affectedRows > 0){
            req.session.self.NickName = store.name;
            req.session.self.Portrait = store.portrait;
            res.send('success');
        }else{
            res.send('error');
        }
    });
};

//用户名是否可用
exports.isExistsUser = function (req, res) {
    var uid = req.query.id || '';
    var field = req.query.field;
    var type = req.query.type;     //[name, mail, both];
    var resultHandler = function (result) {
        if (uid) {
            if (uid == result.UserId) {
                res.send({exists: true, equals: true, field: type});
            } else {
                res.send({exists: true, equals: false, field: type});
            }
        } else {
            res.send({exists: true, field: type});
        }
    };
    var isExistsHandler = function (res, uid, field, type) {

        if (['name', 'both'].indexOf(type) !== -1) {
            User.fetchByName(field).then(function (result) {
                if (result.length > 0) {
                    resultHandler(result[0]);
                } else {
                    if (type === 'both') {
                        isExistsHandler(res, uid, field, 'mail');
                    } else {
                        res.send({exists: false, field: type});
                    }
                }
            });
        } else {
            User.fetchByMail(field).then(function (result) {
                if (result.length > 0) {
                    resultHandler(result[0]);
                } else {
                    res.send({exists: false, field: type});
                }
            });
        }
    };
    isExistsHandler(res, uid, field, type);
};