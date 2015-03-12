var fs = require('fs');
var crypto = require('crypto');
//var formidable = require('formidable');
var multer = require('multer');
var moment = require('moment');

exports.getMd5 = function (val) {
    var md5 = crypto.createHash('md5');
    return md5.update(val).digest('base64');
}

//通过multer上传
exports.imgUpload = function () {
    return multer({
        dest: './public/upload/',
        rename: function (fieldname, filename) {
            return Date.now();
        },
        onFileUploadComplete: function (file, req, res) {
            console.log('http://' + req.headers.host + '/upload/' + file.name);
            res.send({error: 0, url: 'http://' + req.headers.host + '/upload/' + file.name});
        }
    });
}

//通过formidable上传，改用multer
exports.kindUpload = function (req, res) {
    //var form = new formidable.IncomingForm();
    ////form.keepExtensions = true;
    //form.uploadDir = 'public/upload';
    //form.parse(req, function (err, fields, files) {
    //    for (var key in files) {
    //        var file = files[key];
    //        var extName = '.' + fields.localUrl.split('.').pop();
    //        var fileName = new Date().getTime() + extName;
    //        fs.rename(file.path, 'public/upload/' + fileName, function (err) {
    //            if (err) {
    //                res.send(file.path + extName);
    //            } else {
    //                res.send({error: 0, url: 'http://' + req.headers.host + '/upload/' + fileName});
    //            }
    //        });
    //    }
    //});
}


exports.formatDate = function (date) {
    return moment(date).format('YYYY-MM-DD hh:mm:ss');
}

exports.setDefault = function (currVal, defVal) {
    return currVal ? currVal : defVal;
}

exports.getGender = function(val){
    return parseInt(val) === 1?"男":"女";
}


