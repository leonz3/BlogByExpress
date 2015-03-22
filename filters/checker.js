
var User = require('../models/user');

exports.autoLogin = function(req,res,next){
    var username = req.cookies.self || '';
    if (username && !req.session.self) {
        User.fetchByName(username, function (result) {
            if (result.length > 0) {
                console.log(result[0]);
                req.session.self = new User(result[0]);
            }
        });
    }
    next();
}

exports.checkTarget = function(req,res,next){
    User.getInfo(req.params.id,function(result){
        if(result.length > 0){
            req.session.target = result[0];
            next();
        }
    });
}

exports.isSelf = function(req,res,next){
    req.session.isSelf = req.session.target.UserId === req.session.self.UserId?1:0;
    next();
}