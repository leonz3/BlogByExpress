
//var fs = require('fs');
//var formidable = require('formidable');
var multer = require('multer');

/**
 * 通过multer上传
 */
exports.upload = function () {
    return multer({
        dest: './public/upload/',
        rename: function (fieldname, filename) {
            return Date.now();
        },
        onFileUploadComplete: function (file, req, res) {
            /**
             * simditor
             */
            res.send({success: true, file_path: 'http://' + req.headers.host + '/upload/' + file.name});

            /**
             * kindeditor
             */
            //res.send({error: 0, url: 'http://' + req.headers.host + '/upload/' + file.name});
        }
    });
};

/**
 * 通过formidable上传，改用multer
 */
exports.imgUpload = function (req, res) {
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
};


