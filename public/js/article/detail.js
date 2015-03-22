define(function(require,exports,module){
    var $ = require('jquery');

    var Article = {
        aid:'',
        uid:'',
        action:'',
        data:{},
        currNums:0,
        isSuccess:false,
        run:function(){
            var _this = this;
            $('.btn-collect').bind('click',function(){
                var $nums = $('.collection-nums');
                var _nums = parseInt($nums.html());
                _this.getId().collect().submit(function(){
                    $nums.html(_nums + 1);
                });
            });
            $('.btn-praise').bind('click',function(){
                var $nums = $('.praise-nums');
                var _nums = parseInt($nums.html());
                _this.getId().praise().submit(function(){
                    $nums.html(_nums + 1);
                });
            });
            $('.btn-comment').bind('click',function(){
                var $comments = $('.commnet-nums');
                var _nums = parseInt($comments.html());
                _this.getId().comment().submit(function(){
                    $comments.html(_nums + 1);
                    _this.appendComment();
                });
            });
        },
        getId:function(){
            this.aid = $('.article-title').attr('data-id').trim();
            this.uid = $('.user').attr('data-id').trim();
            return this;
        },
        praise:function(){
            this.action = '/article/praise';
            this.data = {aid:this.aid,uid:this.uid};
            return this;
        },
        collect:function(){
            this.action = '/article/collect';
            this.data = {aid:this.aid,uid:this.uid};
            return this;
        },
        comment:function(){
            this.action = '/comment';
            this.data = {aid:this.aid,uid:this.uid,content:$('#txt_comment').val().trim()};
            return this;
        },
        submit:function(callback){
            var _this = this;
            console.log(_this);
            $.ajax({
                url:_this.action,
                data:_this.data,
                type:'post',
                success:function(data){
                    if(data === 'success'){
                        callback();
                    }
                }
            });
        },
        appendComment:function(){
            var sportrait = $('.user img').attr('src');
            var sname = $('.user a').html().trim()
            var shtml = '<li class="media"><div class="media-left"><a href="/u' + this.uid + '">'
                        + '<img class="media-object" src="' + sportrait + '"></a></div>'
                        + '<div class="media-body"><h4 class="media-heading">' +  sname + '</h4>'
                        +  '<p>' + this.data.content + '</p></div></li>';
            $('.list-comments').append($(shtml));
        }
    };

    exports.run = function(){
        $('.btn-collect,.btn-praise').tooltip();
        Article.run();
    }
})