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

exports.article = function (req, res) {
    var target = req.target;
    co(function*() {
        var articles = yield Article.fetchsByUser(target.UserId, 1);
        res.render('user/article', {
            self: req.session.self,
            target: target,
            articles: articles
        });
    });
};

exports.mood = function (req, res) {
    var target = req.target;
    co(function*() {
        var moods = yield Mood.fetchsByUser(target.UserId, 1);
        res.render('user/mood', {
            self: req.session.self,
            target: target,
            moods: moods
        })
    });
};

exports.info = function (req, res) {
    //var target = req.target;
    res.render('user/info', {
        self: req.session.self,
        target: req.target
    })
    //User.getInfo(target.UserId,function(result){
    //    res.render('user/info',{
    //        self:req.self,
    //        target:result[0]
    //    });
    //});
};

exports.config = function (req, res, next) {
    if (!req.isSelf) {
        next();
    }
    res.render('user/config', {
        self: req.session.self,
        target: req.target
    });
};

exports.collection = function (req, res) {
    var target = req.target;
    co(function*() {
        var articles = yield User.getCollection(target.UserId);
        res.render('user/collection', {
            self: req.session.self,
            target: target,
            articles: articles
        })
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
    console.log(req.headers);
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
                console.log(saveResult)
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