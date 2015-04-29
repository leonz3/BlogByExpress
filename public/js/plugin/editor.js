require("kindeditor");

var options = {
    cssPath: '/kindeditor/themes/default/default.css',
    basePath: '/kindeditor/',
    uploadJson: "/imgUpload",
    filterMode: true,
    items: [
        'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
        'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
        'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
        'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
        'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
        'anchor', 'link', 'unlink'
    ],
    minHeight: 360,
    resizeType: 1,
    allowImageUpload: true,
    afterBlur: function () {
        this.sync("#txt_desc");
    }
};

module.exports = function(){
    KindEditor.ready(function (K) {
        window.editor = K.create('#txt_desc', options);
    });
}();
