define(function(require,exports,module){
    var $ = require('jquery');

    $.fn.getValue = function(){
        return this.value || this.defaultValue;
    }

    var Config = {
        store:{},
        getData:function(){
            var _store = {
                NickName:function(){
                    return $('.txt-name').getValue;
                }(),
                Email:function(){
                    return $('.txt-email').getValue;
                }(),
                gender:function(){
                    return $('.txt-gender:checked').val();
                }(),
                location:function(){
                    return $('.txt-location').getValue;
                }(),
                job:function(){
                    return $('.txt-job').getValue;
                }()
            }
            console.log(_store);
        },
        submit:function(){
            var _this = this;
            _this.getData();
            $.ajax({
                url:'/user/config',
                type:'post',
                data:_this.store,
                success:function(data){

                }
            });
        }
    }

    exports.run = function(){
        $('#btn_save').on('click',function(){
            Config.getData();
        });
    }
});