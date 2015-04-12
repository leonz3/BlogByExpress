
var nodemailer = require('nodemailer');
var utils = require('./utils');
var config = require('../config/config.json').mail;

var transporter = nodemailer.createTransport({
    service: config.service,
    auth:{
        user: config.user,
        pass: config.pass
    }
});

exports.send = function(target,callback){
    var link = utils.generateVerofiableLink(target);
    var options = {
        from: config.source,
        to: target.Email,
        subject: '欢迎加入Fade2Coding',
        text: '欢迎加入Fade2Coding',
        html: '<div style="margin:30px auto;width:500px;border:1px solid #eee;box-shadow:2px 1px 8px #aaa;border-radius:5px;">'
            + '<div style="width:100%;border-bottom:1px solid #ddd;text-align:center;font:700 20px/50px Mircosoft YaHei;color:#444;">'
            + 'Fade2Coding'
            + '</div>'
            + '<div style="padding:20px 15px;">'
            + '<p style="font:16px/20px Microsoft YaHei;color:#555;margin:10px 0;">' + target.NickName + '，您好！</p>'
            + '<p style="font:14px/20px Microsoft Yahei;margin:10px 0;color:#777">感谢您注册Fade2Coding，请点击下方链接完成验证！</p>'
            + '<a style="font:13px/18px Microsoft YaHei;color:#00b5b5;word-wrap:break-word" href="' + link + '">' + link + '</a>'
            + '</div>'
            + '<div style="border-top:1px solid #ddd;">'
            + '<a href="' + link + '" style="display:block;margin:15px auto;width:150px;height:36px;background:#00b5b5;font:15px/36px Microsoft YaHei;color:#fff;border-radius:3px;text-align:center;text-decoration:none;">前往验证</a>'
            + '</div>'
            + '</div>'
    }

    transporter.sendMail(options,function(err,info){
        callback(err,info);
    });
}