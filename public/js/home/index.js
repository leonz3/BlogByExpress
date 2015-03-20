define(function(require,exports,module){
    var $ = require('jquery');

    (function(){
        $(document).bind('keyup',function(event){
            console.log(event.keyCode)
            if(event.keyCode === 13){
                if($('.txt-key:focus').length > 0){
                    $('.btn-search').trigger('click');
                }
                if($('#login .form-control').filter(':focus').length > 0){
                    $('.btn-submit').trigger('click');
                }
            }
        });
        $('.btn-search').bind('click',function(){
            var _key = $('.txt-key').val().trim();
            console.log(_key);
            if(!_key) return;
            window.location.href = '/search/' + _key;
        });
    })();

});