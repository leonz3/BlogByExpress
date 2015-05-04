require('../../libs/simditor/styles/simditor.css');
require('../../libs/simple-hotkeys/lib/hotkeys.js');
require('../../libs/simple-uploader/lib/uploader.js');
var simditor = require('../../libs/simditor/lib/simditor.js');

var editor = new simditor({
    textarea: $('#txt_editor'),
    upload:{
        url: '/imgUpload',
        params: null,
        connectionCount:3
    },
    imageButton:['upload', 'external'],
    toolbar: [
        'title',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'color',
        'ol',
        'ul',
        'blockquote',
        'code',
        'table',
        'link',
        'image',
        'hr',
        'indent',
        'outdent',
        'source'
    ]
});

module.exports = editor;