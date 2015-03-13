
var crypto = require('crypto');

exports.getMd5 = function(value){
    var md5 = crypto.createHash('md5');
    return md5.update(value).digest('base64');
}
