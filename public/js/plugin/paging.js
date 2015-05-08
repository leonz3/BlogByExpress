
var Page = {
    store: {
        root: null,         //节点
        count: 1,           //总页数
        now: 1,             //当前页数
        url: ""             //请求链接
    }, getHtml: function () {
        var _store = this.store;

        _store.root = $(".pagination");

        var count = parseInt(_store.root.attr("data-page"));
        _store.count = count === 0 || typeof count !== "number" ? 1 : count;

        var times = _store.count < 5 ? _store.count : 5;

        var begin = 1;
        if (_store.count > 5 && _store.now > 3) {
            if (_store.now + 2 >= _store.count) {
                begin = _store.count - 4;
            } else {
                begin = _store.now - 2;
            }
        }

        var sHtml = '<span class="page-tip">共' + _store.count + '页</span>';
        //是否是第一页
        sHtml += _store.now === 1 ? '<li class="disabled"><a href="javascript:void(0)" ' : '<li><a href="' + _store.url + 'page=' + (_store.now - 1) + '"';
        sHtml += 'class="btn-pre-page">&laquo;</a></li>';

        for (var i = 1; i <= times; i++, begin++) {
            sHtml += '<li class=""><a href="' + _store.url + 'page=' + begin + '" class="btn-paging">' + begin + '</a></li>';
        }

        //是否是最后一页
        sHtml += _store.now === _store.count ? '<li class="disabled"><a href="javascript:void(0)" ' : '<li><a href="' + _store.url + 'page=' + (_store.now + 1) + '"';
        sHtml += 'class="btn-next-page">&raquo;</a></li>';

        _store.root.append($(sHtml));
    }, getUrl: function () {
        var aParams = window.location.search.substring(1).split("&");
        if (aParams.length > 0) {
            var sLink = window.location.host + window.location.pathname + "?";
            for (var i = 0; i < aParams.length; i++) {
                var aItem = aParams[i].split("=");
                if ("page" !== aItem[0]) {
                    sLink += aParams[i] + "&";
                } else {
                    this.store.now = parseInt(aItem[1]);
                }
            }
            this.store.url = "http://" + sLink;
        } else {
            this.store.url = location.href + "?";
        }
        return this;
    }, run: function () {
        this.getUrl().getHtml();
    }
}

Page.run();
