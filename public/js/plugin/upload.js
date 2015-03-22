define(function(require,exports,module){
    var $ = require("jquery");
    require("uploadify")($);
    setTimeout(function(){
        $('.btn-upload').uploadify({
            uploader: '/ImgUpload',           // 服务器端处理地址
            swf: '/uploadify/uploadify.swf',    // 上传使用的 Flash

            width: 90,                          // 按钮的宽度
            height: 32,                         // 按钮的高度
            buttonText: "上传",                 // 按钮上的文字
            buttonClass: "btn btn-warning",
            buttonCursor: 'hand',                // 按钮的鼠标图标

            fileObjName: 'Filedata',            // 上传参数名称

            // 两个配套使用
            fileTypeExts: "*.jpg;*.png",             // 扩展名
            fileTypeDesc: "请选择 jpg png 文件",     // 文件说明

            auto: true,                // 选择之后，自动开始上传
            multi: true,               // 是否支持同时上传多个文件
            queueSizeLimit: 1,          // 允许多文件上传的时候，同时上传文件的个数
            onUploadSuccess: function (file, data, response) {
            },
            onUploadError: function () {
            }
        });
    },100)
});