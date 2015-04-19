define(function(require) {
    var $ = require('jquery');
    require('popup')($);

    var userId = function(){
        return $('.user').attr('data-id').trim() || '';
    }();

    var rmArticle = function(aid,uid,$root){
        $.popup({
            title: '请确认操作',
            content: '您确定要删除文章么？',
            size: 'sm',
            yep:{
                txt:'确定',
                callback:function(){
                    $.ajax({
                        url:'/a' + aid,
                        type: 'delete',
                        data: {uid: uid},
                        success:function(data){
                            if(data === 'success'){
                                $.popup().hide();
                                $root.remove();
                            }
                        }
                    });
                }
            }
        }).show();
    };

    var Mood = {
        getData:function(){
            return {
                uid: userId,
                content: function(){
                    return $('.txt-mood').val().trim();
                }()
            }
        },
        submit:function(){
            var _this = this;
            $.ajax({
                url:'/mood',
                type:'post',
                data:_this.getData(),
                success:function(data){

                }
            });
        }
    };

    return function(){
        $('.btn-delete-article').on('click',function(){
            var aid = $(this).attr('data-id');
            var uid = $('.user').attr('data-id');
            rmArticle(aid,uid,$(this).parents('.media'));
        });
        $('.btn-save-mood').on('click',function(){
            console.log(1)
            Mood.submit();
        });
    }();

});