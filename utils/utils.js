
var crypto = require('crypto');
var url = require('url');

exports.generateMd5 = function(value){
    var md5 = crypto.createHash('md5');
    return md5.update(value).digest('base64');
};

exports.generateValidatedLink = function(target){
    var key = this.generateMd5(target.NickName + target.Password);
    return ('http://' + url.Url.host + '/user/validate?uid=' + target.UserId + '&key=' + key);
};