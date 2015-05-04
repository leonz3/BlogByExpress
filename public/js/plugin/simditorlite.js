
require('../../libs/simditor/styles/simditor.css');
var simditor = require('../../libs/simditor/lib/simditor.js');

var editor = new simditor({
    textarea: $('#txt_editor'),
    toolbar: [
        'bold',
        'underline',
        'color',
        'ol',
        'ul',
        'blockquote',
        'code',
        'link',
        'hr'
    ]
});

module.exports = editor;