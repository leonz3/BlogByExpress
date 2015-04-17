define(function(require,exports,moudle){
    var $ = require('jquery');
    var $slc = $('#slc_cid');
    var Article = {
        store:{}
        ,getData:function(){
            this.store = {
                uid:function(){
                    var _val = $('#txt_uid').val().trim();
                    if(_val){
                        return _val;
                    }else{
                        throw  new Error();
                    }
                }(),
                aid:function(){
                    return $('#txt_aid').val().trim();
                }(),
                cid:function(){
                    return $slc.val();
                }(),
                source:function(){
                    return $(':radio:checked').val();
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
            console.log(_this.store)
            $.ajax({
                url:'/article/save',
                type:'post',
                data:_this.store,
                success:function(data){
                    if(data.status  === 'success'){
                        window.location.href = '/a' + data.id;
                    }
                }
            })
        }
    }
    exports.run = function(){
        var cid = $slc.attr('data-category');
        $slc.val(cid);
        var source = $('#chk_source').attr('data-source');
        $(':radio').each(function(){
            if(this.value == source){
                this.checked = true;
            }
        })
        $('#btn_save').on('click',function(){
            Article.submit();
        });
    }

});