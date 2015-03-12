define(function(require,exports,moudle){
    var $ = require('jquery');
    var Article = {
        store:{}
        ,getData:function(){
            this.store = {
                uid:function(){
                    return $('#txt_uid').val().trim() || '';
                }(),
                aid:function(){
                   return $('#txt_aid').val().trim() || '';
                }(),
                cid:function(){
                    return $('#slc_cid').val().trim();
                }(),
                title:function(){
                    var _val = $('#txt_title').val().trim();
                    if(!_val){
                        throw new Error('文章标题不能为空');
                    }else{
                        return _val;
                    }
                }(),
                content:function(){
                    var _val = $('#txt_desc').val().trim();
                    if(!_val){
                        throw new Error('文章内容不能为空');
                    }else{
                        return _val;
                    }
                }(),
                intro:function(){
                    return editor.text().trim().substring(0,100);
                }
            }
        },
        submit:function(callback){
            var _this = this;
            try{
                _this.getData();
            }catch(e){
                return ;
            }
            $.ajax({
                url:'/article/save',
                type:'post',
                data:_this.store,
                success:function(data){
                    if(data.status  === 'success'){
                        window.location.href = '/article/' + data.insertId;
                    }
                }
            })
        }
    }
    exports.run = function(){
        $('#btn_save').on('click',function(){
            Article.submit();
        });
    }

});