
var User = require('../models/user');

exports.autoLogin = function(req,res,next){
    var username = req.cookies.user || '';
    if (username && !req.session.user) {
        User.fetchByName(username, function (result) {
            if (result.length > 0) {
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