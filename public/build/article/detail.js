/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {__webpack_require__(8);
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	var simditorLite = __webpack_require__(4);


	var isSignIn = function (cb) {
	    if ($('.user').length > 0) {
	        cb();
	    } else {
	        $('#sign').modal('show').find('.text-danger').html('请先进行登录！').removeClass('hide');
	    }
	};

	var formatDate = function(time){
	    var date = new Date(time);
	    var ymd = time.substring(0,10);
	    var hms = [date.getHours(), date.getMinutes(), date.getSeconds()];
	    for(var i = 0; i < 3; i ++){
	        var item = hms[i].toString();
	        hms[i] = item.length > 1? item: '0' + item;
	    }
	    return ymd + ' ' + hms.join(':');
	};

	var Article = {
	    aid: '',
	    uid: '',
	    action: '',
	    type: 'post',
	    data: {},
	    currNums: 0,
	    currCommentIndex: 1,
	    hasComment: true,
	    isSuccess: false,
	    run: function () {
	        var _this = this;

	        if($('.list-comments li').length === 0){
	            $('#rolloader').html('暂无评论...');
	            _this.hasComment = false;
	        }

	        $('.btn-collect').bind('click', function () {
	            var $this = $(this);
	            isSignIn(function () {
	                //if ($this.hasClass('disabled')) {
	                //    return false;
	                //}
	                var $nums = $('.collection-nums');
	                var _nums = parseInt($nums.html());
	                _this.getId().collect().submit(function (result) {
	                    if (result === 'success') {
	                        $nums.html(_nums + 1);
	                        $this.addClass('disabled').attr({'title': '已收藏', 'data-original-title': '已收藏'});
	                    }
	                });
	            });
	        });

	        $('.btn-praise').bind('click', function () {
	            var $this = $(this);
	            isSignIn(function () {
	                //if ($this.hasClass('disabled')) {
	                //    return false;
	                //}
	                var $nums = $('.praise-nums');
	                var _nums = parseInt($nums.html());
	                _this.getId().praise().submit(function (result) {
	                    if (result === 'success') {
	                        $nums.html(_nums + 1);
	                        $this.addClass('disabled').attr({'title': '已点赞', 'data-original-title': '已点赞'});
	                    }
	                });
	            });
	        });

	        $('.btn-comment').bind('click', function () {
	            isSignIn(function () {
	                //var $comments = $('.commnet-nums');
	                //var _nums = parseInt($comments.html());
	                _this.getId().newComment().submit(function (result) {
	                    if (result === 'success') {
	                        //$comments.html(_nums + 1);
	                        //_this.appendComment();
	                        window.location.reload();
	                    }
	                });
	            }).call(this);
	        });

	        $('.list-comments').on('click', '.btn-delete-comment', function () {
	            var cid = $(this).attr('data-id');
	            $.popup({
	                title: '提示',
	                content: '确定删除该评论么？',
	                size: 'sm',
	                yep: {
	                    txt: '确定',
	                    callback: function () {
	                        _this.getId().rmComment(cid).submit(function (result) {
	                            if (result === 'success') {
	                                window.location.reload();
	                            }
	                        });
	                    }
	                }
	            }).show();
	        });

	        $('#rolloader').on('click', function () {
	            if (!_this.hasComment) return false;
	            var $this = $(this);
	            _this.getId().getComment().submit(function (result) {
	                if (result.length > 0) {
	                    _this.appendComment(result);
	                }
	                if(result.length < 10){
	                    $this.html('没有更多评论');
	                    _this.hasComment = false;
	                }
	            });
	        });
	    },
	    getId: function () {
	        this.aid = $('.article-title').attr('data-id').trim();
	        this.uid = $('.user').length > 0 ? $('.user').attr('data-id').trim() : '';
	        return this;
	    },
	    praise: function () {
	        this.action = '/article/praise';
	        this.type = 'post';
	        this.data = {aid: this.aid, uid: this.uid};
	        return this;
	    },
	    collect: function () {
	        this.action = '/article/collect';
	        this.type = 'post';
	        this.data = {aid: this.aid, uid: this.uid};
	        return this;
	    },
	    newComment: function () {
	        this.action = '/comment';
	        this.type = 'post';
	        this.data = {aid: this.aid, uid: this.uid, content: $('#txt_editor').val().trim()};
	        return this;
	    },
	    rmComment: function (id) {
	        this.action = '/comment';
	        this.type = 'delete';
	        this.data = {cid: id, uid: this.uid};
	        return this;
	    },
	    getComment: function () {
	        this.action = '/comment/' + this.aid + '/' + (++this.currCommentIndex);
	        this.type = 'get';
	        return this;
	    },
	    submit: function (callback) {
	        var _this = this;
	        $.ajax({
	            url: _this.action,
	            data: _this.data,
	            type: _this.type,
	            success: function (data) {
	                callback(data);
	            }
	        });
	    },
	    appendComment: function (data) {
	        var html = '';
	        for (var i = 0, len = data.length; i < len; i++) {
	            var item = data[i];
	            html += '<li class="media">'
	            + '<div class="media-left">'
	            + '<a href="/u' + item['UserId'] + '">'
	            + '<img class="media-object" src="' + item['Portrait'] + '"></a></div>'
	            + '<div class="media-body">'
	            + '<span class="pull-right">' + formatDate(item['PublishTime']) + '</span>'
	            + '<h4 class="media-heading">' + item['NickName'] + '</h4>'
	            + '<a href="javascript:void(0);" class="pull-right hide btn-delete-comment" data-id="' + item['CommentId'] + '">删除该评论</a>'
	            + '<p>' + item['Content'] + '</p></div></li>';
	        }
	        $('.list-comments').append($(html));
	    }
	};


	~function () {

	    $('.article-btns>div').tooltip();

	    Article.run();

	    $('.btn-publish').on('click', function () {
	        if ($('.user').length > 0) {
	            window.location.href = '/article/edit';
	        } else {
	            $('#sign').modal('show').find('.text-danger').html('请先进行登录！').removeClass('hide');
	        }
	    });
	}();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {
	__webpack_require__(10);
	__webpack_require__(11);

	var Login = {
	    type: 1  //1=login,0=regist
	    , link: '/login'
	    , data: {}
	    , redraw: function () {
	        var _type = this.type;
	        $('.modal-title').html((_type ? '欢迎登录' : '欢迎注册'));
	        $('.btn-redraw').html((_type ? '我要注册' : '我要登录'));
	        $('.btn-submit').html((_type ? '登录' : '注册并登录'));
	        this.link = (_type ? '/login' : '/register');
	        if (_type === 1) {
	            $('.input-group.flag').removeClass('flag').addClass('hide');
	            $('.checkbox').removeClass('hide');
	        } else {
	            $('.input-group.hide').removeClass('hide').addClass('flag');
	            $('.checkbox').addClass('hide');
	        }
	    }
	    , getData: function () {
	        var _this = this;
	        this.data = {
	            name: function () {
	                var _val = $('#txt_name').val().trim();
	                if (_val) {
	                    return _val;
	                } else {
	                    throw new Error('请输入用户名');
	                }
	            }(),
	            email: function () {
	                var _val = $('#txt_mail').val().trim();
	                if (!_this.type) {
	                    var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	                    if (!_val || !reg.test(_val)) {
	                        throw new Error('请输入正确邮箱');
	                    } else {
	                        return _val;
	                    }

	                }
	            }(),
	            password: function () {
	                var _val = $('#txt_pwd').val().trim();
	                if (!_val) {
	                    throw new Error('请输入用户密码');
	                }
	                if (!_this.type) {
	                    var _reVal = $('#txt_repwd').val().trim();
	                    if (!_reVal) {
	                        throw new Error('请再一次输入密码');
	                    } else if (_val !== _reVal) {
	                        throw new Error('两次密码不正确');
	                    }
	                }
	                return _val;
	            }(),
	            save: function () {
	                if (_this.type) {
	                    return $('input[type="checkbox"]:checked').val() || 'unsave';
	                }
	            }()
	        }
	    }
	    , submit: function () {
	        var _this = this;
	        $('.text-danger').addClass('hide');
	        try {
	            _this.getData();
	        } catch (e) {
	            $('.text-danger').html(e.message).removeClass('hide');
	            return;
	        }
	        $.ajax({
	            url: _this.link,
	            type: 'post',
	            data: _this.data,
	            success: function (data) {
	                if (data.status === 'success') {
	                    window.location.reload();
	                } else {
	                    $('.text-danger').html(data.message).removeClass('hide');
	                }
	            }
	        });
	    }
	};

	~function () {

	    $(document).bind('keyup', function (event) {
	        if (event.keyCode === 13) {
	            if ($('.txt-key:focus').length > 0) {
	                $('.btn-search').trigger('click');
	            }
	            if ($('#sign .form-control').filter(':focus').length > 0) {
	                $('.btn-submit').trigger('click');
	            }
	        }
	    });

	    $('.btn-search').bind('click', function () {
	        var _key = $('.txt-key').val().trim();
	        if (!_key) return;
	        window.location.href = '/search/' + _key;
	    });

	    $('.btn-redraw').on('click', function () {
	        Login.type = Login.type == 1 ? 0 : 1;
	        Login.redraw();
	    });

	    $('.btn-submit').on('click', function () {
	        Login.submit();
	    });

	    $('#sign').on('hidden.bs.modal',function(){
	        $(this).find('.text-danger').html('').addClass('hide');
	    });
	}();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var measure = __webpack_require__(12);

	var getElementByClass = function (root, className) {
	    var elements = [];
	    var childs = root.childNodes;
	    for (var i = 0, len = childs.length; i < len; i++) {
	        var item = childs[i];
	        if (item.nodeType === 1 && hasClass(item, className)) {
	            elements.push(item);
	        }
	    }
	    return elements;
	};

	var hasClass = function (node, cls) {
	    var reg = RegExp('(^|[^\\S])' + cls + '(?![^\\s])');
	    return reg.test(node.className);
	};

	var removeClass = function (node, cls) {
	    var reg = RegExp('(^|[^\\S])' + cls + '(?![^\\s])');
	    var className = node.className;
	    return node.className = className.replace(reg, '');
	};

	var addClass = function (node, cls) {
	    if (hasClass(node, cls)) {
	        return;
	    } else {
	        node.className += (' ' + cls);
	    }
	};

	var parseWidth = function (elem) {
	    return parseInt(measure.width(elem).toString().match(/^(\d+)[a-zA-Z]*$/)[1]);
	};

	var appendAsideBar = function () {
	    var aside = document.createElement('aside');
	    var btnTop = document.createElement('a');
	    aside.className = 'aside';
	    btnTop.className = 'btn btn-block glyphicon glyphicon-menu-up';
	    aside.appendChild(btnTop);
	    document.body.appendChild(aside);
	}

	~function () {
	    appendAsideBar();

	    var windowHeight = measure.windowHeight();

	    var body = document.body;
	    var container = getElementByClass(body, 'container')[0],
	        aside = getElementByClass(body, 'aside')[0],
	        btnTop = getElementByClass(aside, 'glyphicon-menu-up')[0];

	    var setAsidePosition = function () {
	        var bodyWidth = parseWidth(body);
	        var elemWidth = parseWidth(container)
	        if (elemWidth > 1000 && (bodyWidth - elemWidth > 300)) {
	            var offsetX = (bodyWidth - elemWidth) / 2 - 65;
	            aside.style.right = offsetX + 'px';
	        } else {
	            aside.style.right = '5%'
	        }
	    };

	    setAsidePosition();

	    window.onresize = setAsidePosition;


	    if (typeof window.onscroll === 'function') {
	        var temporary = window.onscroll;
	    }
	    window.onscroll = function () {
	        temporary && temporary();
	        if (measure.scrollTop() > windowHeight * 2) {
	            addClass(aside, 'rise');
	        } else {
	            removeClass(aside, 'rise');
	        }
	    };

	    btnTop.addEventListener('click', function () {
	        measure.toTop();
	        return false;
	    }, false);
	}();


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {
	__webpack_require__(10);

	var Modal = {
	    root: '#popup_modal',
	    wrap: '#popup_modal>.modal-dialog',
	    header: '#popup_modal .modal-title',
	    body: '#popup_modal .modal-body',
	    buttons: '#popup_modal .modal-footer>.btn'
	};

	var defaults = {
	    title: '',
	    content: '',
	    yep: {txt: '确定', callback: null},
	    nope: {txt: '关闭', callback: null},
	    type: 'alert',
	    size: 'noraml'      //lg --> large   sm--> small
	};

	~function () {

	    var $root = $(Modal.root),
	        $wrap = $(Modal.wrap),
	        $btn_nope = $(Modal.buttons).eq(0),
	        $btn_yep = $(Modal.buttons).eq(1)

	    $.extend({
	        popup: function (opts) {
	            var _modal = this;
	            var settings = $.extend({}, defaults, opts);
	            $(Modal.header).html(settings.title);
	            $(Modal.body).html(settings.content);
	            $btn_nope.html(settings.nope.txt);
	            $btn_yep.html(settings.yep.txt);
	            if (settings.nope.callback) {
	                $btn_nope.bind('click', settings.nope.callback);
	            } else {
	                $btn_nope.unbind('click');
	            }
	            if (settings.yep.callback) {
	                $btn_yep.bind('click', settings.yep.callback);
	            } else {
	                $btn_yep.unbind('click');
	            }
	            if ('alert' === settings.type) {
	                $btn_yep.attr('data-dismiss', 'modal');
	            } else {
	                $btn_yep.removeAttr('data-dismiss');
	            }
	            if (settings.size) {
	                $wrap.addClass('modal-' + settings.size);
	            }
	            $root.on('hidden.bs.modal', function () {
	                $wrap.removeClass('modal-' + settings.size);
	            });
	            this.show = function () {
	                $root.modal('show');
	            };
	            this.hide = function () {
	                $root.modal('hide');
	            }
	            return this;
	        }
	    });
	}();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {
	__webpack_require__(17);
	var simditor = __webpack_require__(14);

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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
	 * Bootstrap: tooltip.js v3.3.4
	 * http://getbootstrap.com/javascript/#tooltip
	 * Inspired by the original jQuery.tipsy by Jason Frame
	 * ========================================================================
	 * Copyright 2011-2015 Twitter, Inc.
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
	 * ======================================================================== */


	+function ($) {
	  'use strict';

	  // TOOLTIP PUBLIC CLASS DEFINITION
	  // ===============================

	  var Tooltip = function (element, options) {
	    this.type       = null
	    this.options    = null
	    this.enabled    = null
	    this.timeout    = null
	    this.hoverState = null
	    this.$element   = null

	    this.init('tooltip', element, options)
	  }

	  Tooltip.VERSION  = '3.3.4'

	  Tooltip.TRANSITION_DURATION = 150

	  Tooltip.DEFAULTS = {
	    animation: true,
	    placement: 'top',
	    selector: false,
	    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
	    trigger: 'hover focus',
	    title: '',
	    delay: 0,
	    html: false,
	    container: false,
	    viewport: {
	      selector: 'body',
	      padding: 0
	    }
	  }

	  Tooltip.prototype.init = function (type, element, options) {
	    this.enabled   = true
	    this.type      = type
	    this.$element  = $(element)
	    this.options   = this.getOptions(options)
	    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

	    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
	      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
	    }

	    var triggers = this.options.trigger.split(' ')

	    for (var i = triggers.length; i--;) {
	      var trigger = triggers[i]

	      if (trigger == 'click') {
	        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
	      } else if (trigger != 'manual') {
	        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
	        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

	        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
	        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
	      }
	    }

	    this.options.selector ?
	      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
	      this.fixTitle()
	  }

	  Tooltip.prototype.getDefaults = function () {
	    return Tooltip.DEFAULTS
	  }

	  Tooltip.prototype.getOptions = function (options) {
	    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

	    if (options.delay && typeof options.delay == 'number') {
	      options.delay = {
	        show: options.delay,
	        hide: options.delay
	      }
	    }

	    return options
	  }

	  Tooltip.prototype.getDelegateOptions = function () {
	    var options  = {}
	    var defaults = this.getDefaults()

	    this._options && $.each(this._options, function (key, value) {
	      if (defaults[key] != value) options[key] = value
	    })

	    return options
	  }

	  Tooltip.prototype.enter = function (obj) {
	    var self = obj instanceof this.constructor ?
	      obj : $(obj.currentTarget).data('bs.' + this.type)

	    if (self && self.$tip && self.$tip.is(':visible')) {
	      self.hoverState = 'in'
	      return
	    }

	    if (!self) {
	      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
	      $(obj.currentTarget).data('bs.' + this.type, self)
	    }

	    clearTimeout(self.timeout)

	    self.hoverState = 'in'

	    if (!self.options.delay || !self.options.delay.show) return self.show()

	    self.timeout = setTimeout(function () {
	      if (self.hoverState == 'in') self.show()
	    }, self.options.delay.show)
	  }

	  Tooltip.prototype.leave = function (obj) {
	    var self = obj instanceof this.constructor ?
	      obj : $(obj.currentTarget).data('bs.' + this.type)

	    if (!self) {
	      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
	      $(obj.currentTarget).data('bs.' + this.type, self)
	    }

	    clearTimeout(self.timeout)

	    self.hoverState = 'out'

	    if (!self.options.delay || !self.options.delay.hide) return self.hide()

	    self.timeout = setTimeout(function () {
	      if (self.hoverState == 'out') self.hide()
	    }, self.options.delay.hide)
	  }

	  Tooltip.prototype.show = function () {
	    var e = $.Event('show.bs.' + this.type)

	    if (this.hasContent() && this.enabled) {
	      this.$element.trigger(e)

	      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
	      if (e.isDefaultPrevented() || !inDom) return
	      var that = this

	      var $tip = this.tip()

	      var tipId = this.getUID(this.type)

	      this.setContent()
	      $tip.attr('id', tipId)
	      this.$element.attr('aria-describedby', tipId)

	      if (this.options.animation) $tip.addClass('fade')

	      var placement = typeof this.options.placement == 'function' ?
	        this.options.placement.call(this, $tip[0], this.$element[0]) :
	        this.options.placement

	      var autoToken = /\s?auto?\s?/i
	      var autoPlace = autoToken.test(placement)
	      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

	      $tip
	        .detach()
	        .css({ top: 0, left: 0, display: 'block' })
	        .addClass(placement)
	        .data('bs.' + this.type, this)

	      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

	      var pos          = this.getPosition()
	      var actualWidth  = $tip[0].offsetWidth
	      var actualHeight = $tip[0].offsetHeight

	      if (autoPlace) {
	        var orgPlacement = placement
	        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
	        var containerDim = this.getPosition($container)

	        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
	                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
	                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
	                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
	                    placement

	        $tip
	          .removeClass(orgPlacement)
	          .addClass(placement)
	      }

	      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

	      this.applyPlacement(calculatedOffset, placement)

	      var complete = function () {
	        var prevHoverState = that.hoverState
	        that.$element.trigger('shown.bs.' + that.type)
	        that.hoverState = null

	        if (prevHoverState == 'out') that.leave(that)
	      }

	      $.support.transition && this.$tip.hasClass('fade') ?
	        $tip
	          .one('bsTransitionEnd', complete)
	          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
	        complete()
	    }
	  }

	  Tooltip.prototype.applyPlacement = function (offset, placement) {
	    var $tip   = this.tip()
	    var width  = $tip[0].offsetWidth
	    var height = $tip[0].offsetHeight

	    // manually read margins because getBoundingClientRect includes difference
	    var marginTop = parseInt($tip.css('margin-top'), 10)
	    var marginLeft = parseInt($tip.css('margin-left'), 10)

	    // we must check for NaN for ie 8/9
	    if (isNaN(marginTop))  marginTop  = 0
	    if (isNaN(marginLeft)) marginLeft = 0

	    offset.top  = offset.top  + marginTop
	    offset.left = offset.left + marginLeft

	    // $.fn.offset doesn't round pixel values
	    // so we use setOffset directly with our own function B-0
	    $.offset.setOffset($tip[0], $.extend({
	      using: function (props) {
	        $tip.css({
	          top: Math.round(props.top),
	          left: Math.round(props.left)
	        })
	      }
	    }, offset), 0)

	    $tip.addClass('in')

	    // check to see if placing tip in new offset caused the tip to resize itself
	    var actualWidth  = $tip[0].offsetWidth
	    var actualHeight = $tip[0].offsetHeight

	    if (placement == 'top' && actualHeight != height) {
	      offset.top = offset.top + height - actualHeight
	    }

	    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

	    if (delta.left) offset.left += delta.left
	    else offset.top += delta.top

	    var isVertical          = /top|bottom/.test(placement)
	    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
	    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

	    $tip.offset(offset)
	    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
	  }

	  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
	    this.arrow()
	      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
	      .css(isVertical ? 'top' : 'left', '')
	  }

	  Tooltip.prototype.setContent = function () {
	    var $tip  = this.tip()
	    var title = this.getTitle()

	    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
	    $tip.removeClass('fade in top bottom left right')
	  }

	  Tooltip.prototype.hide = function (callback) {
	    var that = this
	    var $tip = $(this.$tip)
	    var e    = $.Event('hide.bs.' + this.type)

	    function complete() {
	      if (that.hoverState != 'in') $tip.detach()
	      that.$element
	        .removeAttr('aria-describedby')
	        .trigger('hidden.bs.' + that.type)
	      callback && callback()
	    }

	    this.$element.trigger(e)

	    if (e.isDefaultPrevented()) return

	    $tip.removeClass('in')

	    $.support.transition && $tip.hasClass('fade') ?
	      $tip
	        .one('bsTransitionEnd', complete)
	        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
	      complete()

	    this.hoverState = null

	    return this
	  }

	  Tooltip.prototype.fixTitle = function () {
	    var $e = this.$element
	    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
	      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
	    }
	  }

	  Tooltip.prototype.hasContent = function () {
	    return this.getTitle()
	  }

	  Tooltip.prototype.getPosition = function ($element) {
	    $element   = $element || this.$element

	    var el     = $element[0]
	    var isBody = el.tagName == 'BODY'

	    var elRect    = el.getBoundingClientRect()
	    if (elRect.width == null) {
	      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
	      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
	    }
	    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
	    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
	    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

	    return $.extend({}, elRect, scroll, outerDims, elOffset)
	  }

	  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
	    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
	           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
	           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
	        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

	  }

	  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
	    var delta = { top: 0, left: 0 }
	    if (!this.$viewport) return delta

	    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
	    var viewportDimensions = this.getPosition(this.$viewport)

	    if (/right|left/.test(placement)) {
	      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
	      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
	      if (topEdgeOffset < viewportDimensions.top) { // top overflow
	        delta.top = viewportDimensions.top - topEdgeOffset
	      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
	        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
	      }
	    } else {
	      var leftEdgeOffset  = pos.left - viewportPadding
	      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
	      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
	        delta.left = viewportDimensions.left - leftEdgeOffset
	      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
	        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
	      }
	    }

	    return delta
	  }

	  Tooltip.prototype.getTitle = function () {
	    var title
	    var $e = this.$element
	    var o  = this.options

	    title = $e.attr('data-original-title')
	      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

	    return title
	  }

	  Tooltip.prototype.getUID = function (prefix) {
	    do prefix += ~~(Math.random() * 1000000)
	    while (document.getElementById(prefix))
	    return prefix
	  }

	  Tooltip.prototype.tip = function () {
	    return (this.$tip = this.$tip || $(this.options.template))
	  }

	  Tooltip.prototype.arrow = function () {
	    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
	  }

	  Tooltip.prototype.enable = function () {
	    this.enabled = true
	  }

	  Tooltip.prototype.disable = function () {
	    this.enabled = false
	  }

	  Tooltip.prototype.toggleEnabled = function () {
	    this.enabled = !this.enabled
	  }

	  Tooltip.prototype.toggle = function (e) {
	    var self = this
	    if (e) {
	      self = $(e.currentTarget).data('bs.' + this.type)
	      if (!self) {
	        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
	        $(e.currentTarget).data('bs.' + this.type, self)
	      }
	    }

	    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
	  }

	  Tooltip.prototype.destroy = function () {
	    var that = this
	    clearTimeout(this.timeout)
	    this.hide(function () {
	      that.$element.off('.' + that.type).removeData('bs.' + that.type)
	    })
	  }


	  // TOOLTIP PLUGIN DEFINITION
	  // =========================

	  function Plugin(option) {
	    return this.each(function () {
	      var $this   = $(this)
	      var data    = $this.data('bs.tooltip')
	      var options = typeof option == 'object' && option

	      if (!data && /destroy|hide/.test(option)) return
	      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
	      if (typeof option == 'string') data[option]()
	    })
	  }

	  var old = $.fn.tooltip

	  $.fn.tooltip             = Plugin
	  $.fn.tooltip.Constructor = Tooltip


	  // TOOLTIP NO CONFLICT
	  // ===================

	  $.fn.tooltip.noConflict = function () {
	    $.fn.tooltip = old
	    return this
	  }

	}(jQuery);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
	 * Bootstrap: modal.js v3.3.4
	 * http://getbootstrap.com/javascript/#modals
	 * ========================================================================
	 * Copyright 2011-2015 Twitter, Inc.
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
	 * ======================================================================== */


	+function ($) {
	  'use strict';

	  // MODAL CLASS DEFINITION
	  // ======================

	  var Modal = function (element, options) {
	    this.options             = options
	    this.$body               = $(document.body)
	    this.$element            = $(element)
	    this.$dialog             = this.$element.find('.modal-dialog')
	    this.$backdrop           = null
	    this.isShown             = null
	    this.originalBodyPad     = null
	    this.scrollbarWidth      = 0
	    this.ignoreBackdropClick = false

	    if (this.options.remote) {
	      this.$element
	        .find('.modal-content')
	        .load(this.options.remote, $.proxy(function () {
	          this.$element.trigger('loaded.bs.modal')
	        }, this))
	    }
	  }

	  Modal.VERSION  = '3.3.4'

	  Modal.TRANSITION_DURATION = 300
	  Modal.BACKDROP_TRANSITION_DURATION = 150

	  Modal.DEFAULTS = {
	    backdrop: true,
	    keyboard: true,
	    show: true
	  }

	  Modal.prototype.toggle = function (_relatedTarget) {
	    return this.isShown ? this.hide() : this.show(_relatedTarget)
	  }

	  Modal.prototype.show = function (_relatedTarget) {
	    var that = this
	    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

	    this.$element.trigger(e)

	    if (this.isShown || e.isDefaultPrevented()) return

	    this.isShown = true

	    this.checkScrollbar()
	    this.setScrollbar()
	    this.$body.addClass('modal-open')

	    this.escape()
	    this.resize()

	    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

	    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
	      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
	        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
	      })
	    })

	    this.backdrop(function () {
	      var transition = $.support.transition && that.$element.hasClass('fade')

	      if (!that.$element.parent().length) {
	        that.$element.appendTo(that.$body) // don't move modals dom position
	      }

	      that.$element
	        .show()
	        .scrollTop(0)

	      that.adjustDialog()

	      if (transition) {
	        that.$element[0].offsetWidth // force reflow
	      }

	      that.$element
	        .addClass('in')
	        .attr('aria-hidden', false)

	      that.enforceFocus()

	      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

	      transition ?
	        that.$dialog // wait for modal to slide in
	          .one('bsTransitionEnd', function () {
	            that.$element.trigger('focus').trigger(e)
	          })
	          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
	        that.$element.trigger('focus').trigger(e)
	    })
	  }

	  Modal.prototype.hide = function (e) {
	    if (e) e.preventDefault()

	    e = $.Event('hide.bs.modal')

	    this.$element.trigger(e)

	    if (!this.isShown || e.isDefaultPrevented()) return

	    this.isShown = false

	    this.escape()
	    this.resize()

	    $(document).off('focusin.bs.modal')

	    this.$element
	      .removeClass('in')
	      .attr('aria-hidden', true)
	      .off('click.dismiss.bs.modal')
	      .off('mouseup.dismiss.bs.modal')

	    this.$dialog.off('mousedown.dismiss.bs.modal')

	    $.support.transition && this.$element.hasClass('fade') ?
	      this.$element
	        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
	        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
	      this.hideModal()
	  }

	  Modal.prototype.enforceFocus = function () {
	    $(document)
	      .off('focusin.bs.modal') // guard against infinite focus loop
	      .on('focusin.bs.modal', $.proxy(function (e) {
	        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
	          this.$element.trigger('focus')
	        }
	      }, this))
	  }

	  Modal.prototype.escape = function () {
	    if (this.isShown && this.options.keyboard) {
	      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
	        e.which == 27 && this.hide()
	      }, this))
	    } else if (!this.isShown) {
	      this.$element.off('keydown.dismiss.bs.modal')
	    }
	  }

	  Modal.prototype.resize = function () {
	    if (this.isShown) {
	      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
	    } else {
	      $(window).off('resize.bs.modal')
	    }
	  }

	  Modal.prototype.hideModal = function () {
	    var that = this
	    this.$element.hide()
	    this.backdrop(function () {
	      that.$body.removeClass('modal-open')
	      that.resetAdjustments()
	      that.resetScrollbar()
	      that.$element.trigger('hidden.bs.modal')
	    })
	  }

	  Modal.prototype.removeBackdrop = function () {
	    this.$backdrop && this.$backdrop.remove()
	    this.$backdrop = null
	  }

	  Modal.prototype.backdrop = function (callback) {
	    var that = this
	    var animate = this.$element.hasClass('fade') ? 'fade' : ''

	    if (this.isShown && this.options.backdrop) {
	      var doAnimate = $.support.transition && animate

	      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
	        .appendTo(this.$body)

	      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
	        if (this.ignoreBackdropClick) {
	          this.ignoreBackdropClick = false
	          return
	        }
	        if (e.target !== e.currentTarget) return
	        this.options.backdrop == 'static'
	          ? this.$element[0].focus()
	          : this.hide()
	      }, this))

	      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

	      this.$backdrop.addClass('in')

	      if (!callback) return

	      doAnimate ?
	        this.$backdrop
	          .one('bsTransitionEnd', callback)
	          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
	        callback()

	    } else if (!this.isShown && this.$backdrop) {
	      this.$backdrop.removeClass('in')

	      var callbackRemove = function () {
	        that.removeBackdrop()
	        callback && callback()
	      }
	      $.support.transition && this.$element.hasClass('fade') ?
	        this.$backdrop
	          .one('bsTransitionEnd', callbackRemove)
	          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
	        callbackRemove()

	    } else if (callback) {
	      callback()
	    }
	  }

	  // these following methods are used to handle overflowing modals

	  Modal.prototype.handleUpdate = function () {
	    this.adjustDialog()
	  }

	  Modal.prototype.adjustDialog = function () {
	    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

	    this.$element.css({
	      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
	      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
	    })
	  }

	  Modal.prototype.resetAdjustments = function () {
	    this.$element.css({
	      paddingLeft: '',
	      paddingRight: ''
	    })
	  }

	  Modal.prototype.checkScrollbar = function () {
	    var fullWindowWidth = window.innerWidth
	    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
	      var documentElementRect = document.documentElement.getBoundingClientRect()
	      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
	    }
	    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
	    this.scrollbarWidth = this.measureScrollbar()
	  }

	  Modal.prototype.setScrollbar = function () {
	    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
	    this.originalBodyPad = document.body.style.paddingRight || ''
	    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
	  }

	  Modal.prototype.resetScrollbar = function () {
	    this.$body.css('padding-right', this.originalBodyPad)
	  }

	  Modal.prototype.measureScrollbar = function () { // thx walsh
	    var scrollDiv = document.createElement('div')
	    scrollDiv.className = 'modal-scrollbar-measure'
	    this.$body.append(scrollDiv)
	    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
	    this.$body[0].removeChild(scrollDiv)
	    return scrollbarWidth
	  }


	  // MODAL PLUGIN DEFINITION
	  // =======================

	  function Plugin(option, _relatedTarget) {
	    return this.each(function () {
	      var $this   = $(this)
	      var data    = $this.data('bs.modal')
	      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

	      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
	      if (typeof option == 'string') data[option](_relatedTarget)
	      else if (options.show) data.show(_relatedTarget)
	    })
	  }

	  var old = $.fn.modal

	  $.fn.modal             = Plugin
	  $.fn.modal.Constructor = Modal


	  // MODAL NO CONFLICT
	  // =================

	  $.fn.modal.noConflict = function () {
	    $.fn.modal = old
	    return this
	  }


	  // MODAL DATA-API
	  // ==============

	  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
	    var $this   = $(this)
	    var href    = $this.attr('href')
	    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
	    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

	    if ($this.is('a')) e.preventDefault()

	    $target.one('show.bs.modal', function (showEvent) {
	      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
	      $target.one('hidden.bs.modal', function () {
	        $this.is(':visible') && $this.trigger('focus')
	      })
	    })
	    Plugin.call($target, option, this)
	  })

	}(jQuery);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
	 * Bootstrap: dropdown.js v3.3.4
	 * http://getbootstrap.com/javascript/#dropdowns
	 * ========================================================================
	 * Copyright 2011-2015 Twitter, Inc.
	 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
	 * ======================================================================== */


	+function ($) {
	  'use strict';

	  // DROPDOWN CLASS DEFINITION
	  // =========================

	  var backdrop = '.dropdown-backdrop'
	  var toggle   = '[data-toggle="dropdown"]'
	  var Dropdown = function (element) {
	    $(element).on('click.bs.dropdown', this.toggle)
	  }

	  Dropdown.VERSION = '3.3.4'

	  Dropdown.prototype.toggle = function (e) {
	    var $this = $(this)

	    if ($this.is('.disabled, :disabled')) return

	    var $parent  = getParent($this)
	    var isActive = $parent.hasClass('open')

	    clearMenus()

	    if (!isActive) {
	      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
	        // if mobile we use a backdrop because click events don't delegate
	        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
	      }

	      var relatedTarget = { relatedTarget: this }
	      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

	      if (e.isDefaultPrevented()) return

	      $this
	        .trigger('focus')
	        .attr('aria-expanded', 'true')

	      $parent
	        .toggleClass('open')
	        .trigger('shown.bs.dropdown', relatedTarget)
	    }

	    return false
	  }

	  Dropdown.prototype.keydown = function (e) {
	    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

	    var $this = $(this)

	    e.preventDefault()
	    e.stopPropagation()

	    if ($this.is('.disabled, :disabled')) return

	    var $parent  = getParent($this)
	    var isActive = $parent.hasClass('open')

	    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
	      if (e.which == 27) $parent.find(toggle).trigger('focus')
	      return $this.trigger('click')
	    }

	    var desc = ' li:not(.disabled):visible a'
	    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

	    if (!$items.length) return

	    var index = $items.index(e.target)

	    if (e.which == 38 && index > 0)                 index--                        // up
	    if (e.which == 40 && index < $items.length - 1) index++                        // down
	    if (!~index)                                      index = 0

	    $items.eq(index).trigger('focus')
	  }

	  function clearMenus(e) {
	    if (e && e.which === 3) return
	    $(backdrop).remove()
	    $(toggle).each(function () {
	      var $this         = $(this)
	      var $parent       = getParent($this)
	      var relatedTarget = { relatedTarget: this }

	      if (!$parent.hasClass('open')) return

	      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

	      if (e.isDefaultPrevented()) return

	      $this.attr('aria-expanded', 'false')
	      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
	    })
	  }

	  function getParent($this) {
	    var selector = $this.attr('data-target')

	    if (!selector) {
	      selector = $this.attr('href')
	      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
	    }

	    var $parent = selector && $(selector)

	    return $parent && $parent.length ? $parent : $this.parent()
	  }


	  // DROPDOWN PLUGIN DEFINITION
	  // ==========================

	  function Plugin(option) {
	    return this.each(function () {
	      var $this = $(this)
	      var data  = $this.data('bs.dropdown')

	      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
	      if (typeof option == 'string') data[option].call($this)
	    })
	  }

	  var old = $.fn.dropdown

	  $.fn.dropdown             = Plugin
	  $.fn.dropdown.Constructor = Dropdown


	  // DROPDOWN NO CONFLICT
	  // ====================

	  $.fn.dropdown.noConflict = function () {
	    $.fn.dropdown = old
	    return this
	  }


	  // APPLY TO STANDARD DROPDOWN ELEMENTS
	  // ===================================

	  $(document)
	    .on('click.bs.dropdown.data-api', clearMenus)
	    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
	    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
	    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
	    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
	    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

	}(jQuery);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	
	var getCssProperty = function(elem, prop){
	    if(elem.offsetWidth){
	        return elem.offsetWidth;
	    }else if(window.getComputedStyle){
	        return window.getComputedStyle(elem,null).getPropertyValue(prop);
	    }else if(elem.currentStyle){
	        return elem.currentStyle.getPropertyValue(prop);
	    }else{
	        return elem.style.getPropertyValue(prop);
	    }
	}

	exports.windowWidth = function () {
	    return window.innerWidth
	        ? window.innerWidth
	        : document.documentElement && document.documentElement.clientWidth
	        ? document.documentElement.clientWidth
	        : document.body.clientWidth;
	};

	exports.windowHeight = function () {
	    return window.innerHeight
	        ? window.innerHeight
	        : document.documentElement && document.documentElement.clientHeight
	        ? document.documentElement.clientHeight
	        : document.body.clientHeight;
	};

	exports.scrollTop = function () {
	    return window.pageYOffset
	        ? pageYOffset
	        : document.documentElement && document.documentElement.scrollTop
	        ? document.documentElement.scrollTop
	        : document.body.scrollTop;
	};

	exports.toTop = function(){
	    document.documentElement.scrollTop = document.body.scrollTop =0
	};

	exports.width = function(elem){
	    return getCssProperty(elem, 'width');
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v2.1.4
	 * http://jquery.com/
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 *
	 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2015-04-28T16:01Z
	 */

	(function( global, factory ) {

		if ( typeof module === "object" && typeof module.exports === "object" ) {
			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}

	// Pass this if window is not defined yet
	}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

	// Support: Firefox 18+
	// Can't be in strict mode, several libs including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	//

	var arr = [];

	var slice = arr.slice;

	var concat = arr.concat;

	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var support = {};



	var
		// Use the correct document accordingly with window argument (sandbox)
		document = window.document,

		version = "2.1.4",

		// Define a local copy of jQuery
		jQuery = function( selector, context ) {
			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},

		// Support: Android<4.1
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};

	jQuery.fn = jQuery.prototype = {
		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// Start with an empty selector
		selector: "",

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function() {
			return slice.call( this );
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
			return num != null ?

				// Return just the one element from the set
				( num < 0 ? this[ num + this.length ] : this[ num ] ) :

				// Return all the elements in a clean array
				slice.call( this );
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		// (You can seed the arguments with an array of args, but this is
		// only used internally.)
		each: function( callback, args ) {
			return jQuery.each( this, callback, args );
		},

		map: function( callback ) {
			return this.pushStack( jQuery.map(this, function( elem, i ) {
				return callback.call( elem, i, elem );
			}));
		},

		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},

		first: function() {
			return this.eq( 0 );
		},

		last: function() {
			return this.eq( -1 );
		},

		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
		},

		end: function() {
			return this.prevObject || this.constructor(null);
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend({
		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function( msg ) {
			throw new Error( msg );
		},

		noop: function() {},

		isFunction: function( obj ) {
			return jQuery.type(obj) === "function";
		},

		isArray: Array.isArray,

		isWindow: function( obj ) {
			return obj != null && obj === obj.window;
		},

		isNumeric: function( obj ) {
			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat (#15100)
			return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
		},

		isPlainObject: function( obj ) {
			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not "[object Object]"
			// - DOM nodes
			// - window
			if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
				return false;
			}

			if ( obj.constructor &&
					!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}

			// If the function hasn't returned already, we're confident that
			// |obj| is a plain object, created by {} or constructed with new Object
			return true;
		},

		isEmptyObject: function( obj ) {
			var name;
			for ( name in obj ) {
				return false;
			}
			return true;
		},

		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}
			// Support: Android<4.0, iOS<6 (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call(obj) ] || "object" :
				typeof obj;
		},

		// Evaluates a script in a global context
		globalEval: function( code ) {
			var script,
				indirect = eval;

			code = jQuery.trim( code );

			if ( code ) {
				// If the code includes a valid, prologue position
				// strict mode pragma, execute code by injecting a
				// script tag into the document.
				if ( code.indexOf("use strict") === 1 ) {
					script = document.createElement("script");
					script.text = code;
					document.head.appendChild( script ).parentNode.removeChild( script );
				} else {
				// Otherwise, avoid the DOM node creation, insertion
				// and removal by using an indirect global eval
					indirect( code );
				}
			}
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE9-11+
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},

		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		// args is for internal usage only
		each: function( obj, callback, args ) {
			var value,
				i = 0,
				length = obj.length,
				isArray = isArraylike( obj );

			if ( args ) {
				if ( isArray ) {
					for ( ; i < length; i++ ) {
						value = callback.apply( obj[ i ], args );

						if ( value === false ) {
							break;
						}
					}
				} else {
					for ( i in obj ) {
						value = callback.apply( obj[ i ], args );

						if ( value === false ) {
							break;
						}
					}
				}

			// A special, fast, case for the most common use of each
			} else {
				if ( isArray ) {
					for ( ; i < length; i++ ) {
						value = callback.call( obj[ i ], i, obj[ i ] );

						if ( value === false ) {
							break;
						}
					}
				} else {
					for ( i in obj ) {
						value = callback.call( obj[ i ], i, obj[ i ] );

						if ( value === false ) {
							break;
						}
					}
				}
			}

			return obj;
		},

		// Support: Android<4.1
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];

			if ( arr != null ) {
				if ( isArraylike( Object(arr) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}

			return ret;
		},

		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},

		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;

			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}

			first.length = i;

			return first;
		},

		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var value,
				i = 0,
				length = elems.length,
				isArray = isArraylike( elems ),
				ret = [];

			// Go through the array, translating each of the items to their new values
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}

			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply( [], ret );
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var tmp, args, proxy;

			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}

			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	});

	// Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});

	function isArraylike( obj ) {

		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = "length" in obj && obj.length,
			type = jQuery.type( obj );

		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.nodeType === 1 && length ) {
			return true;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.2.0-pre
	 * http://sizzlejs.com/
	 *
	 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2014-12-16
	 */
	(function( window ) {

	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,

		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,

		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},

		// General-purpose constants
		MAX_NEGATIVE = 1 << 31,

		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// http://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},

		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

		// Regular expressions

		// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
		// http://www.w3.org/TR/css3-syntax/#characters
		characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

		// Loosely modeled on CSS identifier characters
		// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
		// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = characterEncoding.replace( "w", "w#" ),

		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",

		pseudos = ":(" + characterEncoding + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",

		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),

		matchExpr = {
			"ID": new RegExp( "^#(" + characterEncoding + ")" ),
			"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
			"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},

		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,

		rnative = /^[^{]+\{\s*\[native \w/,

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

		rsibling = /[+~]/,
		rescape = /'|\\/g,

		// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},

		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		};

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :

			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}

	function Sizzle( selector, context, results, seed ) {
		var match, elem, m, nodeType,
			// QSA vars
			i, groups, old, nid, newContext, newSelector;

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}

		context = context || document;
		results = results || [];
		nodeType = context.nodeType;

		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

			return results;
		}

		if ( !seed && documentIsHTML ) {

			// Try to shortcut find operations when possible (e.g., not under DocumentFragment)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
				// Speed-up: Sizzle("#ID")
				if ( (m = match[1]) ) {
					if ( nodeType === 9 ) {
						elem = context.getElementById( m );
						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document (jQuery #6963)
						if ( elem && elem.parentNode ) {
							// Handle the case where IE, Opera, and Webkit return items
							// by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}
					} else {
						// Context is not a document
						if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
							contains( context, elem ) && elem.id === m ) {
							results.push( elem );
							return results;
						}
					}

				// Speed-up: Sizzle("TAG")
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Speed-up: Sizzle(".CLASS")
				} else if ( (m = match[3]) && support.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// QSA path
			if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
				nid = old = expando;
				newContext = context;
				newSelector = nodeType !== 1 && selector;

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					groups = tokenize( selector );

					if ( (old = context.getAttribute("id")) ) {
						nid = old.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}
					nid = "[id='" + nid + "'] ";

					i = groups.length;
					while ( i-- ) {
						groups[i] = nid + toSelector( groups[i] );
					}
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
					newSelector = groups.join(",");
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}
		}

		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}

	/**
	 * Create key-value caches of limited size
	 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];

		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}

	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}

	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");

		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}

	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = attrs.length;

		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}

	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				( ~b.sourceIndex || MAX_NEGATIVE ) -
				( ~a.sourceIndex || MAX_NEGATIVE );

		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}

		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;

				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}

	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}

	// Expose support vars for convenience
	support = Sizzle.support = {};

	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, parent,
			doc = node ? node.ownerDocument || node : preferredDoc;

		// If no document and documentElement is available, return
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}

		// Set our document
		document = doc;
		docElem = doc.documentElement;
		parent = doc.defaultView;

		// Support: IE>8
		// If iframe document is assigned to "document" variable and if iframe has been reloaded,
		// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
		// IE6-8 do not support the defaultView property so parent will be undefined
		if ( parent && parent !== parent.top ) {
			// IE11 does not have attachEvent, so all must suffer
			if ( parent.addEventListener ) {
				parent.addEventListener( "unload", unloadHandler, false );
			} else if ( parent.attachEvent ) {
				parent.attachEvent( "onunload", unloadHandler );
			}
		}

		/* Support tests
		---------------------------------------------------------------------- */
		documentIsHTML = !isXML( doc );

		/* Attributes
		---------------------------------------------------------------------- */

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});

		/* getElement(s)By*
		---------------------------------------------------------------------- */

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( doc.createComment("") );
			return !div.getElementsByTagName("*").length;
		});

		// Support: IE<9
		support.getElementsByClassName = rnative.test( doc.getElementsByClassName );

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
		});

		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [ m ] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];

			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}

		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );

				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :

			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			};

		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};

		/* QSA/matchesSelector
		---------------------------------------------------------------------- */

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\f]' msallowcapture=''>" +
					"<option selected=''></option></select>";

				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( div.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}

				// Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
				if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}

				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}

				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibing-combinator selector` fails
				if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});

			assert(function( div ) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = doc.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "name", "D" );

				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( div.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}

		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {

			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );

		// Element contains another
		// Purposefully does not implement inclusive descendent
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};

		/* Sorting
		---------------------------------------------------------------------- */

		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {

			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :

				// Otherwise we know they are disconnected
				1;

			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];

			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === doc ? -1 :
					b === doc ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;

			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}

			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}

			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};

		return doc;
	};

	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};

	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );

		if ( support.matchesSelector && documentIsHTML &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

			try {
				var ret = matches.call( elem, expr );

				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}

		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};

	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};

	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;

		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );

				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}

				return match.slice( 0, 4 );
			},

			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();

				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}

				return match;
			},

			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];

				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}

				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";

				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}

				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},

		filter: {

			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},

			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];

				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},

			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );

					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}

					result += "";

					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},

			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";

				return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :

					function( elem, context, xml ) {
						var cache, outerCache, node, diff, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType;

						if ( parent ) {

							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [ forward ? parent.firstChild : parent.lastChild ];

							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {
								// Seek `elem` from a previously-cached index
								outerCache = parent[ expando ] || (parent[ expando ] = {});
								cache = outerCache[ type ] || [];
								nodeIndex = cache[0] === dirruns && cache[1];
								diff = cache[0] === dirruns && cache[2];
								node = nodeIndex && parent.childNodes[ nodeIndex ];

								while ( (node = ++nodeIndex && node && node[ dir ] ||

									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {

									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										outerCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}

							// Use previously-cached element index if available
							} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
								diff = cache[1];

							// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
							} else {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
										// Cache the index of each encountered element
										if ( useCache ) {
											(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},

			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}

				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}

				return fn;
			}
		},

		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );

				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;

						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),

			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),

			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),

			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},

			"root": function( elem ) {
				return elem === docElem;
			},

			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},

			"disabled": function( elem ) {
				return elem.disabled === true;
			},

			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},

			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},

			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},

			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},

			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},

			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},

			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),

			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),

			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),

			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};

	Expr.pseudos["nth"] = Expr.pseudos["eq"];

	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];

		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while ( soFar ) {

			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}

			matched = false;

			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}

			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}

			if ( !matched ) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};

	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}

	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;

		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :

			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, outerCache,
					newCache = [ dirruns, doneName ];

				// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});
							if ( (oldCache = outerCache[ dir ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								outerCache[ dir ] = newCache;

								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
			};
	}

	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}

	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}

	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;

		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,

				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,

				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

						// ...intermediate processing is necessary
						[] :

						// ...otherwise use results directly
						results :
					matcherIn;

			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}

			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}

			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}

					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

							seed[temp] = !(results[temp] = elem);
						}
					}
				}

			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}

	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];

		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}

		return elementMatcher( matchers );
	}

	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;

				if ( outermost ) {
					outermostContext = context !== document && context;
				}

				// Add elements passing elementMatchers directly to results
				// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context, xml ) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}

					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}

				// Apply set filters to unmatched elements
				matchedCount += i;
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}

					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}

					// Add matches to results
					push.apply( results, setMatched );

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {

						Sizzle.uniqueSort( results );
					}
				}

				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}

	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];

		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}

			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};

	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );

		results = results || [];

		// Try to minimize operations if there is no seed and only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;

				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}

		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;

	// Initialize against the default document
	setDocument();

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}

	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( div ) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( div ) {
		return div.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}

	return Sizzle;

	})( window );



	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[":"] = jQuery.expr.pseudos;
	jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;



	var rneedsContext = jQuery.expr.match.needsContext;

	var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



	var risSimple = /^.[^:#\[\.,]*$/;

	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				/* jshint -W018 */
				return !!qualifier.call( elem, i, elem ) !== not;
			});

		}

		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			});

		}

		if ( typeof qualifier === "string" ) {
			if ( risSimple.test( qualifier ) ) {
				return jQuery.filter( qualifier, elements, not );
			}

			qualifier = jQuery.filter( qualifier, elements );
		}

		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
		});
	}

	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	};

	jQuery.fn.extend({
		find: function( selector ) {
			var i,
				len = this.length,
				ret = [],
				self = this;

			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter(function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				}) );
			}

			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}

			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow(this, selector || [], false) );
		},
		not: function( selector ) {
			return this.pushStack( winnow(this, selector || [], true) );
		},
		is: function( selector ) {
			return !!winnow(
				this,

				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	});


	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,

		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

		init = jQuery.fn.init = function( selector, context ) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}

			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];

				} else {
					match = rquickExpr.exec( selector );
				}

				// Match html or make sure no context is specified for #id
				if ( match && (match[1] || !context) ) {

					// HANDLE: $(html) -> $(array)
					if ( match[1] ) {
						context = context instanceof jQuery ? context[0] : context;

						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[1],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );

						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {
								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );

								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}

						return this;

					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[2] );

						// Support: Blackberry 4.6
						// gEBID returns nodes no longer in the document (#6963)
						if ( elem && elem.parentNode ) {
							// Inject the element directly into the jQuery object
							this.length = 1;
							this[0] = elem;
						}

						this.context = document;
						this.selector = selector;
						return this;
					}

				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || rootjQuery ).find( selector );

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}

			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;

			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return typeof rootjQuery.ready !== "undefined" ?
					rootjQuery.ready( selector ) :
					// Execute immediately if ready is not present
					selector( jQuery );
			}

			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}

			return jQuery.makeArray( selector, this );
		};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery( document );


	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.extend({
		dir: function( elem, dir, until ) {
			var matched = [],
				truncate = until !== undefined;

			while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
				if ( elem.nodeType === 1 ) {
					if ( truncate && jQuery( elem ).is( until ) ) {
						break;
					}
					matched.push( elem );
				}
			}
			return matched;
		},

		sibling: function( n, elem ) {
			var matched = [];

			for ( ; n; n = n.nextSibling ) {
				if ( n.nodeType === 1 && n !== elem ) {
					matched.push( n );
				}
			}

			return matched;
		}
	});

	jQuery.fn.extend({
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;

			return this.filter(function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[i] ) ) {
						return true;
					}
				}
			});
		},

		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
					jQuery( selectors, context || this.context ) :
					0;

			for ( ; i < l; i++ ) {
				for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
					// Always skip document fragments
					if ( cur.nodeType < 11 && (pos ?
						pos.index(cur) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector(cur, selectors)) ) {

						matched.push( cur );
						break;
					}
				}
			}

			return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
		},

		// Determine the position of an element within the set
		index: function( elem ) {

			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}

			// Locate the position of the desired element
			return indexOf.call( this,

				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},

		add: function( selector, context ) {
			return this.pushStack(
				jQuery.unique(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},

		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter(selector)
			);
		}
	});

	function sibling( cur, dir ) {
		while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
		return cur;
	}

	jQuery.each({
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return jQuery.dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return jQuery.dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return jQuery.dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return jQuery.sibling( elem.firstChild );
		},
		contents: function( elem ) {
			return elem.contentDocument || jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );

			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}

			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}

			if ( this.length > 1 ) {
				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.unique( matched );
				}

				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}

			return this.pushStack( matched );
		};
	});
	var rnotwhite = (/\S+/g);



	// String to Object options format cache
	var optionsCache = {};

	// Convert String-formatted options into Object-formatted ones and store in cache
	function createOptions( options ) {
		var object = optionsCache[ options ] = {};
		jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		});
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			( optionsCache[ options ] || createOptions( options ) ) :
			jQuery.extend( {}, options );

		var // Last fire value (for non-forgettable lists)
			memory,
			// Flag to know if list was already fired
			fired,
			// Flag to know if list is currently firing
			firing,
			// First callback to fire (used internally by add and fireWith)
			firingStart,
			// End of the loop when firing
			firingLength,
			// Index of currently firing callback (modified by remove if needed)
			firingIndex,
			// Actual callback list
			list = [],
			// Stack of fire calls for repeatable lists
			stack = !options.once && [],
			// Fire callbacks
			fire = function( data ) {
				memory = options.memory && data;
				fired = true;
				firingIndex = firingStart || 0;
				firingStart = 0;
				firingLength = list.length;
				firing = true;
				for ( ; list && firingIndex < firingLength; firingIndex++ ) {
					if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
						memory = false; // To prevent further calls using add
						break;
					}
				}
				firing = false;
				if ( list ) {
					if ( stack ) {
						if ( stack.length ) {
							fire( stack.shift() );
						}
					} else if ( memory ) {
						list = [];
					} else {
						self.disable();
					}
				}
			},
			// Actual Callbacks object
			self = {
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
						// First, we save the current length
						var start = list.length;
						(function add( args ) {
							jQuery.each( args, function( _, arg ) {
								var type = jQuery.type( arg );
								if ( type === "function" ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && type !== "string" ) {
									// Inspect recursively
									add( arg );
								}
							});
						})( arguments );
						// Do we need to add the callbacks to the
						// current firing batch?
						if ( firing ) {
							firingLength = list.length;
						// With memory, if we're not firing then
						// we should call right away
						} else if ( memory ) {
							firingStart = start;
							fire( memory );
						}
					}
					return this;
				},
				// Remove a callback from the list
				remove: function() {
					if ( list ) {
						jQuery.each( arguments, function( _, arg ) {
							var index;
							while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
								list.splice( index, 1 );
								// Handle firing indexes
								if ( firing ) {
									if ( index <= firingLength ) {
										firingLength--;
									}
									if ( index <= firingIndex ) {
										firingIndex--;
									}
								}
							}
						});
					}
					return this;
				},
				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
				},
				// Remove all callbacks from the list
				empty: function() {
					list = [];
					firingLength = 0;
					return this;
				},
				// Have the list do nothing anymore
				disable: function() {
					list = stack = memory = undefined;
					return this;
				},
				// Is it disabled?
				disabled: function() {
					return !list;
				},
				// Lock the list in its current state
				lock: function() {
					stack = undefined;
					if ( !memory ) {
						self.disable();
					}
					return this;
				},
				// Is it locked?
				locked: function() {
					return !stack;
				},
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( list && ( !fired || stack ) ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						if ( firing ) {
							stack.push( args );
						} else {
							fire( args );
						}
					}
					return this;
				},
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};


	jQuery.extend({

		Deferred: function( func ) {
			var tuples = [
					// action, add listener, listener list, final state
					[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
					[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
					[ "notify", "progress", jQuery.Callbacks("memory") ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
						return jQuery.Deferred(function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
								var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[ tuple[1] ](function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
									}
								});
							});
							fns = null;
						}).promise();
					},
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};

			// Keep pipe for back-compat
			promise.pipe = promise.then;

			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 3 ];

				// promise[ done | fail | progress ] = list.add
				promise[ tuple[1] ] = list.add;

				// Handle state
				if ( stateString ) {
					list.add(function() {
						// state = [ resolved | rejected ]
						state = stateString;

					// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
				}

				// deferred[ resolve | reject | notify ]
				deferred[ tuple[0] ] = function() {
					deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
					return this;
				};
				deferred[ tuple[0] + "With" ] = list.fireWith;
			});

			// Make the deferred a promise
			promise.promise( deferred );

			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function( subordinate /* , ..., subordinateN */ ) {
			var i = 0,
				resolveValues = slice.call( arguments ),
				length = resolveValues.length,

				// the count of uncompleted subordinates
				remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

				// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

				// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ) {
					return function( value ) {
						contexts[ i ] = this;
						values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( values === progressValues ) {
							deferred.notifyWith( contexts, values );
						} else if ( !( --remaining ) ) {
							deferred.resolveWith( contexts, values );
						}
					};
				},

				progressValues, progressContexts, resolveContexts;

			// Add listeners to Deferred subordinates; treat others as resolved
			if ( length > 1 ) {
				progressValues = new Array( length );
				progressContexts = new Array( length );
				resolveContexts = new Array( length );
				for ( ; i < length; i++ ) {
					if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
						resolveValues[ i ].promise()
							.done( updateFunc( i, resolveContexts, resolveValues ) )
							.fail( deferred.reject )
							.progress( updateFunc( i, progressContexts, progressValues ) );
					} else {
						--remaining;
					}
				}
			}

			// If we're not waiting on anything, resolve the master
			if ( !remaining ) {
				deferred.resolveWith( resolveContexts, resolveValues );
			}

			return deferred.promise();
		}
	});


	// The deferred used on DOM ready
	var readyList;

	jQuery.fn.ready = function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	};

	jQuery.extend({
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},

		// Handle when the DOM is ready
		ready: function( wait ) {

			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
				jQuery( document ).off( "ready" );
			}
		}
	});

	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	}

	jQuery.ready.promise = function( obj ) {
		if ( !readyList ) {

			readyList = jQuery.Deferred();

			// Catch cases where $(document).ready() is called after the browser event has already occurred.
			// We once tried to use readyState "interactive" here, but it caused issues like the one
			// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
			if ( document.readyState === "complete" ) {
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				setTimeout( jQuery.ready );

			} else {

				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", completed, false );

				// A fallback to window.onload, that will always work
				window.addEventListener( "load", completed, false );
			}
		}
		return readyList.promise( obj );
	};

	// Kick off the DOM ready check even if the user does not
	jQuery.ready.promise();




	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				len ? fn( elems[0], key ) : emptyGet;
	};


	/**
	 * Determines whether an object can have data
	 */
	jQuery.acceptData = function( owner ) {
		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		/* jshint -W018 */
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};


	function Data() {
		// Support: Android<4,
		// Old WebKit does not have Object.preventExtensions/freeze method,
		// return new empty object instead with no [[set]] accessor
		Object.defineProperty( this.cache = {}, 0, {
			get: function() {
				return {};
			}
		});

		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;
	Data.accepts = jQuery.acceptData;

	Data.prototype = {
		key: function( owner ) {
			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return the key for a frozen object.
			if ( !Data.accepts( owner ) ) {
				return 0;
			}

			var descriptor = {},
				// Check if the owner object already has a cache key
				unlock = owner[ this.expando ];

			// If not, create one
			if ( !unlock ) {
				unlock = Data.uid++;

				// Secure it in a non-enumerable, non-writable property
				try {
					descriptor[ this.expando ] = { value: unlock };
					Object.defineProperties( owner, descriptor );

				// Support: Android<4
				// Fallback to a less secure definition
				} catch ( e ) {
					descriptor[ this.expando ] = unlock;
					jQuery.extend( owner, descriptor );
				}
			}

			// Ensure the cache object
			if ( !this.cache[ unlock ] ) {
				this.cache[ unlock ] = {};
			}

			return unlock;
		},
		set: function( owner, data, value ) {
			var prop,
				// There may be an unlock assigned to this node,
				// if there is no entry for this "owner", create one inline
				// and set the unlock as though an owner entry had always existed
				unlock = this.key( owner ),
				cache = this.cache[ unlock ];

			// Handle: [ owner, key, value ] args
			if ( typeof data === "string" ) {
				cache[ data ] = value;

			// Handle: [ owner, { properties } ] args
			} else {
				// Fresh assignments by object are shallow copied
				if ( jQuery.isEmptyObject( cache ) ) {
					jQuery.extend( this.cache[ unlock ], data );
				// Otherwise, copy the properties one-by-one to the cache object
				} else {
					for ( prop in data ) {
						cache[ prop ] = data[ prop ];
					}
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			// Either a valid cache is found, or will be created.
			// New caches will be created and the unlock returned,
			// allowing direct access to the newly created
			// empty data object. A valid owner object must be provided.
			var cache = this.cache[ this.key( owner ) ];

			return key === undefined ?
				cache : cache[ key ];
		},
		access: function( owner, key, value ) {
			var stored;
			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					((key && typeof key === "string") && value === undefined) ) {

				stored = this.get( owner, key );

				return stored !== undefined ?
					stored : this.get( owner, jQuery.camelCase(key) );
			}

			// [*]When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i, name, camel,
				unlock = this.key( owner ),
				cache = this.cache[ unlock ];

			if ( key === undefined ) {
				this.cache[ unlock ] = {};

			} else {
				// Support array or space separated string of keys
				if ( jQuery.isArray( key ) ) {
					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat( key.map( jQuery.camelCase ) );
				} else {
					camel = jQuery.camelCase( key );
					// Try the string as a key before any manipulation
					if ( key in cache ) {
						name = [ key, camel ];
					} else {
						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = name in cache ?
							[ name ] : ( name.match( rnotwhite ) || [] );
					}
				}

				i = name.length;
				while ( i-- ) {
					delete cache[ name[ i ] ];
				}
			}
		},
		hasData: function( owner ) {
			return !jQuery.isEmptyObject(
				this.cache[ owner[ this.expando ] ] || {}
			);
		},
		discard: function( owner ) {
			if ( owner[ this.expando ] ) {
				delete this.cache[ owner[ this.expando ] ];
			}
		}
	};
	var data_priv = new Data();

	var data_user = new Data();



	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /([A-Z])/g;

	function dataAttr( elem, key, data ) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
			data = elem.getAttribute( name );

			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :
						// Only convert to a number if it doesn't change the string
						+data + "" === data ? +data :
						rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
				} catch( e ) {}

				// Make sure we set the data so it isn't changed later
				data_user.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend({
		hasData: function( elem ) {
			return data_user.hasData( elem ) || data_priv.hasData( elem );
		},

		data: function( elem, name, data ) {
			return data_user.access( elem, name, data );
		},

		removeData: function( elem, name ) {
			data_user.remove( elem, name );
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to data_priv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return data_priv.access( elem, name, data );
		},

		_removeData: function( elem, name ) {
			data_priv.remove( elem, name );
		}
	});

	jQuery.fn.extend({
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;

			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = data_user.get( elem );

					if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {

							// Support: IE11+
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice(5) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						data_priv.set( elem, "hasDataAttrs", true );
					}
				}

				return data;
			}

			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each(function() {
					data_user.set( this, key );
				});
			}

			return access( this, function( value ) {
				var data,
					camelKey = jQuery.camelCase( key );

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {
					// Attempt to get data from the cache
					// with the key as-is
					data = data_user.get( elem, key );
					if ( data !== undefined ) {
						return data;
					}

					// Attempt to get data from the cache
					// with the key camelized
					data = data_user.get( elem, camelKey );
					if ( data !== undefined ) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, camelKey, undefined );
					if ( data !== undefined ) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				this.each(function() {
					// First, attempt to store a copy or reference of any
					// data that might've been store with a camelCased key.
					var data = data_user.get( this, camelKey );

					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					data_user.set( this, camelKey, value );

					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if ( key.indexOf("-") !== -1 && data !== undefined ) {
						data_user.set( this, key, value );
					}
				});
			}, null, value, arguments.length > 1, null, true );
		},

		removeData: function( key ) {
			return this.each(function() {
				data_user.remove( this, key );
			});
		}
	});


	jQuery.extend({
		queue: function( elem, type, data ) {
			var queue;

			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = data_priv.get( elem, type );

				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = data_priv.access( elem, type, jQuery.makeArray(data) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},

		dequeue: function( elem, type ) {
			type = type || "fx";

			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}

			if ( fn ) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}

			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return data_priv.get( elem, key ) || data_priv.access( elem, key, {
				empty: jQuery.Callbacks("once memory").add(function() {
					data_priv.remove( elem, [ type + "queue", key ] );
				})
			});
		}
	});

	jQuery.fn.extend({
		queue: function( type, data ) {
			var setter = 2;

			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}

			if ( arguments.length < setter ) {
				return jQuery.queue( this[0], type );
			}

			return data === undefined ?
				this :
				this.each(function() {
					var queue = jQuery.queue( this, type, data );

					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );

					if ( type === "fx" && queue[0] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				});
		},
		dequeue: function( type ) {
			return this.each(function() {
				jQuery.dequeue( this, type );
			});
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};

			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while ( i-- ) {
				tmp = data_priv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	});
	var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

	var isHidden = function( elem, el ) {
			// isHidden might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
			return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
		};

	var rcheckableType = (/^(?:checkbox|radio)$/i);



	(function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );

		// Support: Safari<=5.1
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );

		div.appendChild( input );

		// Support: Safari<=5.1, Android<4.2
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

		// Support: IE<=11+
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	})();
	var strundefined = typeof undefined;



	support.focusinBubbles = "onfocusin" in window;


	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
		rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		global: {},

		add: function( elem, types, handler, data, selector ) {

			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = data_priv.get( elem );

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if ( !(events = elemData.events) ) {
				events = elemData.events = {};
			}
			if ( !(eventHandle = elemData.handle) ) {
				eventHandle = elemData.handle = function( e ) {
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[t] ) || [];
				type = origType = tmp[1];
				namespaces = ( tmp[2] || "" ).split( "." ).sort();

				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend({
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join(".")
				}, handleObjIn );

				// Init the event handler queue if we're the first
				if ( !(handlers = events[ type ]) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle, false );
						}
					}
				}

				if ( special.add ) {
					special.add.call( elem, handleObj );

					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}

		},

		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {

			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = data_priv.hasData( elem ) && data_priv.get( elem );

			if ( !elemData || !(events = elemData.events) ) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[t] ) || [];
				type = origType = tmp[1];
				namespaces = ( tmp[2] || "" ).split( "." ).sort();

				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}

				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];

					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );

						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
						jQuery.removeEvent( elem, type, elemData.handle );
					}

					delete events[ type ];
				}
			}

			// Remove the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				delete elemData.handle;
				data_priv.remove( elem, "events" );
			}
		},

		trigger: function( event, data, elem, onlyHandlers ) {

			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}

			if ( type.indexOf(".") >= 0 ) {
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf(":") < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join(".");
			event.namespace_re = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
				null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );

			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === (elem.ownerDocument || document) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;

				// jQuery handler
				handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}

				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {

				if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
					jQuery.acceptData( elem ) ) {

					// Call a native DOM method on the target with the same name name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];

						if ( tmp ) {
							elem[ ontype ] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;

						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		dispatch: function( event ) {

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( event );

			var i, j, ret, matched, handleObj,
				handlerQueue = [],
				args = slice.call( arguments ),
				handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;
			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;

				j = 0;
				while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
								.apply( matched.elem, args );

						if ( ret !== undefined ) {
							if ( (event.result = ret) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}

			return event.result;
		},

		handlers: function( event, handlers ) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			// Avoid non-left-click bubbling in Firefox (#3861)
			if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

				for ( ; cur !== this; cur = cur.parentNode || this ) {

					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.disabled !== true || event.type !== "click" ) {
						matches = [];
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if ( matches[ sel ] === undefined ) {
								matches[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) >= 0 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matches[ sel ] ) {
								matches.push( handleObj );
							}
						}
						if ( matches.length ) {
							handlerQueue.push({ elem: cur, handlers: matches });
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if ( delegateCount < handlers.length ) {
				handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
			}

			return handlerQueue;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

		fixHooks: {},

		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function( event, original ) {

				// Add which for key events
				if ( event.which == null ) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks: {
			props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
			filter: function( event, original ) {
				var eventDoc, doc, body,
					button = original.button;

				// Calculate pageX/Y if missing and clientX/Y available
				if ( event.pageX == null && original.clientX != null ) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
					event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !event.which && button !== undefined ) {
					event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
				}

				return event;
			}
		},

		fix: function( event ) {
			if ( event[ jQuery.expando ] ) {
				return event;
			}

			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[ type ];

			if ( !fixHook ) {
				this.fixHooks[ type ] = fixHook =
					rmouseEvent.test( type ) ? this.mouseHooks :
					rkeyEvent.test( type ) ? this.keyHooks :
					{};
			}
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

			event = new jQuery.Event( originalEvent );

			i = copy.length;
			while ( i-- ) {
				prop = copy[ i ];
				event[ prop ] = originalEvent[ prop ];
			}

			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if ( !event.target ) {
				event.target = document;
			}

			// Support: Safari 6.0+, Chrome<28
			// Target should not be a text node (#504, #13143)
			if ( event.target.nodeType === 3 ) {
				event.target = event.target.parentNode;
			}

			return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
		},

		special: {
			load: {
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {
				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},

			beforeunload: {
				postDispatch: function( event ) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		},

		simulate: function( type, elem, event, bubble ) {
			// Piggyback on a donor event to simulate a different one.
			// Fake originalEvent to avoid donor's stopPropagation, but if the
			// simulated event prevents default then we do the same on the donor.
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true,
					originalEvent: {}
				}
			);
			if ( bubble ) {
				jQuery.event.trigger( e, null, elem );
			} else {
				jQuery.event.dispatch.call( elem, e );
			}
			if ( e.isDefaultPrevented() ) {
				event.preventDefault();
			}
		}
	};

	jQuery.removeEvent = function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	};

	jQuery.Event = function( src, props ) {
		// Allow instantiation without the 'new' keyword
		if ( !(this instanceof jQuery.Event) ) {
			return new jQuery.Event( src, props );
		}

		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&
					// Support: Android<4.0
					src.returnValue === false ?
				returnTrue :
				returnFalse;

		// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,

		preventDefault: function() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if ( e && e.preventDefault ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if ( e && e.stopPropagation ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if ( e && e.stopImmediatePropagation ) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// Support: Chrome 15+
	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,

			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;

				// For mousenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	});

	// Support: Firefox, Chrome, Safari
	// Create "bubbling" focus and blur events
	if ( !support.focusinBubbles ) {
		jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
					jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
				};

			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = data_priv.access( doc, fix );

					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = data_priv.access( doc, fix ) - 1;

					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						data_priv.remove( doc, fix );

					} else {
						data_priv.access( doc, fix, attaches );
					}
				}
			};
		});
	}

	jQuery.fn.extend({

		on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
			var origFn, type;

			// Types can be a map of types/handlers
			if ( typeof types === "object" ) {
				// ( types-Object, selector, data )
				if ( typeof selector !== "string" ) {
					// ( types-Object, data )
					data = data || selector;
					selector = undefined;
				}
				for ( type in types ) {
					this.on( type, selector, data, types[ type ], one );
				}
				return this;
			}

			if ( data == null && fn == null ) {
				// ( types, fn )
				fn = selector;
				data = selector = undefined;
			} else if ( fn == null ) {
				if ( typeof selector === "string" ) {
					// ( types, selector, fn )
					fn = data;
					data = undefined;
				} else {
					// ( types, data, fn )
					fn = data;
					data = selector;
					selector = undefined;
				}
			}
			if ( fn === false ) {
				fn = returnFalse;
			} else if ( !fn ) {
				return this;
			}

			if ( one === 1 ) {
				origFn = fn;
				fn = function( event ) {
					// Can use an empty set, since event contains the info
					jQuery().off( event );
					return origFn.apply( this, arguments );
				};
				// Use same guid so caller can remove using origFn
				fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
			}
			return this.each( function() {
				jQuery.event.add( this, types, fn, data, selector );
			});
		},
		one: function( types, selector, data, fn ) {
			return this.on( types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {
				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {
				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each(function() {
				jQuery.event.remove( this, types, fn, selector );
			});
		},

		trigger: function( type, data ) {
			return this.each(function() {
				jQuery.event.trigger( type, data, this );
			});
		},
		triggerHandler: function( type, data ) {
			var elem = this[0];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	});


	var
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
		rtagName = /<([\w:]+)/,
		rhtml = /<|&#?\w+;/,
		rnoInnerhtml = /<(?:script|style|link)/i,
		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptType = /^$|\/(?:java|ecma)script/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

		// We have to close these tags to support XHTML (#13200)
		wrapMap = {

			// Support: IE9
			option: [ 1, "<select multiple='multiple'>", "</select>" ],

			thead: [ 1, "<table>", "</table>" ],
			col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
			tr: [ 2, "<table><tbody>", "</tbody></table>" ],
			td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

			_default: [ 0, "", "" ]
		};

	// Support: IE9
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	// Support: 1.x compatibility
	// Manipulating tables requires a tbody
	function manipulationTarget( elem, content ) {
		return jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

			elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
			elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );

		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute("type");
		}

		return elem;
	}

	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			data_priv.set(
				elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
			);
		}
	}

	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if ( dest.nodeType !== 1 ) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if ( data_priv.hasData( src ) ) {
			pdataOld = data_priv.access( src );
			pdataCur = data_priv.set( dest, pdataOld );
			events = pdataOld.events;

			if ( events ) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}

		// 2. Copy user data
		if ( data_user.hasData( src ) ) {
			udataOld = data_user.access( src );
			udataCur = jQuery.extend( {}, udataOld );

			data_user.set( dest, udataCur );
		}
	}

	function getAll( context, tag ) {
		var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
				context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
				[];

		return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
			jQuery.merge( [ context ], ret ) :
			ret;
	}

	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;

		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}

	jQuery.extend({
		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = jQuery.contains( elem.ownerDocument, elem );

			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {

				// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}

			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );

					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}

			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}

			// Return the cloned set
			return clone;
		},

		buildFragment: function( elems, context, scripts, selection ) {
			var elem, tmp, tag, wrap, contains, j,
				fragment = context.createDocumentFragment(),
				nodes = [],
				i = 0,
				l = elems.length;

			for ( ; i < l; i++ ) {
				elem = elems[ i ];

				if ( elem || elem === 0 ) {

					// Add nodes directly
					if ( jQuery.type( elem ) === "object" ) {
						// Support: QtWebKit, PhantomJS
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

					// Convert non-html into a text node
					} else if ( !rhtml.test( elem ) ) {
						nodes.push( context.createTextNode( elem ) );

					// Convert html into DOM nodes
					} else {
						tmp = tmp || fragment.appendChild( context.createElement("div") );

						// Deserialize a standard representation
						tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
						wrap = wrapMap[ tag ] || wrapMap._default;
						tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

						// Descend through wrappers to the right content
						j = wrap[ 0 ];
						while ( j-- ) {
							tmp = tmp.lastChild;
						}

						// Support: QtWebKit, PhantomJS
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( nodes, tmp.childNodes );

						// Remember the top-level container
						tmp = fragment.firstChild;

						// Ensure the created nodes are orphaned (#12392)
						tmp.textContent = "";
					}
				}
			}

			// Remove wrapper from fragment
			fragment.textContent = "";

			i = 0;
			while ( (elem = nodes[ i++ ]) ) {

				// #4087 - If origin and destination elements are the same, and this is
				// that element, do not do anything
				if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
					continue;
				}

				contains = jQuery.contains( elem.ownerDocument, elem );

				// Append to fragment
				tmp = getAll( fragment.appendChild( elem ), "script" );

				// Preserve script evaluation history
				if ( contains ) {
					setGlobalEval( tmp );
				}

				// Capture executables
				if ( scripts ) {
					j = 0;
					while ( (elem = tmp[ j++ ]) ) {
						if ( rscriptType.test( elem.type || "" ) ) {
							scripts.push( elem );
						}
					}
				}
			}

			return fragment;
		},

		cleanData: function( elems ) {
			var data, elem, type, key,
				special = jQuery.event.special,
				i = 0;

			for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
				if ( jQuery.acceptData( elem ) ) {
					key = elem[ data_priv.expando ];

					if ( key && (data = data_priv.cache[ key ]) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );

								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}
						if ( data_priv.cache[ key ] ) {
							// Discard any remaining `private` data
							delete data_priv.cache[ key ];
						}
					}
				}
				// Discard any remaining `user` data
				delete data_user.cache[ elem[ data_user.expando ] ];
			}
		}
	});

	jQuery.fn.extend({
		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each(function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					});
			}, null, value, arguments.length );
		},

		append: function() {
			return this.domManip( arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			});
		},

		prepend: function() {
			return this.domManip( arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			});
		},

		before: function() {
			return this.domManip( arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			});
		},

		after: function() {
			return this.domManip( arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			});
		},

		remove: function( selector, keepData /* Internal Use Only */ ) {
			var elem,
				elems = selector ? jQuery.filter( selector, this ) : this,
				i = 0;

			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}

			return this;
		},

		empty: function() {
			var elem,
				i = 0;

			for ( ; (elem = this[i]) != null; i++ ) {
				if ( elem.nodeType === 1 ) {

					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map(function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			});
		},

		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;

				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

					value = value.replace( rxhtmlTag, "<$1></$2>" );

					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};

							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}

						elem = 0;

					// If using innerHTML throws an exception, use the fallback method
					} catch( e ) {}
				}

				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},

		replaceWith: function() {
			var arg = arguments[ 0 ];

			// Make the changes, replacing each context element with the new content
			this.domManip( arguments, function( elem ) {
				arg = this.parentNode;

				jQuery.cleanData( getAll( this ) );

				if ( arg ) {
					arg.replaceChild( elem, this );
				}
			});

			// Force removal if there was no new content (e.g., from empty arguments)
			return arg && (arg.length || arg.nodeType) ? this : this.remove();
		},

		detach: function( selector ) {
			return this.remove( selector, true );
		},

		domManip: function( args, callback ) {

			// Flatten any nested arrays
			args = concat.apply( [], args );

			var fragment, first, scripts, hasScripts, node, doc,
				i = 0,
				l = this.length,
				set = this,
				iNoClone = l - 1,
				value = args[ 0 ],
				isFunction = jQuery.isFunction( value );

			// We can't cloneNode fragments that contain checked, in WebKit
			if ( isFunction ||
					( l > 1 && typeof value === "string" &&
						!support.checkClone && rchecked.test( value ) ) ) {
				return this.each(function( index ) {
					var self = set.eq( index );
					if ( isFunction ) {
						args[ 0 ] = value.call( this, index, self.html() );
					}
					self.domManip( args, callback );
				});
			}

			if ( l ) {
				fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
				first = fragment.firstChild;

				if ( fragment.childNodes.length === 1 ) {
					fragment = first;
				}

				if ( first ) {
					scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
					hasScripts = scripts.length;

					// Use the original fragment for the last item instead of the first because it can end up
					// being emptied incorrectly in certain situations (#8070).
					for ( ; i < l; i++ ) {
						node = fragment;

						if ( i !== iNoClone ) {
							node = jQuery.clone( node, true, true );

							// Keep references to cloned scripts for later restoration
							if ( hasScripts ) {
								// Support: QtWebKit
								// jQuery.merge because push.apply(_, arraylike) throws
								jQuery.merge( scripts, getAll( node, "script" ) );
							}
						}

						callback.call( this[ i ], node, i );
					}

					if ( hasScripts ) {
						doc = scripts[ scripts.length - 1 ].ownerDocument;

						// Reenable scripts
						jQuery.map( scripts, restoreScript );

						// Evaluate executable scripts on first document insertion
						for ( i = 0; i < hasScripts; i++ ) {
							node = scripts[ i ];
							if ( rscriptType.test( node.type || "" ) &&
								!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

								if ( node.src ) {
									// Optional AJAX dependency, but won't run scripts if not present
									if ( jQuery._evalUrl ) {
										jQuery._evalUrl( node.src );
									}
								} else {
									jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
								}
							}
						}
					}
				}
			}

			return this;
		}
	});

	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;

			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );

				// Support: QtWebKit
				// .get() because push.apply(_, arraylike) throws
				push.apply( ret, elems.get() );
			}

			return this.pushStack( ret );
		};
	});


	var iframe,
		elemdisplay = {};

	/**
	 * Retrieve the actual display of a element
	 * @param {String} name nodeName of the element
	 * @param {Object} doc Document object
	 */
	// Called only from within defaultDisplay
	function actualDisplay( name, doc ) {
		var style,
			elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

			// getDefaultComputedStyle might be reliably used only on attached element
			display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

				// Use of this method is a temporary fix (more like optimization) until something better comes along,
				// since it was removed from specification and supported only in FF
				style.display : jQuery.css( elem[ 0 ], "display" );

		// We don't have any data stored on the element,
		// so use "detach" method as fast way to get rid of the element
		elem.detach();

		return display;
	}

	/**
	 * Try to determine the default display value of an element
	 * @param {String} nodeName
	 */
	function defaultDisplay( nodeName ) {
		var doc = document,
			display = elemdisplay[ nodeName ];

		if ( !display ) {
			display = actualDisplay( nodeName, doc );

			// If the simple way fails, read from inside an iframe
			if ( display === "none" || !display ) {

				// Use the already-created iframe if possible
				iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

				// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
				doc = iframe[ 0 ].contentDocument;

				// Support: IE
				doc.write();
				doc.close();

				display = actualDisplay( nodeName, doc );
				iframe.detach();
			}

			// Store the correct default display
			elemdisplay[ nodeName ] = display;
		}

		return display;
	}
	var rmargin = (/^margin/);

	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

	var getStyles = function( elem ) {
			// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			if ( elem.ownerDocument.defaultView.opener ) {
				return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
			}

			return window.getComputedStyle( elem, null );
		};



	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') (#12537)
		if ( computed ) {
			ret = computed.getPropertyValue( name ) || computed[ name ];
		}

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// Support: iOS < 6
			// A tribute to the "awesome hack by Dean Edwards"
			// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?
			// Support: IE
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}


	function addGetHookIf( conditionFn, hookFn ) {
		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {
					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return (this.get = hookFn).apply( this, arguments );
			}
		};
	}


	(function() {
		var pixelPositionVal, boxSizingReliableVal,
			docElem = document.documentElement,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );

		if ( !div.style ) {
			return;
		}

		// Support: IE9-11+
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
			"position:absolute";
		container.appendChild( div );

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computePixelPositionAndBoxSizingReliable() {
			div.style.cssText =
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
				"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
				"border:1px;padding:1px;width:4px;position:absolute";
			div.innerHTML = "";
			docElem.appendChild( container );

			var divStyle = window.getComputedStyle( div, null );
			pixelPositionVal = divStyle.top !== "1%";
			boxSizingReliableVal = divStyle.width === "4px";

			docElem.removeChild( container );
		}

		// Support: node.js jsdom
		// Don't assume that getComputedStyle is a property of the global object
		if ( window.getComputedStyle ) {
			jQuery.extend( support, {
				pixelPosition: function() {

					// This test is executed only once but we still do memoizing
					// since we can use the boxSizingReliable pre-computing.
					// No need to check if the test was already performed, though.
					computePixelPositionAndBoxSizingReliable();
					return pixelPositionVal;
				},
				boxSizingReliable: function() {
					if ( boxSizingReliableVal == null ) {
						computePixelPositionAndBoxSizingReliable();
					}
					return boxSizingReliableVal;
				},
				reliableMarginRight: function() {

					// Support: Android 2.3
					// Check if div with explicit width and no margin-right incorrectly
					// gets computed margin-right based on width of container. (#3333)
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// This support function is only executed once so no memoizing is needed.
					var ret,
						marginDiv = div.appendChild( document.createElement( "div" ) );

					// Reset CSS: box-sizing; display; margin; border; padding
					marginDiv.style.cssText = div.style.cssText =
						// Support: Firefox<29, Android 2.3
						// Vendor-prefix box-sizing
						"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
						"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
					marginDiv.style.marginRight = marginDiv.style.width = "0";
					div.style.width = "1px";
					docElem.appendChild( container );

					ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

					docElem.removeChild( container );
					div.removeChild( marginDiv );

					return ret;
				}
			});
		}
	})();


	// A method for quickly swapping in/out CSS properties to get correct calculations.
	jQuery.swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	};


	var
		// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
		rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},

		cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( style, name ) {

		// Shortcut for names that are not vendor prefixed
		if ( name in style ) {
			return name;
		}

		// Check for vendor prefixed names
		var capName = name[0].toUpperCase() + name.slice(1),
			origName = name,
			i = cssPrefixes.length;

		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in style ) {
				return name;
			}
		}

		return origName;
	}

	function setPositiveNumber( elem, value, subtract ) {
		var matches = rnumsplit.exec( value );
		return matches ?
			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
	}

	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i = extra === ( isBorderBox ? "border" : "content" ) ?
			// If we already have the right measurement, avoid augmentation
			4 :
			// Otherwise initialize for horizontal or vertical properties
			name === "width" ? 1 : 0,

			val = 0;

		for ( ; i < 4; i += 2 ) {
			// Both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}

			if ( isBorderBox ) {
				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}

				// At this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {
				// At this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

				// At this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}

		return val;
	}

	function getWidthOrHeight( elem, name, extra ) {

		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles( elem ),
			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {
			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}

			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test(val) ) {
				return val;
			}

			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );

			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}

		// Use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}

	function showHide( elements, show ) {
		var display, elem, hidden,
			values = [],
			index = 0,
			length = elements.length;

		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}

			values[ index ] = data_priv.get( elem, "olddisplay" );
			display = elem.style.display;
			if ( show ) {
				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !values[ index ] && display === "none" ) {
					elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( elem.style.display === "" && isHidden( elem ) ) {
					values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
				}
			} else {
				hidden = isHidden( elem );

				if ( display !== "none" || !hidden ) {
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}

		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for ( index = 0; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
			if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
				elem.style.display = show ? values[ index ] || "" : "none";
			}
		}

		return elements;
	}

	jQuery.extend({

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {

						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},

		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {

			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;

			name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;

				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && (ret = rrelNum.exec( value )) ) {
					value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}

				// If a number, add 'px' to the (except for certain CSS properties)
				if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
					value += "px";
				}

				// Support: IE9-11+
				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
					style[ name ] = value;
				}

			} else {
				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
					return ret;
				}

				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},

		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = jQuery.camelCase( name );

			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}

			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}

			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
			}
			return val;
		}
	});

	jQuery.each([ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
						jQuery.swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						}) :
						getWidthOrHeight( elem, name, extra );
				}
			},

			set: function( elem, value, extra ) {
				var styles = extra && getStyles( elem );
				return setPositiveNumber( elem, value, extra ?
					augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					) : 0
				);
			}
		};
	});

	// Support: Android 2.3
	jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
		function( elem, computed ) {
			if ( computed ) {
				return jQuery.swap( elem, { "display": "inline-block" },
					curCSS, [ elem, "marginRight" ] );
			}
		}
	);

	// These hooks are used by animate to expand properties
	jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},

					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split(" ") : [ value ];

				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}

				return expanded;
			}
		};

		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	});

	jQuery.fn.extend({
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;

				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;

					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}

					return map;
				}

				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		},
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}

			return this.each(function() {
				if ( isHidden( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			});
		}
	});


	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || "swing";
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];

			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];

			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;

			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}

			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;

				if ( tween.elem[ tween.prop ] != null &&
					(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
					return tween.elem[ tween.prop ];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );
				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {
				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};

	// Support: IE9
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		}
	};

	jQuery.fx = Tween.prototype.init;

	// Back Compat <1.8 extension point
	jQuery.fx.step = {};




	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
		rrun = /queueHooks$/,
		animationPrefilters = [ defaultPrefilter ],
		tweeners = {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value ),
					target = tween.cur(),
					parts = rfxnum.exec( value ),
					unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

					// Starting value computation is required for potential unit mismatches
					start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
						rfxnum.exec( jQuery.css( tween.elem, prop ) ),
					scale = 1,
					maxIterations = 20;

				if ( start && start[ 3 ] !== unit ) {
					// Trust units reported by jQuery.css
					unit = unit || start[ 3 ];

					// Make sure we update the tween properties later on
					parts = parts || [];

					// Iteratively approximate from a nonzero starting point
					start = +target || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*.
						// Use string for doubling so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur(),
					// break the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				// Update tween properties
				if ( parts ) {
					start = tween.start = +start || +target || 0;
					tween.unit = unit;
					// If a +=/-= token was provided, we're doing a relative animation
					tween.end = parts[ 1 ] ?
						start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
						+parts[ 2 ];
				}

				return tween;
			} ]
		};

	// Animations created synchronously will run synchronously
	function createFxNow() {
		setTimeout(function() {
			fxNow = undefined;
		});
		return ( fxNow = jQuery.now() );
	}

	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4 ; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}

		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween( value, prop, animation ) {
		var tween,
			collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( (tween = collection[ index ].call( animation, prop, value )) ) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter( elem, props, opts ) {
		/* jshint validthis: true */
		var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHidden( elem ),
			dataShow = data_priv.get( elem, "fxshow" );

		// Handle queue: false promises
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always(function() {
				// Ensure the complete handler is called before this completes
				anim.always(function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				});
			});
		}

		// Height/width overflow pass
		if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE9-10 do not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			display = jQuery.css( elem, "display" );

			// Test default display if display is currently "none"
			checkDisplay = display === "none" ?
				data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

			if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
				style.display = "inline-block";
			}
		}

		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}

		// show/hide pass
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.exec( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {

					// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

			// Any non-fx value stops us from restoring the original display value
			} else {
				display = undefined;
			}
		}

		if ( !jQuery.isEmptyObject( orig ) ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = data_priv.access( elem, "fxshow", {} );
			}

			// Store state if its toggle - enables .stop().toggle() to "reverse"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}
			if ( hidden ) {
				jQuery( elem ).show();
			} else {
				anim.done(function() {
					jQuery( elem ).hide();
				});
			}
			anim.done(function() {
				var prop;

				data_priv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			});
			for ( prop in orig ) {
				tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

				if ( !( prop in dataShow ) ) {
					dataShow[ prop ] = tween.start;
					if ( hidden ) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}

		// If this is a noop like .hide().hide(), restore an overwritten display value
		} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
			style.display = display;
		}
	}

	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}

			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}

			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}

	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = animationPrefilters.length,
			deferred = jQuery.Deferred().always( function() {
				// Don't match elem in the :animated selector
				delete tick.elem;
			}),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
					// Support: Android 2.3
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( percent );
				}

				deferred.notifyWith( elem, [ animation, percent, remaining ]);

				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise({
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, { specialEasing: {} }, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,
						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length ; index++ ) {
						animation.tweens[ index ].run( 1 );
					}

					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			}),
			props = animation.props;

		propFilter( props, animation.opts.specialEasing );

		for ( ; index < length ; index++ ) {
			result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				return result;
			}
		}

		jQuery.map( props, createTween, animation );

		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}

		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			})
		);

		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}

	jQuery.Animation = jQuery.extend( Animation, {

		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.split(" ");
			}

			var prop,
				index = 0,
				length = props.length;

			for ( ; index < length ; index++ ) {
				prop = props[ index ];
				tweeners[ prop ] = tweeners[ prop ] || [];
				tweeners[ prop ].unshift( callback );
			}
		},

		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				animationPrefilters.unshift( callback );
			} else {
				animationPrefilters.push( callback );
			}
		}
	});

	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};

		return opt;
	};

	jQuery.fn.extend({
		fadeTo: function( speed, to, easing, callback ) {

			// Show any hidden elements after setting opacity to 0
			return this.filter( isHidden ).css( "opacity", 0 ).show()

				// Animate to the value specified
				.end().animate({ opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {
					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );

					// Empty animations, or finishing resolves immediately
					if ( empty || data_priv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;

			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};

			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}

			return this.each(function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = data_priv.get( this );

				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}

				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			});
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each(function() {
				var index,
					data = data_priv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue( this, type, [] );

				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}

				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}

				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}

				// Turn off finishing flag
				delete data.finish;
			});
		}
	});

	jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	});

	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown: genFx("show"),
		slideUp: genFx("hide"),
		slideToggle: genFx("toggle"),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	});

	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;

		fxNow = jQuery.now();

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};

	jQuery.fx.interval = 13;

	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};

	jQuery.fx.stop = function() {
		clearInterval( timerId );
		timerId = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	};


	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	};


	(function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );

		input.type = "checkbox";

		// Support: iOS<=5.1, Android<=4.2+
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE<=11+
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: Android<=2.3
		// Options inside disabled selects are incorrectly marked as disabled
		select.disabled = true;
		support.optDisabled = !opt.disabled;

		// Support: IE<=11+
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	})();


	var nodeHook, boolHook,
		attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend({
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},

		removeAttr: function( name ) {
			return this.each(function() {
				jQuery.removeAttr( this, name );
			});
		}
	});

	jQuery.extend({
		attr: function( elem, name, value ) {
			var hooks, ret,
				nType = elem.nodeType;

			// don't get/set attributes on text, comment and attribute nodes
			if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === strundefined ) {
				return jQuery.prop( elem, name, value );
			}

			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[ name ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
			}

			if ( value !== undefined ) {

				if ( value === null ) {
					jQuery.removeAttr( elem, name );

				} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
					return ret;

				} else {
					elem.setAttribute( name, value + "" );
					return value;
				}

			} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				ret = jQuery.find.attr( elem, name );

				// Non-existent attributes return null, we normalize to undefined
				return ret == null ?
					undefined :
					ret;
			}
		},

		removeAttr: function( elem, value ) {
			var name, propName,
				i = 0,
				attrNames = value && value.match( rnotwhite );

			if ( attrNames && elem.nodeType === 1 ) {
				while ( (name = attrNames[i++]) ) {
					propName = jQuery.propFix[ name ] || name;

					// Boolean attributes get special treatment (#10870)
					if ( jQuery.expr.match.bool.test( name ) ) {
						// Set corresponding property to false
						elem[ propName ] = false;
					}

					elem.removeAttribute( name );
				}
			}
		},

		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		}
	});

	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {
				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};
	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;

		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	});




	var rfocusable = /^(?:input|select|textarea|button)$/i;

	jQuery.fn.extend({
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},

		removeProp: function( name ) {
			return this.each(function() {
				delete this[ jQuery.propFix[ name ] || name ];
			});
		}
	});

	jQuery.extend({
		propFix: {
			"for": "htmlFor",
			"class": "className"
		},

		prop: function( elem, name, value ) {
			var ret, hooks, notxml,
				nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

			if ( notxml ) {
				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}

			if ( value !== undefined ) {
				return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
					ret :
					( elem[ name ] = value );

			} else {
				return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
					ret :
					elem[ name ];
			}
		},

		propHooks: {
			tabIndex: {
				get: function( elem ) {
					return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
						elem.tabIndex :
						-1;
				}
			}
		}
	});

	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			}
		};
	}

	jQuery.each([
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	});




	var rclass = /[\t\r\n\f]/g;

	jQuery.fn.extend({
		addClass: function( value ) {
			var classes, elem, cur, clazz, j, finalValue,
				proceed = typeof value === "string" && value,
				i = 0,
				len = this.length;

			if ( jQuery.isFunction( value ) ) {
				return this.each(function( j ) {
					jQuery( this ).addClass( value.call( this, j, this.className ) );
				});
			}

			if ( proceed ) {
				// The disjunction here is for better compressibility (see removeClass)
				classes = ( value || "" ).match( rnotwhite ) || [];

				for ( ; i < len; i++ ) {
					elem = this[ i ];
					cur = elem.nodeType === 1 && ( elem.className ?
						( " " + elem.className + " " ).replace( rclass, " " ) :
						" "
					);

					if ( cur ) {
						j = 0;
						while ( (clazz = classes[j++]) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}

						// only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( elem.className !== finalValue ) {
							elem.className = finalValue;
						}
					}
				}
			}

			return this;
		},

		removeClass: function( value ) {
			var classes, elem, cur, clazz, j, finalValue,
				proceed = arguments.length === 0 || typeof value === "string" && value,
				i = 0,
				len = this.length;

			if ( jQuery.isFunction( value ) ) {
				return this.each(function( j ) {
					jQuery( this ).removeClass( value.call( this, j, this.className ) );
				});
			}
			if ( proceed ) {
				classes = ( value || "" ).match( rnotwhite ) || [];

				for ( ; i < len; i++ ) {
					elem = this[ i ];
					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && ( elem.className ?
						( " " + elem.className + " " ).replace( rclass, " " ) :
						""
					);

					if ( cur ) {
						j = 0;
						while ( (clazz = classes[j++]) ) {
							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = value ? jQuery.trim( cur ) : "";
						if ( elem.className !== finalValue ) {
							elem.className = finalValue;
						}
					}
				}
			}

			return this;
		},

		toggleClass: function( value, stateVal ) {
			var type = typeof value;

			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}

			if ( jQuery.isFunction( value ) ) {
				return this.each(function( i ) {
					jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
				});
			}

			return this.each(function() {
				if ( type === "string" ) {
					// Toggle individual class names
					var className,
						i = 0,
						self = jQuery( this ),
						classNames = value.match( rnotwhite ) || [];

					while ( (className = classNames[ i++ ]) ) {
						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}

				// Toggle whole class name
				} else if ( type === strundefined || type === "boolean" ) {
					if ( this.className ) {
						// store className if set
						data_priv.set( this, "__className__", this.className );
					}

					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
				}
			});
		},

		hasClass: function( selector ) {
			var className = " " + selector + " ",
				i = 0,
				l = this.length;
			for ( ; i < l; i++ ) {
				if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
					return true;
				}
			}

			return false;
		}
	});




	var rreturn = /\r/g;

	jQuery.fn.extend({
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[0];

			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

					if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ?
						// Handle most common string cases
						ret.replace(rreturn, "") :
						// Handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction( value );

			return this.each(function( i ) {
				var val;

				if ( this.nodeType !== 1 ) {
					return;
				}

				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";

				} else if ( typeof val === "number" ) {
					val += "";

				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

				// If set returns undefined, fall back to normal setting
				if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		valHooks: {
			option: {
				get: function( elem ) {
					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :
						// Support: IE10-11+
						// option.text throws exceptions (#14686, #14858)
						jQuery.trim( jQuery.text( elem ) );
				}
			},
			select: {
				get: function( elem ) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one" || index < 0,
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ?
							max :
							one ? index : 0;

					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];

						// IE6-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&
								// Don't return options that are disabled or in a disabled optgroup
								( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
								( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

							// Get the specific value for the option
							value = jQuery( option ).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				},

				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;

					while ( i-- ) {
						option = options[ i ];
						if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
							optionSet = true;
						}
					}

					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	});

	// Radios and checkboxes getter/setter
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute("value") === null ? "on" : elem.value;
			};
		}
	});




	// Return jQuery for attributes-only inclusion


	jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	});

	jQuery.fn.extend({
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		},

		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},

		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
		}
	});


	var nonce = jQuery.now();

	var rquery = (/\?/);



	// Support: Android 2.3
	// Workaround failure to string-cast null input
	jQuery.parseJSON = function( data ) {
		return JSON.parse( data + "" );
	};


	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};


	var
		rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
		rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},

		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),

		// Document location
		ajaxLocation = window.location.href,

		// Segment location into parts
		ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {

		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {

			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

			if ( jQuery.isFunction( func ) ) {
				// For each dataType in the dataTypeExpression
				while ( (dataType = dataTypes[i++]) ) {
					// Prepend if requested
					if ( dataType[0] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

					// Otherwise append
					} else {
						(structure[ dataType ] = structure[ dataType ] || []).push( func );
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

		var inspected = {},
			seekingTransport = ( structure === transports );

		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			});
			return selected;
		}

		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}

		return target;
	}

	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {

		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
			}
		}

		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {
			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}

	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},
			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while ( current ) {

			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}

			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}

			prev = current;
			current = dataTypes.shift();

			if ( current ) {

			// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {

					current = prev;

				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {

					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];

					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {

							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {

								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {
									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];

									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if ( conv !== true ) {

						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s[ "throws" ] ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend({

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: ajaxLocation,
			type: "GET",
			isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /xml/,
				html: /html/,
				json: /json/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?

				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},

		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),

		// Main method
		ajax: function( url, options ) {

			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,
				// URL without anti-cache param
				cacheURL,
				// Response headers
				responseHeadersString,
				responseHeaders,
				// timeout handle
				timeoutTimer,
				// Cross-domain detection vars
				parts,
				// To know if global events are to be dispatched
				fireGlobals,
				// Loop variable
				i,
				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),
				// Callbacks context
				callbackContext = s.context || s,
				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,
				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks("once memory"),
				// Status-dependent callbacks
				statusCode = s.statusCode || {},
				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},
				// The jqXHR state
				state = 0,
				// Default abort message
				strAbort = "canceled",
				// Fake xhr
				jqXHR = {
					readyState: 0,

					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( state === 2 ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( (match = rheaders.exec( responseHeadersString )) ) {
									responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},

					// Raw string
					getAllResponseHeaders: function() {
						return state === 2 ? responseHeadersString : null;
					},

					// Caches the header
					setRequestHeader: function( name, value ) {
						var lname = name.toLowerCase();
						if ( !state ) {
							name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},

					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( !state ) {
							s.mimeType = type;
						}
						return this;
					},

					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( state < 2 ) {
								for ( code in map ) {
									// Lazy-add the new callback in a way that preserves old ones
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							} else {
								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							}
						}
						return this;
					},

					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};

			// Attach deferreds
			deferred.promise( jqXHR ).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;

			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
				.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

			// A cross-domain request is in order when we have a protocol:host:port mismatch
			if ( s.crossDomain == null ) {
				parts = rurl.exec( s.url.toLowerCase() );
				s.crossDomain = !!( parts &&
					( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
						( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
							( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
				);
			}

			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}

			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

			// If request was aborted inside a prefilter, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger("ajaxStart");
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;

			// More options handling for requests with no content
			if ( !s.hasContent ) {

				// If data is available, append data to url
				if ( s.data ) {
					cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					s.url = rts.test( cacheURL ) ?

						// If there is already a '_' parameter, set its value
						cacheURL.replace( rts, "$1_=" + nonce++ ) :

						// Otherwise add one to the end
						cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
				}
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}

			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
					s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);

			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}

			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			for ( i in { success: 1, error: 1, complete: 1 } ) {
				jqXHR[ i ]( s[ i ] );
			}

			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = setTimeout(function() {
						jqXHR.abort("timeout");
					}, s.timeout );
				}

				try {
					state = 1;
					transport.send( requestHeaders, done );
				} catch ( e ) {
					// Propagate exception as error if not done
					if ( state < 2 ) {
						done( -1, e );
					// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}

			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;

				// Called once
				if ( state === 2 ) {
					return;
				}

				// State is "done" now
				state = 2;

				// Clear timeout if it exists
				if ( timeoutTimer ) {
					clearTimeout( timeoutTimer );
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );

				// If successful, handle type chaining
				if ( isSuccess ) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader("Last-Modified");
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader("etag");
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}

					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";

					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";

					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {
					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";

				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}

				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;

				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}

				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			return jqXHR;
		},

		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},

		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	});

	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {
			// Shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			return jQuery.ajax({
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			});
		};
	});


	jQuery._evalUrl = function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	};


	jQuery.fn.extend({
		wrapAll: function( html ) {
			var wrap;

			if ( jQuery.isFunction( html ) ) {
				return this.each(function( i ) {
					jQuery( this ).wrapAll( html.call(this, i) );
				});
			}

			if ( this[ 0 ] ) {

				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}

				wrap.map(function() {
					var elem = this;

					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}

					return elem;
				}).append( this );
			}

			return this;
		},

		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each(function( i ) {
					jQuery( this ).wrapInner( html.call(this, i) );
				});
			}

			return this.each(function() {
				var self = jQuery( this ),
					contents = self.contents();

				if ( contents.length ) {
					contents.wrapAll( html );

				} else {
					self.append( html );
				}
			});
		},

		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );

			return this.each(function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
			});
		},

		unwrap: function() {
			return this.parent().each(function() {
				if ( !jQuery.nodeName( this, "body" ) ) {
					jQuery( this ).replaceWith( this.childNodes );
				}
			}).end();
		}
	});


	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};
	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};




	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams( prefix, obj, traditional, add ) {
		var name;

		if ( jQuery.isArray( obj ) ) {
			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {
					// Treat each array item as a scalar.
					add( prefix, v );

				} else {
					// Item is non-scalar (array or object), encode its numeric index.
					buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
				}
			});

		} else if ( !traditional && jQuery.type( obj ) === "object" ) {
			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}

		} else {
			// Serialize scalar item.
			add( prefix, obj );
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	};

	jQuery.fn.extend({
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map(function() {
				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			})
			.filter(function() {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			})
			.map(function( i, elem ) {
				var val = jQuery( this ).val();

				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val ) {
							return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						}) :
						{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			}).get();
		}
	});


	jQuery.ajaxSettings.xhr = function() {
		try {
			return new XMLHttpRequest();
		} catch( e ) {}
	};

	var xhrId = 0,
		xhrCallbacks = {},
		xhrSuccessStatus = {
			// file protocol always yields status code 0, assume 200
			0: 200,
			// Support: IE9
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();

	// Support: IE9
	// Open requests must be manually aborted on unload (#5280)
	// See https://support.microsoft.com/kb/2856746 for more info
	if ( window.attachEvent ) {
		window.attachEvent( "onunload", function() {
			for ( var key in xhrCallbacks ) {
				xhrCallbacks[ key ]();
			}
		});
	}

	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport(function( options ) {
		var callback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					xhr.open( options.type, options.url, options.async, options.username, options.password );

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}

					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								delete xhrCallbacks[ id ];
								callback = xhr.onload = xhr.onerror = null;

								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {
									complete(
										// file: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,
										// Support: IE9
										// Accessing binary-data responseText throws an exception
										// (#11426)
										typeof xhr.responseText === "string" ? {
											text: xhr.responseText
										} : undefined,
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};

					// Listen to events
					xhr.onload = callback();
					xhr.onerror = callback("error");

					// Create the abort callback
					callback = xhrCallbacks[ id ] = callback("abort");

					try {
						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {
						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},

				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	});




	// Install script dataType
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /(?:java|ecma)script/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	});

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	});

	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {
		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery("<script>").prop({
						async: true,
						charset: s.scriptCharset,
						src: s.url
					}).on(
						"load error",
						callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						}
					);
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	});




	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	});

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
			);

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;

			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};

			// force json dataType
			s.dataTypes[ 0 ] = "json";

			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always(function() {
				// Restore preexisting value
				window[ callbackName ] = overwritten;

				// Save back as free
				if ( s[ callbackName ] ) {
					// make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// save the callback name for future use
					oldCallbacks.push( callbackName );
				}

				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}

				responseContainer = overwritten = undefined;
			});

			// Delegate to script
			return "script";
		}
	});




	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );

		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	};


	// Keep a copy of the old load method
	var _load = jQuery.fn.load;

	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );
		}

		var selector, type, response,
			self = this,
			off = url.indexOf(" ");

		if ( off >= 0 ) {
			selector = jQuery.trim( url.slice( off ) );
			url = url.slice( 0, off );
		}

		// If it's a function
		if ( jQuery.isFunction( params ) ) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax({
				url: url,

				// if "type" variable is undefined, then "GET" method will be used
				type: type,
				dataType: "html",
				data: params
			}).done(function( responseText ) {

				// Save response for use in complete callback
				response = arguments;

				self.html( selector ?

					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

					// Otherwise use the full result
					responseText );

			}).complete( callback && function( jqXHR, status ) {
				self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
			});
		}

		return this;
	};




	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	});




	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};




	var docElem = window.document.documentElement;

	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
	}

	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};

			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;

			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}

			if ( jQuery.isFunction( options ) ) {
				options = options.call( elem, i, curOffset );
			}

			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}

			if ( "using" in options ) {
				options.using.call( elem, props );

			} else {
				curElem.css( props );
			}
		}
	};

	jQuery.fn.extend({
		offset: function( options ) {
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each(function( i ) {
						jQuery.offset.setOffset( this, options, i );
					});
			}

			var docElem, win,
				elem = this[ 0 ],
				box = { top: 0, left: 0 },
				doc = elem && elem.ownerDocument;

			if ( !doc ) {
				return;
			}

			docElem = doc.documentElement;

			// Make sure it's not a disconnected DOM node
			if ( !jQuery.contains( docElem, elem ) ) {
				return box;
			}

			// Support: BlackBerry 5, iOS 3 (original iPhone)
			// If we don't have gBCR, just use 0,0 rather than error
			if ( typeof elem.getBoundingClientRect !== strundefined ) {
				box = elem.getBoundingClientRect();
			}
			win = getWindow( doc );
			return {
				top: box.top + win.pageYOffset - docElem.clientTop,
				left: box.left + win.pageXOffset - docElem.clientLeft
			};
		},

		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}

			var offsetParent, offset,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {
				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();

			} else {
				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},

		offsetParent: function() {
			return this.map(function() {
				var offsetParent = this.offsetParent || docElem;

				while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || docElem;
			});
		}
	});

	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;

		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );

				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}

				if ( win ) {
					win.scrollTo(
						!top ? val : window.pageXOffset,
						top ? val : window.pageYOffset
					);

				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length, null );
		};
	});

	// Support: Safari<7+, Chrome<37+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );
					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	});


	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

				return access( this, function( elem, type, value ) {
					var doc;

					if ( jQuery.isWindow( elem ) ) {
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement[ "client" + name ];
					}

					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}

					return value === undefined ?
						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :

						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable, null );
			};
		});
	});


	// The number of elements contained in the matched element set
	jQuery.fn.size = function() {
		return this.length;
	};

	jQuery.fn.andSelf = jQuery.fn.addBack;




	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}




	var
		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$;

	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( typeof noGlobal === strundefined ) {
		window.jQuery = window.$ = jQuery;
	}




	return jQuery;

	}));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	* Simditor v2.1.9
	* http://simditor.tower.im/
	* 2015-28-04
	*/
	(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module unless amdModuleId is set
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(13),__webpack_require__(20),__webpack_require__(15),__webpack_require__(16)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, SimpleModule, simpleHotkeys, simpleUploader) {
	      return (root['Simditor'] = factory($, SimpleModule, simpleHotkeys, simpleUploader));
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory(require("jquery"),require("simplemodule"),require("simple-hotkeys"),require("simple-uploader"));
	  } else {
	    root['Simditor'] = factory(jQuery,SimpleModule,simple.hotkeys,simple.uploader);
	  }
	}(this, function ($, SimpleModule, simpleHotkeys, simpleUploader) {

	var BlockquoteButton, BoldButton, Button, CodeButton, CodePopover, ColorButton, Formatter, HrButton, ImageButton, ImagePopover, IndentButton, Indentation, InputManager, ItalicButton, Keystroke, LinkButton, LinkPopover, ListButton, OrderListButton, OutdentButton, Popover, Selection, Simditor, SourceButton, StrikethroughButton, TableButton, TitleButton, Toolbar, UnderlineButton, UndoManager, UnorderListButton, Util,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	  slice = [].slice;

	Selection = (function(superClass) {
	  extend(Selection, superClass);

	  function Selection() {
	    return Selection.__super__.constructor.apply(this, arguments);
	  }

	  Selection.pluginName = 'Selection';

	  Selection.prototype._init = function() {
	    this.editor = this._module;
	    return this.sel = document.getSelection();
	  };

	  Selection.prototype.clear = function() {
	    var e;
	    try {
	      return this.sel.removeAllRanges();
	    } catch (_error) {
	      e = _error;
	    }
	  };

	  Selection.prototype.getRange = function() {
	    if (!this.editor.inputManager.focused || !this.sel.rangeCount) {
	      return null;
	    }
	    return this.sel.getRangeAt(0);
	  };

	  Selection.prototype.selectRange = function(range) {
	    this.clear();
	    this.sel.addRange(range);
	    if (!this.editor.inputManager.focused && (this.editor.util.browser.firefox || this.editor.util.browser.msie)) {
	      this.editor.body.focus();
	    }
	    return range;
	  };

	  Selection.prototype.rangeAtEndOf = function(node, range) {
	    var endNode, endNodeLength, result;
	    if (range == null) {
	      range = this.getRange();
	    }
	    if (!((range != null) && range.collapsed)) {
	      return;
	    }
	    node = $(node)[0];
	    endNode = range.endContainer;
	    endNodeLength = this.editor.util.getNodeLength(endNode);
	    if (!(range.endOffset === endNodeLength - 1 && $(endNode).contents().last().is('br')) && range.endOffset !== endNodeLength) {
	      return false;
	    }
	    if (node === endNode) {
	      return true;
	    } else if (!$.contains(node, endNode)) {
	      return false;
	    }
	    result = true;
	    $(endNode).parentsUntil(node).addBack().each((function(_this) {
	      return function(i, n) {
	        var $lastChild, nodes;
	        nodes = $(n).parent().contents().filter(function() {
	          return !(this !== n && this.nodeType === 3 && !this.nodeValue);
	        });
	        $lastChild = nodes.last();
	        if (!($lastChild.get(0) === n || ($lastChild.is('br') && $lastChild.prev().get(0) === n))) {
	          result = false;
	          return false;
	        }
	      };
	    })(this));
	    return result;
	  };

	  Selection.prototype.rangeAtStartOf = function(node, range) {
	    var result, startNode;
	    if (range == null) {
	      range = this.getRange();
	    }
	    if (!((range != null) && range.collapsed)) {
	      return;
	    }
	    node = $(node)[0];
	    startNode = range.startContainer;
	    if (range.startOffset !== 0) {
	      return false;
	    }
	    if (node === startNode) {
	      return true;
	    } else if (!$.contains(node, startNode)) {
	      return false;
	    }
	    result = true;
	    $(startNode).parentsUntil(node).addBack().each((function(_this) {
	      return function(i, n) {
	        var nodes;
	        nodes = $(n).parent().contents().filter(function() {
	          return !(this !== n && this.nodeType === 3 && !this.nodeValue);
	        });
	        if (nodes.first().get(0) !== n) {
	          return result = false;
	        }
	      };
	    })(this));
	    return result;
	  };

	  Selection.prototype.insertNode = function(node, range) {
	    if (range == null) {
	      range = this.getRange();
	    }
	    if (range == null) {
	      return;
	    }
	    node = $(node)[0];
	    range.insertNode(node);
	    return this.setRangeAfter(node, range);
	  };

	  Selection.prototype.setRangeAfter = function(node, range) {
	    if (range == null) {
	      range = this.getRange();
	    }
	    if (range == null) {
	      return;
	    }
	    node = $(node)[0];
	    range.setEndAfter(node);
	    range.collapse(false);
	    return this.selectRange(range);
	  };

	  Selection.prototype.setRangeBefore = function(node, range) {
	    if (range == null) {
	      range = this.getRange();
	    }
	    if (range == null) {
	      return;
	    }
	    node = $(node)[0];
	    range.setEndBefore(node);
	    range.collapse(false);
	    return this.selectRange(range);
	  };

	  Selection.prototype.setRangeAtStartOf = function(node, range) {
	    if (range == null) {
	      range = this.getRange();
	    }
	    node = $(node).get(0);
	    range.setEnd(node, 0);
	    range.collapse(false);
	    return this.selectRange(range);
	  };

	  Selection.prototype.setRangeAtEndOf = function(node, range) {
	    var $lastNode, $node, contents, lastChild, lastText, nodeLength;
	    if (range == null) {
	      range = this.getRange();
	    }
	    $node = $(node);
	    node = $node.get(0);
	    if ($node.is('pre')) {
	      contents = $node.contents();
	      if (contents.length > 0) {
	        lastChild = contents.last();
	        lastText = lastChild.text();
	        if (lastText.charAt(lastText.length - 1) === '\n') {
	          range.setEnd(lastChild[0], this.editor.util.getNodeLength(lastChild[0]) - 1);
	        } else {
	          range.setEnd(lastChild[0], this.editor.util.getNodeLength(lastChild[0]));
	        }
	      } else {
	        range.setEnd(node, 0);
	      }
	    } else {
	      nodeLength = this.editor.util.getNodeLength(node);
	      if (node.nodeType !== 3 && nodeLength > 0) {
	        $lastNode = $(node).contents().last();
	        if ($lastNode.is('br')) {
	          nodeLength -= 1;
	        } else if ($lastNode[0].nodeType !== 3 && this.editor.util.isEmptyNode($lastNode)) {
	          $lastNode.append(this.editor.util.phBr);
	          node = $lastNode[0];
	          nodeLength = 0;
	        }
	      }
	      range.setEnd(node, nodeLength);
	    }
	    range.collapse(false);
	    return this.selectRange(range);
	  };

	  Selection.prototype.deleteRangeContents = function(range) {
	    var endRange, startRange;
	    if (range == null) {
	      range = this.getRange();
	    }
	    startRange = range.cloneRange();
	    endRange = range.cloneRange();
	    startRange.collapse(true);
	    endRange.collapse(false);
	    if (!range.collapsed && this.rangeAtStartOf(this.editor.body, startRange) && this.rangeAtEndOf(this.editor.body, endRange)) {
	      this.editor.body.empty();
	      range.setStart(this.editor.body[0], 0);
	      range.collapse(true);
	      this.selectRange(range);
	    } else {
	      range.deleteContents();
	    }
	    return range;
	  };

	  Selection.prototype.breakBlockEl = function(el, range) {
	    var $el;
	    if (range == null) {
	      range = this.getRange();
	    }
	    $el = $(el);
	    if (!range.collapsed) {
	      return $el;
	    }
	    range.setStartBefore($el.get(0));
	    if (range.collapsed) {
	      return $el;
	    }
	    return $el.before(range.extractContents());
	  };

	  Selection.prototype.save = function(range) {
	    var endCaret, endRange, startCaret;
	    if (range == null) {
	      range = this.getRange();
	    }
	    if (this._selectionSaved) {
	      return;
	    }
	    endRange = range.cloneRange();
	    endRange.collapse(false);
	    startCaret = $('<span/>').addClass('simditor-caret-start');
	    endCaret = $('<span/>').addClass('simditor-caret-end');
	    endRange.insertNode(endCaret[0]);
	    range.insertNode(startCaret[0]);
	    this.clear();
	    return this._selectionSaved = true;
	  };

	  Selection.prototype.restore = function() {
	    var endCaret, endContainer, endOffset, range, startCaret, startContainer, startOffset;
	    if (!this._selectionSaved) {
	      return false;
	    }
	    startCaret = this.editor.body.find('.simditor-caret-start');
	    endCaret = this.editor.body.find('.simditor-caret-end');
	    if (startCaret.length && endCaret.length) {
	      startContainer = startCaret.parent();
	      startOffset = startContainer.contents().index(startCaret);
	      endContainer = endCaret.parent();
	      endOffset = endContainer.contents().index(endCaret);
	      if (startContainer[0] === endContainer[0]) {
	        endOffset -= 1;
	      }
	      range = document.createRange();
	      range.setStart(startContainer.get(0), startOffset);
	      range.setEnd(endContainer.get(0), endOffset);
	      startCaret.remove();
	      endCaret.remove();
	      this.selectRange(range);
	    } else {
	      startCaret.remove();
	      endCaret.remove();
	    }
	    this._selectionSaved = false;
	    return range;
	  };

	  return Selection;

	})(SimpleModule);

	Formatter = (function(superClass) {
	  extend(Formatter, superClass);

	  function Formatter() {
	    return Formatter.__super__.constructor.apply(this, arguments);
	  }

	  Formatter.pluginName = 'Formatter';

	  Formatter.prototype.opts = {
	    allowedTags: null,
	    allowedAttributes: null
	  };

	  Formatter.prototype._init = function() {
	    this.editor = this._module;
	    this._allowedTags = this.opts.allowedTags || ['br', 'a', 'img', 'b', 'strong', 'i', 'u', 'font', 'p', 'ul', 'ol', 'li', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'hr'];
	    this._allowedAttributes = this.opts.allowedAttributes || {
	      img: ['src', 'alt', 'width', 'height', 'data-image-src', 'data-image-size', 'data-image-name', 'data-non-image'],
	      a: ['href', 'target'],
	      font: ['color'],
	      pre: ['data-lang', 'class'],
	      p: ['data-indent'],
	      h1: ['data-indent'],
	      h2: ['data-indent'],
	      h3: ['data-indent'],
	      h4: ['data-indent']
	    };
	    return this.editor.body.on('click', 'a', (function(_this) {
	      return function(e) {
	        return false;
	      };
	    })(this));
	  };

	  Formatter.prototype.decorate = function($el) {
	    if ($el == null) {
	      $el = this.editor.body;
	    }
	    return this.editor.trigger('decorate', [$el]);
	  };

	  Formatter.prototype.undecorate = function($el) {
	    if ($el == null) {
	      $el = this.editor.body.clone();
	    }
	    this.editor.trigger('undecorate', [$el]);
	    return $.trim($el.html());
	  };

	  Formatter.prototype.autolink = function($el) {
	    var $node, findLinkNode, j, lastIndex, len, linkNodes, match, re, replaceEls, text, uri;
	    if ($el == null) {
	      $el = this.editor.body;
	    }
	    linkNodes = [];
	    findLinkNode = function($parentNode) {
	      return $parentNode.contents().each(function(i, node) {
	        var $node, text;
	        $node = $(node);
	        if ($node.is('a') || $node.closest('a, pre', $el).length) {
	          return;
	        }
	        if ($node.contents().length) {
	          return findLinkNode($node);
	        } else if ((text = $node.text()) && /https?:\/\/|www\./ig.test(text)) {
	          return linkNodes.push($node);
	        }
	      });
	    };
	    findLinkNode($el);
	    re = /(https?:\/\/|www\.)[\w\-\.\?&=\/#%:,@\!\+]+/ig;
	    for (j = 0, len = linkNodes.length; j < len; j++) {
	      $node = linkNodes[j];
	      text = $node.text();
	      replaceEls = [];
	      match = null;
	      lastIndex = 0;
	      while ((match = re.exec(text)) !== null) {
	        replaceEls.push(document.createTextNode(text.substring(lastIndex, match.index)));
	        lastIndex = re.lastIndex;
	        uri = /^(http(s)?:\/\/|\/)/.test(match[0]) ? match[0] : 'http://' + match[0];
	        replaceEls.push($('<a href="' + uri + '" rel="nofollow"></a>').text(match[0])[0]);
	      }
	      replaceEls.push(document.createTextNode(text.substring(lastIndex)));
	      $node.replaceWith($(replaceEls));
	    }
	    return $el;
	  };

	  Formatter.prototype.format = function($el) {
	    var $node, blockNode, j, k, len, len1, n, node, ref, ref1;
	    if ($el == null) {
	      $el = this.editor.body;
	    }
	    if ($el.is(':empty')) {
	      $el.append('<p>' + this.editor.util.phBr + '</p>');
	      return $el;
	    }
	    ref = $el.contents();
	    for (j = 0, len = ref.length; j < len; j++) {
	      n = ref[j];
	      this.cleanNode(n, true);
	    }
	    ref1 = $el.contents();
	    for (k = 0, len1 = ref1.length; k < len1; k++) {
	      node = ref1[k];
	      $node = $(node);
	      if ($node.is('br')) {
	        if (typeof blockNode !== "undefined" && blockNode !== null) {
	          blockNode = null;
	        }
	        $node.remove();
	      } else if (this.editor.util.isBlockNode(node)) {
	        if ($node.is('li')) {
	          if (blockNode && blockNode.is('ul, ol')) {
	            blockNode.append(node);
	          } else {
	            blockNode = $('<ul/>').insertBefore(node);
	            blockNode.append(node);
	          }
	        } else {
	          blockNode = null;
	        }
	      } else {
	        if (!blockNode || blockNode.is('ul, ol')) {
	          blockNode = $('<p/>').insertBefore(node);
	        }
	        blockNode.append(node);
	      }
	    }
	    return $el;
	  };

	  Formatter.prototype.cleanNode = function(node, recursive) {
	    var $childImg, $node, $p, $td, allowedAttributes, attr, contents, isDecoration, j, k, len, len1, n, ref, ref1, text, textNode;
	    $node = $(node);
	    if (!($node.length > 0)) {
	      return;
	    }
	    if ($node[0].nodeType === 3) {
	      text = $node.text().replace(/(\r\n|\n|\r)/gm, '');
	      if (text) {
	        textNode = document.createTextNode(text);
	        $node.replaceWith(textNode);
	      } else {
	        $node.remove();
	      }
	      return;
	    }
	    contents = $node.contents();
	    isDecoration = $node.is('[class^="simditor-"]');
	    if ($node.is(this._allowedTags.join(',')) || isDecoration) {
	      if ($node.is('a') && ($childImg = $node.find('img')).length > 0) {
	        $node.replaceWith($childImg);
	        $node = $childImg;
	        contents = null;
	      }
	      if ($node.is('img') && $node.hasClass('uploading')) {
	        $node.remove();
	      }
	      if (!isDecoration) {
	        allowedAttributes = this._allowedAttributes[$node[0].tagName.toLowerCase()];
	        ref = $.makeArray($node[0].attributes);
	        for (j = 0, len = ref.length; j < len; j++) {
	          attr = ref[j];
	          if (!((allowedAttributes != null) && (ref1 = attr.name, indexOf.call(allowedAttributes, ref1) >= 0))) {
	            $node.removeAttr(attr.name);
	          }
	        }
	      }
	    } else if ($node[0].nodeType === 1 && !$node.is(':empty')) {
	      if ($node.is('div, article, dl, header, footer, tr')) {
	        $node.append('<br/>');
	        contents.first().unwrap();
	      } else if ($node.is('table')) {
	        $p = $('<p/>');
	        $node.find('tr').each((function(_this) {
	          return function(i, tr) {
	            return $p.append($(tr).text() + '<br/>');
	          };
	        })(this));
	        $node.replaceWith($p);
	        contents = null;
	      } else if ($node.is('thead, tfoot')) {
	        $node.remove();
	        contents = null;
	      } else if ($node.is('th')) {
	        $td = $('<td/>').append($node.contents());
	        $node.replaceWith($td);
	      } else {
	        contents.first().unwrap();
	      }
	    } else {
	      $node.remove();
	      contents = null;
	    }
	    if (recursive && (contents != null) && !$node.is('pre')) {
	      for (k = 0, len1 = contents.length; k < len1; k++) {
	        n = contents[k];
	        this.cleanNode(n, true);
	      }
	    }
	    return null;
	  };

	  Formatter.prototype.clearHtml = function(html, lineBreak) {
	    var container, contents, result;
	    if (lineBreak == null) {
	      lineBreak = true;
	    }
	    container = $('<div/>').append(html);
	    contents = container.contents();
	    result = '';
	    contents.each((function(_this) {
	      return function(i, node) {
	        var $node, children;
	        if (node.nodeType === 3) {
	          return result += node.nodeValue;
	        } else if (node.nodeType === 1) {
	          $node = $(node);
	          children = $node.contents();
	          if (children.length > 0) {
	            result += _this.clearHtml(children);
	          }
	          if (lineBreak && i < contents.length - 1 && $node.is('br, p, div, li, tr, pre, address, artticle, aside, dl, figcaption, footer, h1, h2, h3, h4, header')) {
	            return result += '\n';
	          }
	        }
	      };
	    })(this));
	    return result;
	  };

	  Formatter.prototype.beautify = function($contents) {
	    var uselessP;
	    uselessP = function($el) {
	      return !!($el.is('p') && !$el.text() && $el.children(':not(br)').length < 1);
	    };
	    return $contents.each((function(_this) {
	      return function(i, el) {
	        var $el;
	        $el = $(el);
	        if ($el.is(':not(img, br, col, td, hr, [class^="simditor-"]):empty')) {
	          $el.remove();
	        }
	        if (uselessP($el)) {
	          $el.remove();
	        }
	        return $el.find(':not(img, br, col, td, hr, [class^="simditor-"]):empty').remove();
	      };
	    })(this));
	  };

	  return Formatter;

	})(SimpleModule);

	InputManager = (function(superClass) {
	  extend(InputManager, superClass);

	  function InputManager() {
	    return InputManager.__super__.constructor.apply(this, arguments);
	  }

	  InputManager.pluginName = 'InputManager';

	  InputManager.prototype.opts = {
	    pasteImage: false
	  };

	  InputManager.prototype._modifierKeys = [16, 17, 18, 91, 93, 224];

	  InputManager.prototype._arrowKeys = [37, 38, 39, 40];

	  InputManager.prototype._init = function() {
	    var submitKey;
	    this.editor = this._module;
	    this.throttledTrigger = this.editor.util.throttle((function(_this) {
	      return function() {
	        var args;
	        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	        return setTimeout(function() {
	          var ref;
	          return (ref = _this.editor).trigger.apply(ref, args);
	        }, 10);
	      };
	    })(this), 300);
	    if (this.opts.pasteImage && typeof this.opts.pasteImage !== 'string') {
	      this.opts.pasteImage = 'inline';
	    }
	    this._keystrokeHandlers = {};
	    this.hotkeys = simpleHotkeys({
	      el: this.editor.body
	    });
	    this._pasteArea = $('<div/>').css({
	      width: '1px',
	      height: '1px',
	      overflow: 'hidden',
	      position: 'fixed',
	      right: '0',
	      bottom: '100px'
	    }).attr({
	      tabIndex: '-1',
	      contentEditable: true
	    }).addClass('simditor-paste-area').appendTo(this.editor.el);
	    $(document).on('selectionchange.simditor' + this.editor.id, (function(_this) {
	      return function(e) {
	        if (!_this.focused) {
	          return;
	        }
	        if (_this._selectionTimer) {
	          clearTimeout(_this._selectionTimer);
	          _this._selectionTimer = null;
	        }
	        return _this._selectionTimer = setTimeout(function() {
	          return _this.editor.trigger('selectionchanged');
	        }, 20);
	      };
	    })(this));
	    this.editor.on('valuechanged', (function(_this) {
	      return function() {
	        if (!_this.editor.util.closestBlockEl() && _this.focused) {
	          _this.editor.selection.save();
	          _this.editor.formatter.format();
	          _this.editor.selection.restore();
	        }
	        _this.editor.body.find('hr, pre, .simditor-table').each(function(i, el) {
	          var $el, formatted;
	          $el = $(el);
	          if ($el.parent().is('blockquote') || $el.parent()[0] === _this.editor.body[0]) {
	            formatted = false;
	            if ($el.next().length === 0) {
	              $('<p/>').append(_this.editor.util.phBr).insertAfter($el);
	              formatted = true;
	            }
	            if ($el.prev().length === 0) {
	              $('<p/>').append(_this.editor.util.phBr).insertBefore($el);
	              formatted = true;
	            }
	            if (formatted) {
	              return setTimeout(function() {
	                return _this.editor.trigger('valuechanged');
	              }, 10);
	            }
	          }
	        });
	        _this.editor.body.find('pre:empty').append(_this.editor.util.phBr);
	        if (!_this.editor.util.support.onselectionchange && _this.focused) {
	          return _this.editor.trigger('selectionchanged');
	        }
	      };
	    })(this));
	    this.editor.on('selectionchanged', (function(_this) {
	      return function(e) {
	        return _this.editor.undoManager.update();
	      };
	    })(this));
	    this.editor.body.on('keydown', $.proxy(this._onKeyDown, this)).on('keypress', $.proxy(this._onKeyPress, this)).on('keyup', $.proxy(this._onKeyUp, this)).on('mouseup', $.proxy(this._onMouseUp, this)).on('focus', $.proxy(this._onFocus, this)).on('blur', $.proxy(this._onBlur, this)).on('paste', $.proxy(this._onPaste, this)).on('drop', $.proxy(this._onDrop, this)).on('input', $.proxy(this._onInput, this));
	    if (this.editor.util.browser.firefox) {
	      this.addShortcut('cmd+left', (function(_this) {
	        return function(e) {
	          e.preventDefault();
	          _this.editor.selection.sel.modify('move', 'backward', 'lineboundary');
	          return false;
	        };
	      })(this));
	      this.addShortcut('cmd+right', (function(_this) {
	        return function(e) {
	          e.preventDefault();
	          _this.editor.selection.sel.modify('move', 'forward', 'lineboundary');
	          return false;
	        };
	      })(this));
	      this.addShortcut('cmd+a', (function(_this) {
	        return function(e) {
	          var $children, firstBlock, lastBlock, range;
	          $children = _this.editor.body.children();
	          if (!($children.length > 0)) {
	            return;
	          }
	          firstBlock = $children.first().get(0);
	          lastBlock = $children.last().get(0);
	          range = document.createRange();
	          range.setStart(firstBlock, 0);
	          range.setEnd(lastBlock, _this.editor.util.getNodeLength(lastBlock));
	          _this.editor.selection.selectRange(range);
	          return false;
	        };
	      })(this));
	    }
	    submitKey = this.editor.util.os.mac ? 'cmd+enter' : 'ctrl+enter';
	    this.addShortcut(submitKey, (function(_this) {
	      return function(e) {
	        _this.editor.el.closest('form').find('button:submit').click();
	        return false;
	      };
	    })(this));
	    if (this.editor.textarea.attr('autofocus')) {
	      return setTimeout((function(_this) {
	        return function() {
	          return _this.editor.focus();
	        };
	      })(this), 0);
	    }
	  };

	  InputManager.prototype._onFocus = function(e) {
	    this.editor.el.addClass('focus').removeClass('error');
	    this.focused = true;
	    this.lastCaretPosition = null;
	    return setTimeout((function(_this) {
	      return function() {
	        _this.editor.triggerHandler('focus');
	        return _this.editor.trigger('selectionchanged');
	      };
	    })(this), 0);
	  };

	  InputManager.prototype._onBlur = function(e) {
	    var ref;
	    this.editor.el.removeClass('focus');
	    this.editor.sync();
	    this.focused = false;
	    this.lastCaretPosition = (ref = this.editor.undoManager.currentState()) != null ? ref.caret : void 0;
	    return this.editor.triggerHandler('blur');
	  };

	  InputManager.prototype._onMouseUp = function(e) {
	    if (!this.editor.util.support.onselectionchange) {
	      return setTimeout((function(_this) {
	        return function() {
	          return _this.editor.trigger('selectionchanged');
	        };
	      })(this), 0);
	    }
	  };

	  InputManager.prototype._onKeyDown = function(e) {
	    var base, ref, ref1, result;
	    if (this.editor.triggerHandler(e) === false) {
	      return false;
	    }
	    if (this.hotkeys.respondTo(e)) {
	      return;
	    }
	    if (e.which in this._keystrokeHandlers) {
	      result = typeof (base = this._keystrokeHandlers[e.which])['*'] === "function" ? base['*'](e) : void 0;
	      if (result) {
	        this.editor.trigger('valuechanged');
	        return false;
	      }
	      this.editor.util.traverseUp((function(_this) {
	        return function(node) {
	          var handler, ref;
	          if (node.nodeType !== document.ELEMENT_NODE) {
	            return;
	          }
	          handler = (ref = _this._keystrokeHandlers[e.which]) != null ? ref[node.tagName.toLowerCase()] : void 0;
	          result = typeof handler === "function" ? handler(e, $(node)) : void 0;
	          if (result === true || result === false) {
	            return false;
	          }
	        };
	      })(this));
	      if (result) {
	        this.editor.trigger('valuechanged');
	        return false;
	      }
	    }
	    if ((ref = e.which, indexOf.call(this._modifierKeys, ref) >= 0) || (ref1 = e.which, indexOf.call(this._arrowKeys, ref1) >= 0)) {
	      return;
	    }
	    if (this.editor.util.metaKey(e) && e.which === 86) {
	      return;
	    }
	    if (!this.editor.util.support.oninput) {
	      this.throttledTrigger('valuechanged', ['typing']);
	    }
	    return null;
	  };

	  InputManager.prototype._onKeyPress = function(e) {
	    if (this.editor.triggerHandler(e) === false) {
	      return false;
	    }
	  };

	  InputManager.prototype._onKeyUp = function(e) {
	    var p, ref;
	    if (this.editor.triggerHandler(e) === false) {
	      return false;
	    }
	    if (!this.editor.util.support.onselectionchange && (ref = e.which, indexOf.call(this._arrowKeys, ref) >= 0)) {
	      this.editor.trigger('selectionchanged');
	      return;
	    }
	    if ((e.which === 8 || e.which === 46) && this.editor.util.isEmptyNode(this.editor.body)) {
	      this.editor.body.empty();
	      p = $('<p/>').append(this.editor.util.phBr).appendTo(this.editor.body);
	      this.editor.selection.setRangeAtStartOf(p);
	    }
	  };

	  InputManager.prototype._onPaste = function(e) {
	    var $blockEl, cleanPaste, imageFile, pasteContent, pasteItem, processPasteContent, range, ref, uploadOpt;
	    if (this.editor.triggerHandler(e) === false) {
	      return false;
	    }
	    range = this.editor.selection.deleteRangeContents();
	    if (!range.collapsed) {
	      range.collapse(true);
	    }
	    $blockEl = this.editor.util.closestBlockEl();
	    cleanPaste = $blockEl.is('pre, table');
	    if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.items && e.originalEvent.clipboardData.items.length > 0) {
	      pasteItem = e.originalEvent.clipboardData.items[0];
	      if (/^image\//.test(pasteItem.type) && !cleanPaste) {
	        imageFile = pasteItem.getAsFile();
	        if (!((imageFile != null) && this.opts.pasteImage)) {
	          return;
	        }
	        if (!imageFile.name) {
	          imageFile.name = "Clipboard Image.png";
	        }
	        uploadOpt = {};
	        uploadOpt[this.opts.pasteImage] = true;
	        if ((ref = this.editor.uploader) != null) {
	          ref.upload(imageFile, uploadOpt);
	        }
	        return false;
	      }
	    }
	    processPasteContent = (function(_this) {
	      return function(pasteContent) {
	        var $img, blob, children, insertPosition, j, k, l, lastLine, len, len1, len2, len3, len4, line, lines, m, node, o, ref1, ref2, ref3;
	        if (_this.editor.triggerHandler('pasting', [pasteContent]) === false) {
	          return;
	        }
	        if (!pasteContent) {
	          return;
	        } else if (cleanPaste) {
	          if ($blockEl.is('table')) {
	            lines = pasteContent.split('\n');
	            lastLine = lines.pop();
	            for (j = 0, len = lines.length; j < len; j++) {
	              line = lines[j];
	              _this.editor.selection.insertNode(document.createTextNode(line));
	              _this.editor.selection.insertNode($('<br/>'));
	            }
	            _this.editor.selection.insertNode(document.createTextNode(lastLine));
	          } else {
	            pasteContent = $('<div/>').text(pasteContent);
	            ref1 = pasteContent.contents();
	            for (k = 0, len1 = ref1.length; k < len1; k++) {
	              node = ref1[k];
	              _this.editor.selection.insertNode($(node)[0], range);
	            }
	          }
	        } else if ($blockEl.is(_this.editor.body)) {
	          for (l = 0, len2 = pasteContent.length; l < len2; l++) {
	            node = pasteContent[l];
	            _this.editor.selection.insertNode(node, range);
	          }
	        } else if (pasteContent.length < 1) {
	          return;
	        } else if (pasteContent.length === 1) {
	          if (pasteContent.is('p')) {
	            children = pasteContent.contents();
	            if (children.length === 1 && children.is('img')) {
	              $img = children;
	              if (/^data:image/.test($img.attr('src'))) {
	                if (!_this.opts.pasteImage) {
	                  return;
	                }
	                blob = _this.editor.util.dataURLtoBlob($img.attr("src"));
	                blob.name = "Clipboard Image.png";
	                uploadOpt = {};
	                uploadOpt[_this.opts.pasteImage] = true;
	                if ((ref2 = _this.editor.uploader) != null) {
	                  ref2.upload(blob, uploadOpt);
	                }
	                return;
	              } else if ($img.is('img[src^="webkit-fake-url://"]')) {
	                return;
	              }
	            }
	            for (m = 0, len3 = children.length; m < len3; m++) {
	              node = children[m];
	              _this.editor.selection.insertNode(node, range);
	            }
	          } else if ($blockEl.is('p') && _this.editor.util.isEmptyNode($blockEl)) {
	            $blockEl.replaceWith(pasteContent);
	            _this.editor.selection.setRangeAtEndOf(pasteContent, range);
	          } else if (pasteContent.is('ul, ol')) {
	            if (pasteContent.find('li').length === 1) {
	              pasteContent = $('<div/>').text(pasteContent.text());
	              ref3 = pasteContent.contents();
	              for (o = 0, len4 = ref3.length; o < len4; o++) {
	                node = ref3[o];
	                _this.editor.selection.insertNode($(node)[0], range);
	              }
	            } else if ($blockEl.is('li')) {
	              $blockEl.parent().after(pasteContent);
	              _this.editor.selection.setRangeAtEndOf(pasteContent, range);
	            } else {
	              $blockEl.after(pasteContent);
	              _this.editor.selection.setRangeAtEndOf(pasteContent, range);
	            }
	          } else {
	            $blockEl.after(pasteContent);
	            _this.editor.selection.setRangeAtEndOf(pasteContent, range);
	          }
	        } else {
	          if ($blockEl.is('li')) {
	            $blockEl = $blockEl.parent();
	          }
	          if (_this.editor.selection.rangeAtStartOf($blockEl, range)) {
	            insertPosition = 'before';
	          } else if (_this.editor.selection.rangeAtEndOf($blockEl, range)) {
	            insertPosition = 'after';
	          } else {
	            _this.editor.selection.breakBlockEl($blockEl, range);
	            insertPosition = 'before';
	          }
	          $blockEl[insertPosition](pasteContent);
	          _this.editor.selection.setRangeAtEndOf(pasteContent.last(), range);
	        }
	        return _this.editor.trigger('valuechanged');
	      };
	    })(this);
	    if (cleanPaste) {
	      e.preventDefault();
	      if (this.editor.util.browser.msie) {
	        pasteContent = window.clipboardData.getData('Text');
	      } else {
	        pasteContent = e.originalEvent.clipboardData.getData('text/plain');
	      }
	      return processPasteContent(pasteContent);
	    } else {
	      this.editor.selection.save(range);
	      this._pasteArea.focus();
	      if (this.editor.util.browser.msie && this.editor.util.browser.version === 10) {
	        e.preventDefault();
	        this._pasteArea.html(window.clipboardData.getData('Text'));
	      }
	      return setTimeout((function(_this) {
	        return function() {
	          if (_this._pasteArea.is(':empty')) {
	            pasteContent = null;
	          } else {
	            pasteContent = $('<div/>').append(_this._pasteArea.contents());
	            pasteContent.find('table colgroup').remove();
	            _this.editor.formatter.format(pasteContent);
	            _this.editor.formatter.decorate(pasteContent);
	            _this.editor.formatter.beautify(pasteContent.children());
	            pasteContent = pasteContent.contents();
	          }
	          _this._pasteArea.empty();
	          range = _this.editor.selection.restore();
	          return processPasteContent(pasteContent);
	        };
	      })(this), 10);
	    }
	  };

	  InputManager.prototype._onDrop = function(e) {
	    if (this.editor.triggerHandler(e) === false) {
	      return false;
	    }
	    return setTimeout((function(_this) {
	      return function() {
	        return _this.editor.trigger('valuechanged');
	      };
	    })(this), 0);
	  };

	  InputManager.prototype._onInput = function(e) {
	    return this.throttledTrigger('valuechanged', ['oninput']);
	  };

	  InputManager.prototype.addKeystrokeHandler = function(key, node, handler) {
	    if (!this._keystrokeHandlers[key]) {
	      this._keystrokeHandlers[key] = {};
	    }
	    return this._keystrokeHandlers[key][node] = handler;
	  };

	  InputManager.prototype.addShortcut = function(keys, handler) {
	    return this.hotkeys.add(keys, $.proxy(handler, this));
	  };

	  return InputManager;

	})(SimpleModule);

	Keystroke = (function(superClass) {
	  extend(Keystroke, superClass);

	  function Keystroke() {
	    return Keystroke.__super__.constructor.apply(this, arguments);
	  }

	  Keystroke.pluginName = 'Keystroke';

	  Keystroke.prototype._init = function() {
	    var titleEnterHandler;
	    this.editor = this._module;
	    if (this.editor.util.browser.safari) {
	      this.editor.inputManager.addKeystrokeHandler('13', '*', (function(_this) {
	        return function(e) {
	          var $blockEl, $br;
	          if (!e.shiftKey) {
	            return;
	          }
	          $blockEl = _this.editor.util.closestBlockEl();
	          if ($blockEl.is('pre')) {
	            return;
	          }
	          $br = $('<br/>');
	          if (_this.editor.selection.rangeAtEndOf($blockEl)) {
	            _this.editor.selection.insertNode($br);
	            _this.editor.selection.insertNode($('<br/>'));
	            _this.editor.selection.setRangeBefore($br);
	          } else {
	            _this.editor.selection.insertNode($br);
	          }
	          return true;
	        };
	      })(this));
	    }
	    if (this.editor.util.browser.webkit || this.editor.util.browser.msie) {
	      titleEnterHandler = (function(_this) {
	        return function(e, $node) {
	          var $p;
	          if (!_this.editor.selection.rangeAtEndOf($node)) {
	            return;
	          }
	          $p = $('<p/>').append(_this.editor.util.phBr).insertAfter($node);
	          _this.editor.selection.setRangeAtStartOf($p);
	          return true;
	        };
	      })(this);
	      this.editor.inputManager.addKeystrokeHandler('13', 'h1', titleEnterHandler);
	      this.editor.inputManager.addKeystrokeHandler('13', 'h2', titleEnterHandler);
	      this.editor.inputManager.addKeystrokeHandler('13', 'h3', titleEnterHandler);
	      this.editor.inputManager.addKeystrokeHandler('13', 'h4', titleEnterHandler);
	      this.editor.inputManager.addKeystrokeHandler('13', 'h5', titleEnterHandler);
	      this.editor.inputManager.addKeystrokeHandler('13', 'h6', titleEnterHandler);
	    }
	    this.editor.inputManager.addKeystrokeHandler('8', '*', (function(_this) {
	      return function(e) {
	        var $blockEl, $prevBlockEl, $rootBlock;
	        $rootBlock = _this.editor.util.furthestBlockEl();
	        $prevBlockEl = $rootBlock.prev();
	        if ($prevBlockEl.is('hr') && _this.editor.selection.rangeAtStartOf($rootBlock)) {
	          _this.editor.selection.save();
	          $prevBlockEl.remove();
	          _this.editor.selection.restore();
	          return true;
	        }
	        $blockEl = _this.editor.util.closestBlockEl();
	        if (_this.editor.util.browser.webkit && _this.editor.selection.rangeAtStartOf($blockEl)) {
	          _this.editor.selection.save();
	          _this.editor.formatter.cleanNode($blockEl, true);
	          _this.editor.selection.restore();
	          return null;
	        }
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('13', 'li', (function(_this) {
	      return function(e, $node) {
	        var $cloneNode, listEl, newBlockEl, newListEl;
	        $cloneNode = $node.clone();
	        $cloneNode.find('ul, ol').remove();
	        if (!(_this.editor.util.isEmptyNode($cloneNode) && $node.is(_this.editor.util.closestBlockEl()))) {
	          return;
	        }
	        listEl = $node.parent();
	        if ($node.next('li').length > 0) {
	          if (!_this.editor.util.isEmptyNode($node)) {
	            return;
	          }
	          if (listEl.parent('li').length > 0) {
	            newBlockEl = $('<li/>').append(_this.editor.util.phBr).insertAfter(listEl.parent('li'));
	            newListEl = $('<' + listEl[0].tagName + '/>').append($node.nextAll('li'));
	            newBlockEl.append(newListEl);
	          } else {
	            newBlockEl = $('<p/>').append(_this.editor.util.phBr).insertAfter(listEl);
	            newListEl = $('<' + listEl[0].tagName + '/>').append($node.nextAll('li'));
	            newBlockEl.after(newListEl);
	          }
	        } else {
	          if (listEl.parent('li').length > 0) {
	            newBlockEl = $('<li/>').insertAfter(listEl.parent('li'));
	            if ($node.contents().length > 0) {
	              newBlockEl.append($node.contents());
	            } else {
	              newBlockEl.append(_this.editor.util.phBr);
	            }
	          } else {
	            newBlockEl = $('<p/>').append(_this.editor.util.phBr).insertAfter(listEl);
	            if ($node.children('ul, ol').length > 0) {
	              newBlockEl.after($node.children('ul, ol'));
	            }
	          }
	        }
	        if ($node.prev('li').length) {
	          $node.remove();
	        } else {
	          listEl.remove();
	        }
	        _this.editor.selection.setRangeAtStartOf(newBlockEl);
	        return true;
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('13', 'pre', (function(_this) {
	      return function(e, $node) {
	        var $p, breakNode, range;
	        e.preventDefault();
	        if (e.shiftKey) {
	          $p = $('<p/>').append(_this.editor.util.phBr).insertAfter($node);
	          _this.editor.selection.setRangeAtStartOf($p);
	          return true;
	        }
	        range = _this.editor.selection.getRange();
	        breakNode = null;
	        range.deleteContents();
	        if (!_this.editor.util.browser.msie && _this.editor.selection.rangeAtEndOf($node)) {
	          breakNode = document.createTextNode('\n\n');
	          range.insertNode(breakNode);
	          range.setEnd(breakNode, 1);
	        } else {
	          breakNode = document.createTextNode('\n');
	          range.insertNode(breakNode);
	          range.setStartAfter(breakNode);
	        }
	        range.collapse(false);
	        _this.editor.selection.selectRange(range);
	        return true;
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('13', 'blockquote', (function(_this) {
	      return function(e, $node) {
	        var $closestBlock, range;
	        $closestBlock = _this.editor.util.closestBlockEl();
	        if (!($closestBlock.is('p') && !$closestBlock.next().length && _this.editor.util.isEmptyNode($closestBlock))) {
	          return;
	        }
	        $node.after($closestBlock);
	        range = document.createRange();
	        _this.editor.selection.setRangeAtStartOf($closestBlock, range);
	        return true;
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('8', 'li', (function(_this) {
	      return function(e, $node) {
	        var $br, $childList, $newLi, $prevChildList, $prevNode, $textNode, range, text;
	        $childList = $node.children('ul, ol');
	        $prevNode = $node.prev('li');
	        if (!($childList.length > 0 && $prevNode.length > 0)) {
	          return false;
	        }
	        text = '';
	        $textNode = null;
	        $node.contents().each(function(i, n) {
	          if (n.nodeType === 1 && /UL|OL/.test(n.nodeName)) {
	            return false;
	          }
	          if (n.nodeType === 1 && /BR/.test(n.nodeName)) {
	            return;
	          }
	          if (n.nodeType === 3 && n.nodeValue) {
	            text += n.nodeValue;
	          } else if (n.nodeType === 1) {
	            text += $(n).text();
	          }
	          return $textNode = $(n);
	        });
	        if ($textNode && text.length === 1 && _this.editor.util.browser.firefox && !$textNode.next('br').length) {
	          $br = $(_this.editor.util.phBr).insertAfter($textNode);
	          $textNode.remove();
	          _this.editor.selection.setRangeBefore($br);
	          return true;
	        } else if (text.length > 0) {
	          return false;
	        }
	        range = document.createRange();
	        $prevChildList = $prevNode.children('ul, ol');
	        if ($prevChildList.length > 0) {
	          $newLi = $('<li/>').append(_this.editor.util.phBr).appendTo($prevChildList);
	          $prevChildList.append($childList.children('li'));
	          $node.remove();
	          _this.editor.selection.setRangeAtEndOf($newLi, range);
	        } else {
	          _this.editor.selection.setRangeAtEndOf($prevNode, range);
	          $prevNode.append($childList);
	          $node.remove();
	          _this.editor.selection.selectRange(range);
	        }
	        return true;
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('8', 'pre', (function(_this) {
	      return function(e, $node) {
	        var $newNode, codeStr, range;
	        if (!_this.editor.selection.rangeAtStartOf($node)) {
	          return;
	        }
	        codeStr = $node.html().replace('\n', '<br/>');
	        $newNode = $('<p/>').append(codeStr || _this.editor.util.phBr).insertAfter($node);
	        $node.remove();
	        range = document.createRange();
	        _this.editor.selection.setRangeAtStartOf($newNode, range);
	        return true;
	      };
	    })(this));
	    return this.editor.inputManager.addKeystrokeHandler('8', 'blockquote', (function(_this) {
	      return function(e, $node) {
	        var $firstChild, range;
	        if (!_this.editor.selection.rangeAtStartOf($node)) {
	          return;
	        }
	        $firstChild = $node.children().first().unwrap();
	        range = document.createRange();
	        _this.editor.selection.setRangeAtStartOf($firstChild, range);
	        return true;
	      };
	    })(this));
	  };

	  return Keystroke;

	})(SimpleModule);

	UndoManager = (function(superClass) {
	  extend(UndoManager, superClass);

	  function UndoManager() {
	    return UndoManager.__super__.constructor.apply(this, arguments);
	  }

	  UndoManager.pluginName = 'UndoManager';

	  UndoManager.prototype._index = -1;

	  UndoManager.prototype._capacity = 50;

	  UndoManager.prototype._timer = null;

	  UndoManager.prototype._init = function() {
	    var redoShortcut, undoShortcut;
	    this.editor = this._module;
	    this._stack = [];
	    if (this.editor.util.os.mac) {
	      undoShortcut = 'cmd+z';
	      redoShortcut = 'shift+cmd+z';
	    } else if (this.editor.util.os.win) {
	      undoShortcut = 'ctrl+z';
	      redoShortcut = 'ctrl+y';
	    } else {
	      undoShortcut = 'ctrl+z';
	      redoShortcut = 'shift+ctrl+z';
	    }
	    this.editor.inputManager.addShortcut(undoShortcut, (function(_this) {
	      return function(e) {
	        e.preventDefault();
	        _this.undo();
	        return false;
	      };
	    })(this));
	    this.editor.inputManager.addShortcut(redoShortcut, (function(_this) {
	      return function(e) {
	        e.preventDefault();
	        _this.redo();
	        return false;
	      };
	    })(this));
	    return this.editor.on('valuechanged', (function(_this) {
	      return function(e, src) {
	        if (src === 'undo' || src === 'redo') {
	          return;
	        }
	        if (_this._timer) {
	          clearTimeout(_this._timer);
	          _this._timer = null;
	        }
	        return _this._timer = setTimeout(function() {
	          _this._pushUndoState();
	          return _this._timer = null;
	        }, 200);
	      };
	    })(this));
	  };

	  UndoManager.prototype._pushUndoState = function() {
	    var currentState, html;
	    if (this.editor.triggerHandler('pushundostate') === false) {
	      return;
	    }
	    currentState = this.currentState();
	    html = this.editor.body.html();
	    if (currentState && currentState.html === html) {
	      return;
	    }
	    this._index += 1;
	    this._stack.length = this._index;
	    this._stack.push({
	      html: html,
	      caret: this.caretPosition()
	    });
	    if (this._stack.length > this._capacity) {
	      this._stack.shift();
	      return this._index -= 1;
	    }
	  };

	  UndoManager.prototype.currentState = function() {
	    if (this._stack.length && this._index > -1) {
	      return this._stack[this._index];
	    } else {
	      return null;
	    }
	  };

	  UndoManager.prototype.undo = function() {
	    var state;
	    if (this._index < 1 || this._stack.length < 2) {
	      return;
	    }
	    this.editor.hidePopover();
	    this._index -= 1;
	    state = this._stack[this._index];
	    this.editor.body.html(state.html);
	    this.caretPosition(state.caret);
	    this.editor.body.find('.selected').removeClass('selected');
	    this.editor.sync();
	    return this.editor.trigger('valuechanged', ['undo']);
	  };

	  UndoManager.prototype.redo = function() {
	    var state;
	    if (this._index < 0 || this._stack.length < this._index + 2) {
	      return;
	    }
	    this.editor.hidePopover();
	    this._index += 1;
	    state = this._stack[this._index];
	    this.editor.body.html(state.html);
	    this.caretPosition(state.caret);
	    this.editor.body.find('.selected').removeClass('selected');
	    this.editor.sync();
	    return this.editor.trigger('valuechanged', ['redo']);
	  };

	  UndoManager.prototype.update = function() {
	    var currentState, html;
	    if (this._timer) {
	      return;
	    }
	    currentState = this.currentState();
	    if (!currentState) {
	      return;
	    }
	    html = this.editor.body.html();
	    currentState.html = html;
	    return currentState.caret = this.caretPosition();
	  };

	  UndoManager.prototype._getNodeOffset = function(node, index) {
	    var $parent, merging, offset;
	    if (index) {
	      $parent = $(node);
	    } else {
	      $parent = $(node).parent();
	    }
	    offset = 0;
	    merging = false;
	    $parent.contents().each((function(_this) {
	      return function(i, child) {
	        if (index === i || node === child) {
	          return false;
	        }
	        if (child.nodeType === 3) {
	          if (!merging) {
	            offset += 1;
	            merging = true;
	          }
	        } else {
	          offset += 1;
	          merging = false;
	        }
	        return null;
	      };
	    })(this));
	    return offset;
	  };

	  UndoManager.prototype._getNodePosition = function(node, offset) {
	    var position, prevNode;
	    if (node.nodeType === 3) {
	      prevNode = node.previousSibling;
	      while (prevNode && prevNode.nodeType === 3) {
	        node = prevNode;
	        offset += this.editor.util.getNodeLength(prevNode);
	        prevNode = prevNode.previousSibling;
	      }
	    } else {
	      offset = this._getNodeOffset(node, offset);
	    }
	    position = [];
	    position.unshift(offset);
	    this.editor.util.traverseUp((function(_this) {
	      return function(n) {
	        return position.unshift(_this._getNodeOffset(n));
	      };
	    })(this), node);
	    return position;
	  };

	  UndoManager.prototype._getNodeByPosition = function(position) {
	    var child, childNodes, i, j, len, node, offset, ref;
	    node = this.editor.body[0];
	    ref = position.slice(0, position.length - 1);
	    for (i = j = 0, len = ref.length; j < len; i = ++j) {
	      offset = ref[i];
	      childNodes = node.childNodes;
	      if (offset > childNodes.length - 1) {
	        if (i === position.length - 2 && $(node).is('pre')) {
	          child = document.createTextNode('');
	          node.appendChild(child);
	          childNodes = node.childNodes;
	        } else {
	          node = null;
	          break;
	        }
	      }
	      node = childNodes[offset];
	    }
	    return node;
	  };

	  UndoManager.prototype.caretPosition = function(caret) {
	    var endContainer, endOffset, range, startContainer, startOffset;
	    if (!caret) {
	      range = this.editor.selection.getRange();
	      if (!(this.editor.inputManager.focused && (range != null))) {
	        return {};
	      }
	      caret = {
	        start: [],
	        end: null,
	        collapsed: true
	      };
	      caret.start = this._getNodePosition(range.startContainer, range.startOffset);
	      if (!range.collapsed) {
	        caret.end = this._getNodePosition(range.endContainer, range.endOffset);
	        caret.collapsed = false;
	      }
	      return caret;
	    } else {
	      if (!this.editor.inputManager.focused) {
	        this.editor.body.focus();
	      }
	      if (!caret.start) {
	        this.editor.body.blur();
	        return;
	      }
	      startContainer = this._getNodeByPosition(caret.start);
	      startOffset = caret.start[caret.start.length - 1];
	      if (caret.collapsed) {
	        endContainer = startContainer;
	        endOffset = startOffset;
	      } else {
	        endContainer = this._getNodeByPosition(caret.end);
	        endOffset = caret.start[caret.start.length - 1];
	      }
	      if (!startContainer || !endContainer) {
	        throw new Error('simditor: invalid caret state');
	        return;
	      }
	      range = document.createRange();
	      range.setStart(startContainer, startOffset);
	      range.setEnd(endContainer, endOffset);
	      return this.editor.selection.selectRange(range);
	    }
	  };

	  return UndoManager;

	})(SimpleModule);

	Util = (function(superClass) {
	  extend(Util, superClass);

	  function Util() {
	    return Util.__super__.constructor.apply(this, arguments);
	  }

	  Util.pluginName = 'Util';

	  Util.prototype._init = function() {
	    this.editor = this._module;
	    if (this.browser.msie && this.browser.version < 11) {
	      return this.phBr = '';
	    }
	  };

	  Util.prototype.phBr = '<br/>';

	  Util.prototype.os = (function() {
	    var os;
	    os = {};
	    if (/Mac/.test(navigator.appVersion)) {
	      os.mac = true;
	    } else if (/Linux/.test(navigator.appVersion)) {
	      os.linux = true;
	    } else if (/Win/.test(navigator.appVersion)) {
	      os.win = true;
	    } else if (/X11/.test(navigator.appVersion)) {
	      os.unix = true;
	    }
	    if (/Mobi/.test(navigator.appVersion)) {
	      os.mobile = true;
	    }
	    return os;
	  })();

	  Util.prototype.browser = (function() {
	    var chrome, firefox, ie, ref, ref1, ref2, ref3, safari, ua;
	    ua = navigator.userAgent;
	    ie = /(msie|trident)/i.test(ua);
	    chrome = /chrome|crios/i.test(ua);
	    safari = /safari/i.test(ua) && !chrome;
	    firefox = /firefox/i.test(ua);
	    if (ie) {
	      return {
	        msie: true,
	        version: ((ref = ua.match(/(msie |rv:)(\d+(\.\d+)?)/i)) != null ? ref[2] : void 0) * 1
	      };
	    } else if (chrome) {
	      return {
	        webkit: true,
	        chrome: true,
	        version: ((ref1 = ua.match(/(?:chrome|crios)\/(\d+(\.\d+)?)/i)) != null ? ref1[1] : void 0) * 1
	      };
	    } else if (safari) {
	      return {
	        webkit: true,
	        safari: true,
	        version: ((ref2 = ua.match(/version\/(\d+(\.\d+)?)/i)) != null ? ref2[1] : void 0) * 1
	      };
	    } else if (firefox) {
	      return {
	        mozilla: true,
	        firefox: true,
	        version: ((ref3 = ua.match(/firefox\/(\d+(\.\d+)?)/i)) != null ? ref3[1] : void 0) * 1
	      };
	    } else {
	      return {};
	    }
	  })();

	  Util.prototype.support = (function() {
	    return {
	      onselectionchange: (function() {
	        var e, onselectionchange;
	        onselectionchange = document.onselectionchange;
	        if (onselectionchange !== void 0) {
	          try {
	            document.onselectionchange = 0;
	            return document.onselectionchange === null;
	          } catch (_error) {
	            e = _error;
	          } finally {
	            document.onselectionchange = onselectionchange;
	          }
	        }
	        return false;
	      })(),
	      oninput: (function() {
	        return !/(msie|trident)/i.test(navigator.userAgent);
	      })()
	    };
	  })();

	  Util.prototype.reflow = function(el) {
	    if (el == null) {
	      el = document;
	    }
	    return $(el)[0].offsetHeight;
	  };

	  Util.prototype.metaKey = function(e) {
	    var isMac;
	    isMac = /Mac/.test(navigator.userAgent);
	    if (isMac) {
	      return e.metaKey;
	    } else {
	      return e.ctrlKey;
	    }
	  };

	  Util.prototype.isEmptyNode = function(node) {
	    var $node;
	    $node = $(node);
	    return $node.is(':empty') || (!$node.text() && !$node.find(':not(br, span, div)').length);
	  };

	  Util.prototype.blockNodes = ["div", "p", "ul", "ol", "li", "blockquote", "hr", "pre", "h1", "h2", "h3", "h4", "table"];

	  Util.prototype.isBlockNode = function(node) {
	    node = $(node)[0];
	    if (!node || node.nodeType === 3) {
	      return false;
	    }
	    return new RegExp("^(" + (this.blockNodes.join('|')) + ")$").test(node.nodeName.toLowerCase());
	  };

	  Util.prototype.closestBlockEl = function(node) {
	    var $node, blockEl, range;
	    if (node == null) {
	      range = this.editor.selection.getRange();
	      node = range != null ? range.commonAncestorContainer : void 0;
	    }
	    $node = $(node);
	    if (!$node.length) {
	      return null;
	    }
	    blockEl = $node.parentsUntil(this.editor.body).addBack();
	    blockEl = blockEl.filter((function(_this) {
	      return function(i) {
	        return _this.isBlockNode(blockEl.eq(i));
	      };
	    })(this));
	    if (blockEl.length) {
	      return blockEl.last();
	    } else {
	      return null;
	    }
	  };

	  Util.prototype.furthestNode = function(node, filter) {
	    var $node, blockEl, range;
	    if (node == null) {
	      range = this.editor.selection.getRange();
	      node = range != null ? range.commonAncestorContainer : void 0;
	    }
	    $node = $(node);
	    if (!$node.length) {
	      return null;
	    }
	    blockEl = $node.parentsUntil(this.editor.body).addBack();
	    blockEl = blockEl.filter((function(_this) {
	      return function(i) {
	        var $n;
	        $n = blockEl.eq(i);
	        if ($.isFunction(filter)) {
	          return filter($n);
	        } else {
	          return $n.is(filter);
	        }
	      };
	    })(this));
	    if (blockEl.length) {
	      return blockEl.first();
	    } else {
	      return null;
	    }
	  };

	  Util.prototype.furthestBlockEl = function(node) {
	    return this.furthestNode(node, $.proxy(this.isBlockNode, this));
	  };

	  Util.prototype.getNodeLength = function(node) {
	    switch (node.nodeType) {
	      case 7:
	      case 10:
	        return 0;
	      case 3:
	      case 8:
	        return node.length;
	      default:
	        return node.childNodes.length;
	    }
	  };

	  Util.prototype.traverseUp = function(callback, node) {
	    var j, len, n, nodes, range, result, results1;
	    if (node == null) {
	      range = this.editor.selection.getRange();
	      node = range != null ? range.commonAncestorContainer : void 0;
	    }
	    if ((node == null) || !$.contains(this.editor.body[0], node)) {
	      return false;
	    }
	    nodes = $(node).parentsUntil(this.editor.body).get();
	    nodes.unshift(node);
	    results1 = [];
	    for (j = 0, len = nodes.length; j < len; j++) {
	      n = nodes[j];
	      result = callback(n);
	      if (result === false) {
	        break;
	      } else {
	        results1.push(void 0);
	      }
	    }
	    return results1;
	  };

	  Util.prototype.dataURLtoBlob = function(dataURL) {
	    var BlobBuilder, arrayBuffer, bb, byteString, hasArrayBufferViewSupport, hasBlobConstructor, i, intArray, j, mimeString, ref;
	    hasBlobConstructor = window.Blob && (function() {
	      var e;
	      try {
	        return Boolean(new Blob());
	      } catch (_error) {
	        e = _error;
	        return false;
	      }
	    })();
	    hasArrayBufferViewSupport = hasBlobConstructor && window.Uint8Array && (function() {
	      var e;
	      try {
	        return new Blob([new Uint8Array(100)]).size === 100;
	      } catch (_error) {
	        e = _error;
	        return false;
	      }
	    })();
	    BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
	    if (!((hasBlobConstructor || BlobBuilder) && window.atob && window.ArrayBuffer && window.Uint8Array)) {
	      return false;
	    }
	    if (dataURL.split(',')[0].indexOf('base64') >= 0) {
	      byteString = atob(dataURL.split(',')[1]);
	    } else {
	      byteString = decodeURIComponent(dataURL.split(',')[1]);
	    }
	    arrayBuffer = new ArrayBuffer(byteString.length);
	    intArray = new Uint8Array(arrayBuffer);
	    for (i = j = 0, ref = byteString.length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
	      intArray[i] = byteString.charCodeAt(i);
	    }
	    mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
	    if (hasBlobConstructor) {
	      return new Blob([hasArrayBufferViewSupport ? intArray : arrayBuffer], {
	        type: mimeString
	      });
	    }
	    bb = new BlobBuilder();
	    bb.append(arrayBuffer);
	    return bb.getBlob(mimeString);
	  };

	  Util.prototype.throttle = function(func, wait) {
	    var delayedCallTimeout, previousCallTime, stopDelayedCall;
	    delayedCallTimeout = null;
	    previousCallTime = 0;
	    stopDelayedCall = function() {
	      if (delayedCallTimeout) {
	        clearTimeout(delayedCallTimeout);
	        return delayedCallTimeout = null;
	      }
	    };
	    return function() {
	      var args, now, remaining, result;
	      now = Date.now();
	      previousCallTime || (previousCallTime = now);
	      remaining = wait - (now - previousCallTime);
	      result = null;
	      if ((0 < remaining && remaining < wait)) {
	        previousCallTime = now;
	        stopDelayedCall();
	        args = arguments;
	        delayedCallTimeout = setTimeout(function() {
	          previousCallTime = 0;
	          delayedCallTimeout = null;
	          return result = func.apply(null, args);
	        }, wait);
	      } else {
	        stopDelayedCall();
	        if (previousCallTime !== now) {
	          previousCallTime = 0;
	        }
	        result = func.apply(null, arguments);
	      }
	      return result;
	    };
	  };

	  Util.prototype.formatHTML = function(html) {
	    var cursor, indentString, lastMatch, level, match, re, repeatString, result, str;
	    re = /<(\/?)(.+?)(\/?)>/g;
	    result = '';
	    level = 0;
	    lastMatch = null;
	    indentString = '  ';
	    repeatString = function(str, n) {
	      return new Array(n + 1).join(str);
	    };
	    while ((match = re.exec(html)) !== null) {
	      match.isBlockNode = $.inArray(match[2], this.blockNodes) > -1;
	      match.isStartTag = match[1] !== '/' && match[3] !== '/';
	      match.isEndTag = match[1] === '/' || match[3] === '/';
	      cursor = lastMatch ? lastMatch.index + lastMatch[0].length : 0;
	      if ((str = html.substring(cursor, match.index)).length > 0 && $.trim(str)) {
	        result += str;
	      }
	      if (match.isBlockNode && match.isEndTag && !match.isStartTag) {
	        level -= 1;
	      }
	      if (match.isBlockNode && match.isStartTag) {
	        if (!(lastMatch && lastMatch.isBlockNode && lastMatch.isEndTag)) {
	          result += '\n';
	        }
	        result += repeatString(indentString, level);
	      }
	      result += match[0];
	      if (match.isBlockNode && match.isEndTag) {
	        result += '\n';
	      }
	      if (match.isBlockNode && match.isStartTag) {
	        level += 1;
	      }
	      lastMatch = match;
	    }
	    return $.trim(result);
	  };

	  return Util;

	})(SimpleModule);

	Toolbar = (function(superClass) {
	  extend(Toolbar, superClass);

	  function Toolbar() {
	    return Toolbar.__super__.constructor.apply(this, arguments);
	  }

	  Toolbar.pluginName = 'Toolbar';

	  Toolbar.prototype.opts = {
	    toolbar: true,
	    toolbarFloat: true,
	    toolbarHidden: false,
	    toolbarFloatOffset: 0
	  };

	  Toolbar.prototype._tpl = {
	    wrapper: '<div class="simditor-toolbar"><ul></ul></div>',
	    separator: '<li><span class="separator"></span></li>'
	  };

	  Toolbar.prototype._init = function() {
	    var toolbarHeight;
	    this.editor = this._module;
	    if (!this.opts.toolbar) {
	      return;
	    }
	    if (!$.isArray(this.opts.toolbar)) {
	      this.opts.toolbar = ['bold', 'italic', 'underline', 'strikethrough', '|', 'ol', 'ul', 'blockquote', 'code', '|', 'link', 'image', '|', 'indent', 'outdent'];
	    }
	    this._render();
	    this.list.on('click', (function(_this) {
	      return function(e) {
	        return false;
	      };
	    })(this));
	    this.wrapper.on('mousedown', (function(_this) {
	      return function(e) {
	        return _this.list.find('.menu-on').removeClass('.menu-on');
	      };
	    })(this));
	    $(document).on('mousedown.simditor' + this.editor.id, (function(_this) {
	      return function(e) {
	        return _this.list.find('.menu-on').removeClass('.menu-on');
	      };
	    })(this));
	    if (!this.opts.toolbarHidden && this.opts.toolbarFloat) {
	      this.wrapper.width(this.wrapper.outerWidth());
	      this.wrapper.css('top', this.opts.toolbarFloatOffset);
	      toolbarHeight = this.wrapper.outerHeight();
	      if (!this.editor.util.os.mobile) {
	        $(window).on('resize.simditor-' + this.editor.id, (function(_this) {
	          return function(e) {
	            _this.wrapper.css('position', 'static');
	            _this.editor.util.reflow(_this.wrapper);
	            _this.wrapper.css('left', _this.wrapper.offset().left);
	            return _this.wrapper.css('position', '');
	          };
	        })(this)).resize();
	      }
	      $(window).on('scroll.simditor-' + this.editor.id, (function(_this) {
	        return function(e) {
	          var bottomEdge, scrollTop, topEdge;
	          topEdge = _this.editor.wrapper.offset().top;
	          bottomEdge = topEdge + _this.editor.wrapper.outerHeight() - 80;
	          scrollTop = $(document).scrollTop() + _this.opts.toolbarFloatOffset;
	          if (scrollTop <= topEdge || scrollTop >= bottomEdge) {
	            _this.editor.wrapper.removeClass('toolbar-floating').css('padding-top', '');
	            if (_this.editor.util.os.mobile) {
	              return _this.wrapper.css('top', _this.opts.toolbarFloatOffset);
	            }
	          } else {
	            _this.editor.wrapper.addClass('toolbar-floating').css('padding-top', toolbarHeight);
	            if (_this.editor.util.os.mobile) {
	              return _this.wrapper.css('top', scrollTop - topEdge + _this.opts.toolbarFloatOffset);
	            }
	          }
	        };
	      })(this));
	    }
	    this.editor.on('selectionchanged', (function(_this) {
	      return function() {
	        return _this.toolbarStatus();
	      };
	    })(this));
	    this.editor.on('destroy', (function(_this) {
	      return function() {
	        return _this.buttons.length = 0;
	      };
	    })(this));
	    return $(document).on('mousedown.simditor-' + this.editor.id, (function(_this) {
	      return function(e) {
	        return _this.list.find('li.menu-on').removeClass('menu-on');
	      };
	    })(this));
	  };

	  Toolbar.prototype._render = function() {
	    var j, len, name, ref;
	    this.buttons = [];
	    this.wrapper = $(this._tpl.wrapper).prependTo(this.editor.wrapper);
	    this.list = this.wrapper.find('ul');
	    ref = this.opts.toolbar;
	    for (j = 0, len = ref.length; j < len; j++) {
	      name = ref[j];
	      if (name === '|') {
	        $(this._tpl.separator).appendTo(this.list);
	        continue;
	      }
	      if (!this.constructor.buttons[name]) {
	        throw new Error('simditor: invalid toolbar button "' + name + '"');
	        continue;
	      }
	      this.buttons.push(new this.constructor.buttons[name]({
	        editor: this.editor
	      }));
	    }
	    if (this.opts.toolbarHidden) {
	      return this.wrapper.hide();
	    } else {
	      return this.editor.placeholderEl.css('top', this.wrapper.outerHeight());
	    }
	  };

	  Toolbar.prototype.toolbarStatus = function(name) {
	    var buttons;
	    if (!this.editor.inputManager.focused) {
	      return;
	    }
	    buttons = this.buttons.slice(0);
	    return this.editor.util.traverseUp((function(_this) {
	      return function(node) {
	        var button, i, j, k, len, len1, removeButtons;
	        removeButtons = [];
	        for (i = j = 0, len = buttons.length; j < len; i = ++j) {
	          button = buttons[i];
	          if ((name != null) && button.name !== name) {
	            continue;
	          }
	          if (!button.status || button.status($(node)) === true) {
	            removeButtons.push(button);
	          }
	        }
	        for (k = 0, len1 = removeButtons.length; k < len1; k++) {
	          button = removeButtons[k];
	          i = $.inArray(button, buttons);
	          buttons.splice(i, 1);
	        }
	        if (buttons.length === 0) {
	          return false;
	        }
	      };
	    })(this));
	  };

	  Toolbar.prototype.findButton = function(name) {
	    var button;
	    button = this.list.find('.toolbar-item-' + name).data('button');
	    return button != null ? button : null;
	  };

	  Toolbar.addButton = function(btn) {
	    return this.buttons[btn.prototype.name] = btn;
	  };

	  Toolbar.buttons = {};

	  return Toolbar;

	})(SimpleModule);

	Indentation = (function(superClass) {
	  extend(Indentation, superClass);

	  function Indentation() {
	    return Indentation.__super__.constructor.apply(this, arguments);
	  }

	  Indentation.pluginName = 'Indentation';

	  Indentation.prototype.opts = {
	    tabIndent: true
	  };

	  Indentation.prototype._init = function() {
	    this.editor = this._module;
	    return this.editor.inputManager.addKeystrokeHandler('9', '*', (function(_this) {
	      return function(e) {
	        var codeButton;
	        codeButton = _this.editor.toolbar.findButton('code');
	        if (!(_this.opts.tabIndent || (codeButton && codeButton.active))) {
	          return;
	        }
	        return _this.indent(e.shiftKey);
	      };
	    })(this));
	  };

	  Indentation.prototype.indent = function(isBackward) {
	    var $blockEls, $endBlock, $startBlock, range, result;
	    range = this.editor.selection.getRange();
	    if (!range) {
	      return;
	    }
	    $startBlock = this.editor.util.closestBlockEl(range.startContainer);
	    $endBlock = this.editor.util.closestBlockEl(range.endContainer);
	    if (!($startBlock.is('li') && $endBlock.is('li') && $startBlock.parent().is($endBlock.parent()))) {
	      $startBlock = this.editor.util.furthestBlockEl($startBlock);
	      $endBlock = this.editor.util.furthestBlockEl($endBlock);
	    }
	    if ($startBlock.is($endBlock)) {
	      $blockEls = $startBlock;
	    } else {
	      $blockEls = $startBlock.nextUntil($endBlock).add($startBlock).add($endBlock);
	    }
	    result = false;
	    $blockEls.each((function(_this) {
	      return function(i, blockEl) {
	        return result = isBackward ? _this.outdentBlock(blockEl) : _this.indentBlock(blockEl);
	      };
	    })(this));
	    return result;
	  };

	  Indentation.prototype.indentBlock = function(blockEl) {
	    var $blockEl, $childList, $nextTd, $parentLi, $pre, $td, indentLevel, range, tagName;
	    $blockEl = $(blockEl);
	    if (!$blockEl.length) {
	      return;
	    }
	    if ($blockEl.is('pre')) {
	      range = this.editor.selection.getRange();
	      $pre = $(range.commonAncestorContainer);
	      if (!($pre.is($blockEl) || $pre.closest('pre').is($blockEl))) {
	        return;
	      }
	      this.indentText(range);
	    } else if ($blockEl.is('li')) {
	      $parentLi = $blockEl.prev('li');
	      if ($parentLi.length < 1) {
	        return;
	      }
	      this.editor.selection.save();
	      tagName = $blockEl.parent()[0].tagName;
	      $childList = $parentLi.children('ul, ol');
	      if ($childList.length > 0) {
	        $childList.append($blockEl);
	      } else {
	        $('<' + tagName + '/>').append($blockEl).appendTo($parentLi);
	      }
	      this.editor.selection.restore();
	    } else if ($blockEl.is('p, h1, h2, h3, h4')) {
	      indentLevel = $blockEl.attr('data-indent') || 0;
	      indentLevel = Math.min(indentLevel * 1 + 1, 10);
	      $blockEl.attr('data-indent', indentLevel);
	    } else if ($blockEl.is('table') || $blockEl.is('.simditor-table')) {
	      range = this.editor.selection.getRange();
	      $td = $(range.commonAncestorContainer).closest('td');
	      $nextTd = $td.next('td');
	      if (!($nextTd.length > 0)) {
	        $nextTd = $td.parent('tr').next('tr').find('td:first');
	      }
	      if (!($td.length > 0 && $nextTd.length > 0)) {
	        return false;
	      }
	      this.editor.selection.setRangeAtEndOf($nextTd);
	    }
	    return true;
	  };

	  Indentation.prototype.indentText = function(range) {
	    var text, textNode;
	    text = range.toString().replace(/^(?=.+)/mg, '\u00A0\u00A0');
	    textNode = document.createTextNode(text || '\u00A0\u00A0');
	    range.deleteContents();
	    range.insertNode(textNode);
	    if (text) {
	      range.selectNode(textNode);
	      return this.editor.selection.selectRange(range);
	    } else {
	      return this.editor.selection.setRangeAfter(textNode);
	    }
	  };

	  Indentation.prototype.outdentBlock = function(blockEl) {
	    var $blockEl, $parent, $parentLi, $pre, $prevTd, $td, button, indentLevel, range, ref;
	    $blockEl = $(blockEl);
	    if (!($blockEl && $blockEl.length > 0)) {
	      return;
	    }
	    if ($blockEl.is('pre')) {
	      range = this.editor.selection.getRange();
	      $pre = $(range.commonAncestorContainer);
	      if (!($pre.is($blockEl) || $pre.closest('pre').is($blockEl))) {
	        return;
	      }
	      this.outdentText(range);
	    } else if ($blockEl.is('li')) {
	      $parent = $blockEl.parent();
	      $parentLi = $parent.parent('li');
	      if ($parentLi.length < 1) {
	        button = this.editor.toolbar.findButton($parent[0].tagName.toLowerCase());
	        if (button != null) {
	          button.command();
	        }
	        return;
	      }
	      this.editor.selection.save();
	      if ($blockEl.next('li').length > 0) {
	        $('<' + $parent[0].tagName + '/>').append($blockEl.nextAll('li')).appendTo($blockEl);
	      }
	      $blockEl.insertAfter($parentLi);
	      if ($parent.children('li').length < 1) {
	        $parent.remove();
	      }
	      this.editor.selection.restore();
	    } else if ($blockEl.is('p, h1, h2, h3, h4')) {
	      indentLevel = (ref = $blockEl.attr('data-indent')) != null ? ref : 0;
	      indentLevel = indentLevel * 1 - 1;
	      if (indentLevel < 0) {
	        indentLevel = 0;
	      }
	      $blockEl.attr('data-indent', indentLevel);
	    } else if ($blockEl.is('table') || $blockEl.is('.simditor-table')) {
	      range = this.editor.selection.getRange();
	      $td = $(range.commonAncestorContainer).closest('td');
	      $prevTd = $td.prev('td');
	      if (!($prevTd.length > 0)) {
	        $prevTd = $td.parent('tr').prev('tr').find('td:last');
	      }
	      if (!($td.length > 0 && $prevTd.length > 0)) {
	        return;
	      }
	      this.editor.selection.setRangeAtEndOf($prevTd);
	    }
	    return true;
	  };

	  Indentation.prototype.outdentText = function(range) {};

	  return Indentation;

	})(SimpleModule);

	Simditor = (function(superClass) {
	  extend(Simditor, superClass);

	  function Simditor() {
	    return Simditor.__super__.constructor.apply(this, arguments);
	  }

	  Simditor.connect(Util);

	  Simditor.connect(InputManager);

	  Simditor.connect(UndoManager);

	  Simditor.connect(Keystroke);

	  Simditor.connect(Formatter);

	  Simditor.connect(Selection);

	  Simditor.connect(Toolbar);

	  Simditor.connect(Indentation);

	  Simditor.count = 0;

	  Simditor.prototype.opts = {
	    textarea: null,
	    placeholder: '',
	    defaultImage: 'images/image.png',
	    params: {},
	    upload: false
	  };

	  Simditor.prototype._init = function() {
	    var e, editor, form, uploadOpts;
	    this.textarea = $(this.opts.textarea);
	    this.opts.placeholder = this.opts.placeholder || this.textarea.attr('placeholder');
	    if (!this.textarea.length) {
	      throw new Error('simditor: param textarea is required.');
	      return;
	    }
	    editor = this.textarea.data('simditor');
	    if (editor != null) {
	      editor.destroy();
	    }
	    this.id = ++Simditor.count;
	    this._render();
	    if (this.opts.upload && simpleUploader) {
	      uploadOpts = typeof this.opts.upload === 'object' ? this.opts.upload : {};
	      this.uploader = simpleUploader(uploadOpts);
	    }
	    form = this.textarea.closest('form');
	    if (form.length) {
	      form.on('submit.simditor-' + this.id, (function(_this) {
	        return function() {
	          return _this.sync();
	        };
	      })(this));
	      form.on('reset.simditor-' + this.id, (function(_this) {
	        return function() {
	          return _this.setValue('');
	        };
	      })(this));
	    }
	    this.on('initialized', (function(_this) {
	      return function() {
	        if (_this.opts.placeholder) {
	          _this.on('valuechanged', function() {
	            return _this._placeholder();
	          });
	        }
	        return _this.setValue(_this.textarea.val().trim() || '');
	      };
	    })(this));
	    if (this.util.browser.mozilla) {
	      this.util.reflow();
	      try {
	        document.execCommand("enableObjectResizing", false, false);
	        return document.execCommand("enableInlineTableEditing", false, false);
	      } catch (_error) {
	        e = _error;
	      }
	    }
	  };

	  Simditor.prototype._tpl = "<div class=\"simditor\">\n  <div class=\"simditor-wrapper\">\n    <div class=\"simditor-placeholder\"></div>\n    <div class=\"simditor-body\" contenteditable=\"true\">\n    </div>\n  </div>\n</div>";

	  Simditor.prototype._render = function() {
	    var key, ref, results1, val;
	    this.el = $(this._tpl).insertBefore(this.textarea);
	    this.wrapper = this.el.find('.simditor-wrapper');
	    this.body = this.wrapper.find('.simditor-body');
	    this.placeholderEl = this.wrapper.find('.simditor-placeholder').append(this.opts.placeholder);
	    this.el.data('simditor', this);
	    this.wrapper.append(this.textarea);
	    this.textarea.data('simditor', this).blur();
	    this.body.attr('tabindex', this.textarea.attr('tabindex'));
	    if (this.util.os.mac) {
	      this.el.addClass('simditor-mac');
	    } else if (this.util.os.linux) {
	      this.el.addClass('simditor-linux');
	    }
	    if (this.util.os.mobile) {
	      this.el.addClass('simditor-mobile');
	    }
	    if (this.opts.params) {
	      ref = this.opts.params;
	      results1 = [];
	      for (key in ref) {
	        val = ref[key];
	        results1.push($('<input/>', {
	          type: 'hidden',
	          name: key,
	          value: val
	        }).insertAfter(this.textarea));
	      }
	      return results1;
	    }
	  };

	  Simditor.prototype._placeholder = function() {
	    var children, ref;
	    children = this.body.children();
	    if (children.length === 0 || (children.length === 1 && this.util.isEmptyNode(children) && ((ref = children.data('indent')) != null ? ref : 0) < 1)) {
	      return this.placeholderEl.show();
	    } else {
	      return this.placeholderEl.hide();
	    }
	  };

	  Simditor.prototype.setValue = function(val) {
	    this.hidePopover();
	    this.textarea.val(val);
	    this.body.html(val);
	    this.formatter.format();
	    this.formatter.decorate();
	    this.util.reflow(this.body);
	    this.inputManager.lastCaretPosition = null;
	    return this.trigger('valuechanged');
	  };

	  Simditor.prototype.getValue = function() {
	    return this.sync();
	  };

	  Simditor.prototype.sync = function() {
	    var children, cloneBody, emptyP, firstP, lastP, val;
	    cloneBody = this.body.clone();
	    this.formatter.undecorate(cloneBody);
	    this.formatter.format(cloneBody);
	    this.formatter.autolink(cloneBody);
	    children = cloneBody.children();
	    lastP = children.last('p');
	    firstP = children.first('p');
	    while (lastP.is('p') && this.util.isEmptyNode(lastP)) {
	      emptyP = lastP;
	      lastP = lastP.prev('p');
	      emptyP.remove();
	    }
	    while (firstP.is('p') && this.util.isEmptyNode(firstP)) {
	      emptyP = firstP;
	      firstP = lastP.next('p');
	      emptyP.remove();
	    }
	    cloneBody.find('img.uploading').remove();
	    val = $.trim(cloneBody.html());
	    this.textarea.val(val);
	    return val;
	  };

	  Simditor.prototype.focus = function() {
	    var $blockEl, range;
	    if (this.sourceMode) {
	      this.textarea.focus();
	      return;
	    }
	    if (this.inputManager.lastCaretPosition) {
	      return this.undoManager.caretPosition(this.inputManager.lastCaretPosition);
	    } else {
	      $blockEl = this.body.find('p').last();
	      if (!($blockEl.length > 0)) {
	        $blockEl = $('<p/>').append(this.util.phBr).appendTo(this.body);
	      }
	      range = document.createRange();
	      this.selection.setRangeAtEndOf($blockEl, range);
	      return this.body.focus();
	    }
	  };

	  Simditor.prototype.blur = function() {
	    if (this.sourceMode) {
	      return this.textarea.blur();
	    } else {
	      return this.body.blur();
	    }
	  };

	  Simditor.prototype.hidePopover = function() {
	    return this.el.find('.simditor-popover').each((function(_this) {
	      return function(i, popover) {
	        popover = $(popover).data('popover');
	        if (popover.active) {
	          return popover.hide();
	        }
	      };
	    })(this));
	  };

	  Simditor.prototype.destroy = function() {
	    this.triggerHandler('destroy');
	    this.textarea.closest('form').off('.simditor .simditor-' + this.id);
	    this.selection.clear();
	    this.inputManager.focused = false;
	    this.textarea.insertBefore(this.el).hide().val('').removeData('simditor');
	    this.el.remove();
	    $(document).off('.simditor-' + this.id);
	    $(window).off('.simditor-' + this.id);
	    return this.off();
	  };

	  return Simditor;

	})(SimpleModule);

	Simditor.i18n = {
	  'zh-CN': {
	    'blockquote': '引用',
	    'bold': '加粗文字',
	    'code': '插入代码',
	    'color': '文字颜色',
	    'hr': '分隔线',
	    'image': '插入图片',
	    'externalImage': '外链图片',
	    'uploadImage': '上传图片',
	    'uploadFailed': '上传失败了',
	    'uploadError': '上传出错了',
	    'imageUrl': '图片地址',
	    'imageSize': '图片尺寸',
	    'imageAlt': '图片描述',
	    'restoreImageSize': '还原图片尺寸',
	    'uploading': '正在上传',
	    'indent': '向右缩进',
	    'outdent': '向左缩进',
	    'italic': '斜体文字',
	    'link': '插入链接',
	    'text': '文本',
	    'linkText': '链接文字',
	    'linkUrl': '地址',
	    'removeLink': '移除链接',
	    'ol': '有序列表',
	    'ul': '无序列表',
	    'strikethrough': '删除线文字',
	    'table': '表格',
	    'deleteRow': '删除行',
	    'insertRowAbove': '在上面插入行',
	    'insertRowBelow': '在下面插入行',
	    'deleteColumn': '删除列',
	    'insertColumnLeft': '在左边插入列',
	    'insertColumnRight': '在右边插入列',
	    'deleteTable': '删除表格',
	    'title': '标题',
	    'source': 'HTML源代码',
	    'normalText': '普通文本',
	    'underline': '下划线文字'
	  }
	};

	Button = (function(superClass) {
	  extend(Button, superClass);

	  Button.prototype._tpl = {
	    item: '<li><a tabindex="-1" unselectable="on" class="toolbar-item" href="javascript:;"><span></span></a></li>',
	    menuWrapper: '<div class="toolbar-menu"></div>',
	    menuItem: '<li><a tabindex="-1" unselectable="on" class="menu-item" href="javascript:;"><span></span></a></li>',
	    separator: '<li><span class="separator"></span></li>'
	  };

	  Button.prototype.name = '';

	  Button.prototype.icon = '';

	  Button.prototype.title = '';

	  Button.prototype.text = '';

	  Button.prototype.htmlTag = '';

	  Button.prototype.disableTag = '';

	  Button.prototype.menu = false;

	  Button.prototype.active = false;

	  Button.prototype.disabled = false;

	  Button.prototype.needFocus = true;

	  Button.prototype.shortcut = null;

	  function Button(opts) {
	    this.editor = opts.editor;
	    this.title = this._t(this.name);
	    Button.__super__.constructor.call(this, opts);
	  }

	  Button.prototype._init = function() {
	    var j, len, ref, results1, tag;
	    this.render();
	    this.el.on('mousedown', (function(_this) {
	      return function(e) {
	        var exceed, param;
	        e.preventDefault();
	        if (_this.el.hasClass('disabled') || (_this.needFocus && !_this.editor.inputManager.focused)) {
	          return false;
	        }
	        if (_this.menu) {
	          _this.wrapper.toggleClass('menu-on').siblings('li').removeClass('menu-on');
	          if (_this.wrapper.is('.menu-on')) {
	            exceed = _this.menuWrapper.offset().left + _this.menuWrapper.outerWidth() + 5 - _this.editor.wrapper.offset().left - _this.editor.wrapper.outerWidth();
	            if (exceed > 0) {
	              _this.menuWrapper.css({
	                'left': 'auto',
	                'right': 0
	              });
	            }
	            _this.trigger('menuexpand');
	          }
	          return false;
	        }
	        param = _this.el.data('param');
	        _this.command(param);
	        return false;
	      };
	    })(this));
	    this.wrapper.on('click', 'a.menu-item', (function(_this) {
	      return function(e) {
	        var btn, param;
	        e.preventDefault();
	        btn = $(e.currentTarget);
	        _this.wrapper.removeClass('menu-on');
	        if (btn.hasClass('disabled') || (_this.needFocus && !_this.editor.inputManager.focused)) {
	          return false;
	        }
	        _this.editor.toolbar.wrapper.removeClass('menu-on');
	        param = btn.data('param');
	        _this.command(param);
	        return false;
	      };
	    })(this));
	    this.wrapper.on('mousedown', 'a.menu-item', (function(_this) {
	      return function(e) {
	        return false;
	      };
	    })(this));
	    this.editor.on('blur', (function(_this) {
	      return function() {
	        if (_this.editor.sourceMode) {
	          return;
	        }
	        _this.setActive(false);
	        return _this.setDisabled(false);
	      };
	    })(this));
	    if (this.shortcut != null) {
	      this.editor.inputManager.addShortcut(this.shortcut, (function(_this) {
	        return function(e) {
	          _this.el.mousedown();
	          return false;
	        };
	      })(this));
	    }
	    ref = this.htmlTag.split(',');
	    results1 = [];
	    for (j = 0, len = ref.length; j < len; j++) {
	      tag = ref[j];
	      tag = $.trim(tag);
	      if (tag && $.inArray(tag, this.editor.formatter._allowedTags) < 0) {
	        results1.push(this.editor.formatter._allowedTags.push(tag));
	      } else {
	        results1.push(void 0);
	      }
	    }
	    return results1;
	  };

	  Button.prototype.render = function() {
	    this.wrapper = $(this._tpl.item).appendTo(this.editor.toolbar.list);
	    this.el = this.wrapper.find('a.toolbar-item');
	    this.el.attr('title', this.title).addClass("toolbar-item-" + this.name).data('button', this);
	    this.el.find('span').addClass(this.icon ? "simditor-icon simditor-icon-" + this.icon : '').text(this.text);
	    if (!this.menu) {
	      return;
	    }
	    this.menuWrapper = $(this._tpl.menuWrapper).appendTo(this.wrapper);
	    this.menuWrapper.addClass("toolbar-menu-" + this.name);
	    return this.renderMenu();
	  };

	  Button.prototype.renderMenu = function() {
	    var $menuBtntnEl, $menuItemEl, j, len, menuItem, ref, ref1, results1;
	    if (!$.isArray(this.menu)) {
	      return;
	    }
	    this.menuEl = $('<ul/>').appendTo(this.menuWrapper);
	    ref = this.menu;
	    results1 = [];
	    for (j = 0, len = ref.length; j < len; j++) {
	      menuItem = ref[j];
	      if (menuItem === '|') {
	        $(this._tpl.separator).appendTo(this.menuEl);
	        continue;
	      }
	      $menuItemEl = $(this._tpl.menuItem).appendTo(this.menuEl);
	      results1.push($menuBtntnEl = $menuItemEl.find('a.menu-item').attr({
	        'title': (ref1 = menuItem.title) != null ? ref1 : menuItem.text,
	        'data-param': menuItem.param
	      }).addClass('menu-item-' + menuItem.name).find('span').text(menuItem.text));
	    }
	    return results1;
	  };

	  Button.prototype.setActive = function(active) {
	    if (active === this.active) {
	      return;
	    }
	    this.active = active;
	    this.el.toggleClass('active', this.active);
	    return this.editor.toolbar.trigger('buttonstatus', [this]);
	  };

	  Button.prototype.setDisabled = function(disabled) {
	    if (disabled === this.disabled) {
	      return;
	    }
	    this.disabled = disabled;
	    this.el.toggleClass('disabled', this.disabled);
	    return this.editor.toolbar.trigger('buttonstatus', [this]);
	  };

	  Button.prototype.status = function($node) {
	    if ($node != null) {
	      this.setDisabled($node.is(this.disableTag));
	    }
	    if (this.disabled) {
	      return true;
	    }
	    if ($node != null) {
	      this.setActive($node.is(this.htmlTag));
	    }
	    return this.active;
	  };

	  Button.prototype.command = function(param) {};

	  Button.prototype._t = function() {
	    var args, ref, result;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    result = Button.__super__._t.apply(this, args);
	    if (!result) {
	      result = (ref = this.editor)._t.apply(ref, args);
	    }
	    return result;
	  };

	  return Button;

	})(SimpleModule);

	Simditor.Button = Button;

	Popover = (function(superClass) {
	  extend(Popover, superClass);

	  Popover.prototype.offset = {
	    top: 4,
	    left: 0
	  };

	  Popover.prototype.target = null;

	  Popover.prototype.active = false;

	  function Popover(opts) {
	    this.button = opts.button;
	    this.editor = opts.button.editor;
	    Popover.__super__.constructor.call(this, opts);
	  }

	  Popover.prototype._init = function() {
	    this.el = $('<div class="simditor-popover"></div>').appendTo(this.editor.el).data('popover', this);
	    this.render();
	    this.el.on('mouseenter', (function(_this) {
	      return function(e) {
	        return _this.el.addClass('hover');
	      };
	    })(this));
	    return this.el.on('mouseleave', (function(_this) {
	      return function(e) {
	        return _this.el.removeClass('hover');
	      };
	    })(this));
	  };

	  Popover.prototype.render = function() {};

	  Popover.prototype.show = function($target, position) {
	    if (position == null) {
	      position = 'bottom';
	    }
	    if ($target == null) {
	      return;
	    }
	    this.el.siblings('.simditor-popover').each((function(_this) {
	      return function(i, popover) {
	        popover = $(popover).data('popover');
	        if (popover.active) {
	          return popover.hide();
	        }
	      };
	    })(this));
	    this.target = $target.addClass('selected');
	    if (this.active) {
	      this.refresh(position);
	      return this.trigger('popovershow');
	    } else {
	      this.active = true;
	      this.el.css({
	        left: -9999
	      }).show();
	      return setTimeout((function(_this) {
	        return function() {
	          _this.refresh(position);
	          return _this.trigger('popovershow');
	        };
	      })(this), 0);
	    }
	  };

	  Popover.prototype.hide = function() {
	    if (!this.active) {
	      return;
	    }
	    if (this.target) {
	      this.target.removeClass('selected');
	    }
	    this.target = null;
	    this.active = false;
	    this.el.hide();
	    return this.trigger('popoverhide');
	  };

	  Popover.prototype.refresh = function(position) {
	    var editorOffset, left, targetH, targetOffset, top;
	    if (position == null) {
	      position = 'bottom';
	    }
	    if (!this.active) {
	      return;
	    }
	    editorOffset = this.editor.el.offset();
	    targetOffset = this.target.offset();
	    targetH = this.target.outerHeight();
	    if (position === 'bottom') {
	      top = targetOffset.top - editorOffset.top + targetH;
	    } else if (position === 'top') {
	      top = targetOffset.top - editorOffset.top - this.el.height();
	    }
	    left = Math.min(targetOffset.left - editorOffset.left, this.editor.wrapper.width() - this.el.outerWidth() - 10);
	    return this.el.css({
	      top: top + this.offset.top,
	      left: left + this.offset.left
	    });
	  };

	  Popover.prototype.destroy = function() {
	    this.target = null;
	    this.active = false;
	    this.editor.off('.linkpopover');
	    return this.el.remove();
	  };

	  Popover.prototype._t = function() {
	    var args, ref, result;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    result = Popover.__super__._t.apply(this, args);
	    if (!result) {
	      result = (ref = this.button)._t.apply(ref, args);
	    }
	    return result;
	  };

	  return Popover;

	})(SimpleModule);

	Simditor.Popover = Popover;

	SourceButton = (function(superClass) {
	  extend(SourceButton, superClass);

	  function SourceButton() {
	    return SourceButton.__super__.constructor.apply(this, arguments);
	  }

	  SourceButton.prototype.name = 'source';

	  SourceButton.prototype.icon = 'html5';

	  SourceButton.prototype.needFocus = false;

	  SourceButton.prototype._init = function() {
	    SourceButton.__super__._init.call(this);
	    this.editor.textarea.on('focus', (function(_this) {
	      return function(e) {
	        return _this.editor.el.addClass('focus').removeClass('error');
	      };
	    })(this));
	    this.editor.textarea.on('blur', (function(_this) {
	      return function(e) {
	        _this.editor.el.removeClass('focus');
	        return _this.editor.setValue(_this.editor.textarea.val());
	      };
	    })(this));
	    return this.editor.textarea.on('input', (function(_this) {
	      return function(e) {
	        return _this._resizeTextarea();
	      };
	    })(this));
	  };

	  SourceButton.prototype.status = function($node) {
	    return true;
	  };

	  SourceButton.prototype.command = function() {
	    var button, j, len, ref;
	    this.editor.blur();
	    this.editor.el.toggleClass('simditor-source-mode');
	    this.editor.sourceMode = this.editor.el.hasClass('simditor-source-mode');
	    if (this.editor.sourceMode) {
	      this.editor.hidePopover();
	      this.editor.textarea.val(this.editor.util.formatHTML(this.editor.textarea.val()));
	      this._resizeTextarea();
	    }
	    ref = this.editor.toolbar.buttons;
	    for (j = 0, len = ref.length; j < len; j++) {
	      button = ref[j];
	      if (button.name === 'source') {
	        button.setActive(this.editor.sourceMode);
	      } else {
	        button.setDisabled(this.editor.sourceMode);
	      }
	    }
	    return null;
	  };

	  SourceButton.prototype._resizeTextarea = function() {
	    this._textareaPadding || (this._textareaPadding = this.editor.textarea.innerHeight() - this.editor.textarea.height());
	    return this.editor.textarea.height(0).height(this.editor.textarea[0].scrollHeight - this._textareaPadding);
	  };

	  return SourceButton;

	})(Button);

	Simditor.Toolbar.addButton(SourceButton);

	TitleButton = (function(superClass) {
	  extend(TitleButton, superClass);

	  function TitleButton() {
	    return TitleButton.__super__.constructor.apply(this, arguments);
	  }

	  TitleButton.prototype.name = 'title';

	  TitleButton.prototype.htmlTag = 'h1, h2, h3, h4';

	  TitleButton.prototype.disableTag = 'pre, table';

	  TitleButton.prototype._init = function() {
	    this.menu = [
	      {
	        name: 'normal',
	        text: this._t('normalText'),
	        param: 'p'
	      }, '|', {
	        name: 'h1',
	        text: this._t('title') + ' 1',
	        param: 'h1'
	      }, {
	        name: 'h2',
	        text: this._t('title') + ' 2',
	        param: 'h2'
	      }, {
	        name: 'h3',
	        text: this._t('title') + ' 3',
	        param: 'h3'
	      }, {
	        name: 'h4',
	        text: this._t('title') + ' 4',
	        param: 'h4'
	      }, {
	        name: 'h5',
	        text: this._t('title') + ' 5',
	        param: 'h5'
	      }
	    ];
	    return TitleButton.__super__._init.call(this);
	  };

	  TitleButton.prototype.setActive = function(active, param) {
	    TitleButton.__super__.setActive.call(this, active);
	    this.el.removeClass('active-p active-h1 active-h2 active-h3');
	    if (active) {
	      return this.el.addClass('active active-' + param);
	    }
	  };

	  TitleButton.prototype.status = function($node) {
	    var param, ref;
	    if ($node != null) {
	      this.setDisabled($node.is(this.disableTag));
	    }
	    if (this.disabled) {
	      return true;
	    }
	    if ($node != null) {
	      param = (ref = $node[0].tagName) != null ? ref.toLowerCase() : void 0;
	      this.setActive($node.is(this.htmlTag), param);
	    }
	    return this.active;
	  };

	  TitleButton.prototype.command = function(param) {
	    var $contents, $endBlock, $startBlock, endNode, j, len, node, range, ref, results, startNode;
	    range = this.editor.selection.getRange();
	    startNode = range.startContainer;
	    endNode = range.endContainer;
	    $startBlock = this.editor.util.closestBlockEl(startNode);
	    $endBlock = this.editor.util.closestBlockEl(endNode);
	    this.editor.selection.save();
	    range.setStartBefore($startBlock[0]);
	    range.setEndAfter($endBlock[0]);
	    $contents = $(range.extractContents());
	    results = [];
	    $contents.children().each((function(_this) {
	      return function(i, el) {
	        var c, converted, j, len, results1;
	        converted = _this._convertEl(el, param);
	        results1 = [];
	        for (j = 0, len = converted.length; j < len; j++) {
	          c = converted[j];
	          results1.push(results.push(c));
	        }
	        return results1;
	      };
	    })(this));
	    ref = results.reverse();
	    for (j = 0, len = ref.length; j < len; j++) {
	      node = ref[j];
	      range.insertNode(node[0]);
	    }
	    this.editor.selection.restore();
	    return this.editor.trigger('valuechanged');
	  };

	  TitleButton.prototype._convertEl = function(el, param) {
	    var $block, $el, results;
	    $el = $(el);
	    results = [];
	    if ($el.is(param)) {
	      results.push($el);
	    } else {
	      $block = $('<' + param + '/>').append($el.contents());
	      results.push($block);
	    }
	    return results;
	  };

	  return TitleButton;

	})(Button);

	Simditor.Toolbar.addButton(TitleButton);

	BoldButton = (function(superClass) {
	  extend(BoldButton, superClass);

	  function BoldButton() {
	    return BoldButton.__super__.constructor.apply(this, arguments);
	  }

	  BoldButton.prototype.name = 'bold';

	  BoldButton.prototype.icon = 'bold';

	  BoldButton.prototype.htmlTag = 'b, strong';

	  BoldButton.prototype.disableTag = 'pre';

	  BoldButton.prototype.shortcut = 'cmd+b';

	  BoldButton.prototype._init = function() {
	    if (this.editor.util.os.mac) {
	      this.title = this.title + ' ( Cmd + b )';
	    } else {
	      this.title = this.title + ' ( Ctrl + b )';
	      this.shortcut = 'ctrl+b';
	    }
	    return BoldButton.__super__._init.call(this);
	  };

	  BoldButton.prototype.status = function($node) {
	    var active;
	    if ($node != null) {
	      this.setDisabled($node.is(this.disableTag));
	    }
	    if (this.disabled) {
	      return true;
	    }
	    active = document.queryCommandState('bold') === true;
	    this.setActive(active);
	    return active;
	  };

	  BoldButton.prototype.command = function() {
	    document.execCommand('bold');
	    if (!this.editor.util.support.oninput) {
	      this.editor.trigger('valuechanged');
	    }
	    return $(document).trigger('selectionchange');
	  };

	  return BoldButton;

	})(Button);

	Simditor.Toolbar.addButton(BoldButton);

	ItalicButton = (function(superClass) {
	  extend(ItalicButton, superClass);

	  function ItalicButton() {
	    return ItalicButton.__super__.constructor.apply(this, arguments);
	  }

	  ItalicButton.prototype.name = 'italic';

	  ItalicButton.prototype.icon = 'italic';

	  ItalicButton.prototype.htmlTag = 'i';

	  ItalicButton.prototype.disableTag = 'pre';

	  ItalicButton.prototype.shortcut = 'cmd+i';

	  ItalicButton.prototype._init = function() {
	    if (this.editor.util.os.mac) {
	      this.title = this.title + ' ( Cmd + i )';
	    } else {
	      this.title = this.title + ' ( Ctrl + i )';
	      this.shortcut = 'ctrl+i';
	    }
	    return ItalicButton.__super__._init.call(this);
	  };

	  ItalicButton.prototype.status = function($node) {
	    var active;
	    if ($node != null) {
	      this.setDisabled($node.is(this.disableTag));
	    }
	    if (this.disabled) {
	      return this.disabled;
	    }
	    active = document.queryCommandState('italic') === true;
	    this.setActive(active);
	    return active;
	  };

	  ItalicButton.prototype.command = function() {
	    document.execCommand('italic');
	    if (!this.editor.util.support.oninput) {
	      this.editor.trigger('valuechanged');
	    }
	    return $(document).trigger('selectionchange');
	  };

	  return ItalicButton;

	})(Button);

	Simditor.Toolbar.addButton(ItalicButton);

	UnderlineButton = (function(superClass) {
	  extend(UnderlineButton, superClass);

	  function UnderlineButton() {
	    return UnderlineButton.__super__.constructor.apply(this, arguments);
	  }

	  UnderlineButton.prototype.name = 'underline';

	  UnderlineButton.prototype.icon = 'underline';

	  UnderlineButton.prototype.htmlTag = 'u';

	  UnderlineButton.prototype.disableTag = 'pre';

	  UnderlineButton.prototype.shortcut = 'cmd+u';

	  UnderlineButton.prototype.render = function() {
	    if (this.editor.util.os.mac) {
	      this.title = this.title + ' ( Cmd + u )';
	    } else {
	      this.title = this.title + ' ( Ctrl + u )';
	      this.shortcut = 'ctrl+u';
	    }
	    return UnderlineButton.__super__.render.call(this);
	  };

	  UnderlineButton.prototype.status = function($node) {
	    var active;
	    if ($node != null) {
	      this.setDisabled($node.is(this.disableTag));
	    }
	    if (this.disabled) {
	      return this.disabled;
	    }
	    active = document.queryCommandState('underline') === true;
	    this.setActive(active);
	    return active;
	  };

	  UnderlineButton.prototype.command = function() {
	    document.execCommand('underline');
	    if (!this.editor.util.support.oninput) {
	      this.editor.trigger('valuechanged');
	    }
	    return $(document).trigger('selectionchange');
	  };

	  return UnderlineButton;

	})(Button);

	Simditor.Toolbar.addButton(UnderlineButton);

	ColorButton = (function(superClass) {
	  extend(ColorButton, superClass);

	  function ColorButton() {
	    return ColorButton.__super__.constructor.apply(this, arguments);
	  }

	  ColorButton.prototype.name = 'color';

	  ColorButton.prototype.icon = 'tint';

	  ColorButton.prototype.disableTag = 'pre';

	  ColorButton.prototype.menu = true;

	  ColorButton.prototype.render = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    return ColorButton.__super__.render.apply(this, args);
	  };

	  ColorButton.prototype.renderMenu = function() {
	    $('<ul class="color-list">\n  <li><a href="javascript:;" class="font-color font-color-1" data-color=""></a></li>\n  <li><a href="javascript:;" class="font-color font-color-2" data-color=""></a></li>\n  <li><a href="javascript:;" class="font-color font-color-3" data-color=""></a></li>\n  <li><a href="javascript:;" class="font-color font-color-4" data-color=""></a></li>\n  <li><a href="javascript:;" class="font-color font-color-5" data-color=""></a></li>\n  <li><a href="javascript:;" class="font-color font-color-6" data-color=""></a></li>\n  <li><a href="javascript:;" class="font-color font-color-7" data-color=""></a></li>\n  <li><a href="javascript:;" class="font-color font-color-default" data-color=""></a></li>\n</ul>').appendTo(this.menuWrapper);
	    this.menuWrapper.on('mousedown', '.color-list', function(e) {
	      return false;
	    });
	    return this.menuWrapper.on('click', '.font-color', (function(_this) {
	      return function(e) {
	        var $link, $p, hex, rgb;
	        _this.wrapper.removeClass('menu-on');
	        $link = $(e.currentTarget);
	        if ($link.hasClass('font-color-default')) {
	          $p = _this.editor.body.find('p, li');
	          if (!($p.length > 0)) {
	            return;
	          }
	          rgb = window.getComputedStyle($p[0], null).getPropertyValue('color');
	          hex = _this._convertRgbToHex(rgb);
	        } else {
	          rgb = window.getComputedStyle($link[0], null).getPropertyValue('background-color');
	          hex = _this._convertRgbToHex(rgb);
	        }
	        if (!hex) {
	          return;
	        }
	        document.execCommand('foreColor', false, hex);
	        if (!_this.editor.util.support.oninput) {
	          return _this.editor.trigger('valuechanged');
	        }
	      };
	    })(this));
	  };

	  ColorButton.prototype._convertRgbToHex = function(rgb) {
	    var match, re, rgbToHex;
	    re = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/g;
	    match = re.exec(rgb);
	    if (!match) {
	      return '';
	    }
	    rgbToHex = function(r, g, b) {
	      var componentToHex;
	      componentToHex = function(c) {
	        var hex;
	        hex = c.toString(16);
	        if (hex.length === 1) {
	          return '0' + hex;
	        } else {
	          return hex;
	        }
	      };
	      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	    };
	    return rgbToHex(match[1] * 1, match[2] * 1, match[3] * 1);
	  };

	  return ColorButton;

	})(Button);

	Simditor.Toolbar.addButton(ColorButton);

	ListButton = (function(superClass) {
	  extend(ListButton, superClass);

	  function ListButton() {
	    return ListButton.__super__.constructor.apply(this, arguments);
	  }

	  ListButton.prototype.type = '';

	  ListButton.prototype.disableTag = 'pre, table';

	  ListButton.prototype.status = function($node) {
	    var anotherType;
	    if ($node != null) {
	      this.setDisabled($node.is(this.disableTag));
	    }
	    if (this.disabled) {
	      return true;
	    }
	    if ($node == null) {
	      return this.active;
	    }
	    anotherType = this.type === 'ul' ? 'ol' : 'ul';
	    if ($node.is(anotherType)) {
	      this.setActive(false);
	      return true;
	    } else {
	      this.setActive($node.is(this.htmlTag));
	      return this.active;
	    }
	  };

	  ListButton.prototype.command = function(param) {
	    var $contents, $endBlock, $furthestEnd, $furthestStart, $parent, $startBlock, endLevel, endNode, getListLevel, j, len, node, range, ref, results, startLevel, startNode;
	    range = this.editor.selection.getRange();
	    startNode = range.startContainer;
	    endNode = range.endContainer;
	    $startBlock = this.editor.util.closestBlockEl(startNode);
	    $endBlock = this.editor.util.closestBlockEl(endNode);
	    this.editor.selection.save();
	    range.setStartBefore($startBlock[0]);
	    range.setEndAfter($endBlock[0]);
	    if ($startBlock.is('li') && $endBlock.is('li')) {
	      $furthestStart = this.editor.util.furthestNode($startBlock, 'ul, ol');
	      $furthestEnd = this.editor.util.furthestNode($endBlock, 'ul, ol');
	      if ($furthestStart.is($furthestEnd)) {
	        getListLevel = function($li) {
	          var lvl;
	          lvl = 1;
	          while (!$li.parent().is($furthestStart)) {
	            lvl += 1;
	            $li = $li.parent();
	          }
	          return lvl;
	        };
	        startLevel = getListLevel($startBlock);
	        endLevel = getListLevel($endBlock);
	        if (startLevel > endLevel) {
	          $parent = $endBlock.parent();
	        } else {
	          $parent = $startBlock.parent();
	        }
	        range.setStartBefore($parent[0]);
	        range.setEndAfter($parent[0]);
	      } else {
	        range.setStartBefore($furthestStart[0]);
	        range.setEndAfter($furthestEnd[0]);
	      }
	    }
	    $contents = $(range.extractContents());
	    results = [];
	    $contents.children().each((function(_this) {
	      return function(i, el) {
	        var c, converted, j, len, results1;
	        converted = _this._convertEl(el);
	        results1 = [];
	        for (j = 0, len = converted.length; j < len; j++) {
	          c = converted[j];
	          if (results.length && results[results.length - 1].is(_this.type) && c.is(_this.type)) {
	            results1.push(results[results.length - 1].append(c.children()));
	          } else {
	            results1.push(results.push(c));
	          }
	        }
	        return results1;
	      };
	    })(this));
	    ref = results.reverse();
	    for (j = 0, len = ref.length; j < len; j++) {
	      node = ref[j];
	      range.insertNode(node[0]);
	    }
	    this.editor.selection.restore();
	    return this.editor.trigger('valuechanged');
	  };

	  ListButton.prototype._convertEl = function(el) {
	    var $el, anotherType, block, child, children, j, len, ref, results;
	    $el = $(el);
	    results = [];
	    anotherType = this.type === 'ul' ? 'ol' : 'ul';
	    if ($el.is(this.type)) {
	      $el.children('li').each((function(_this) {
	        return function(i, li) {
	          var $childList, $li, block;
	          $li = $(li);
	          $childList = $li.children('ul, ol').remove();
	          block = $('<p/>').append($(li).html() || _this.editor.util.phBr);
	          results.push(block);
	          if ($childList.length > 0) {
	            return results.push($childList);
	          }
	        };
	      })(this));
	    } else if ($el.is(anotherType)) {
	      block = $('<' + this.type + '/>').append($el.html());
	      results.push(block);
	    } else if ($el.is('blockquote')) {
	      ref = $el.children().get();
	      for (j = 0, len = ref.length; j < len; j++) {
	        child = ref[j];
	        children = this._convertEl(child);
	      }
	      $.merge(results, children);
	    } else if ($el.is('table')) {

	    } else {
	      block = $('<' + this.type + '><li></li></' + this.type + '>');
	      block.find('li').append($el.html() || this.editor.util.phBr);
	      results.push(block);
	    }
	    return results;
	  };

	  return ListButton;

	})(Button);

	OrderListButton = (function(superClass) {
	  extend(OrderListButton, superClass);

	  function OrderListButton() {
	    return OrderListButton.__super__.constructor.apply(this, arguments);
	  }

	  OrderListButton.prototype.type = 'ol';

	  OrderListButton.prototype.name = 'ol';

	  OrderListButton.prototype.icon = 'list-ol';

	  OrderListButton.prototype.htmlTag = 'ol';

	  OrderListButton.prototype.shortcut = 'cmd+/';

	  OrderListButton.prototype._init = function() {
	    if (this.editor.util.os.mac) {
	      this.title = this.title + ' ( Cmd + / )';
	    } else {
	      this.title = this.title + ' ( ctrl + / )';
	      this.shortcut = 'ctrl+/';
	    }
	    return OrderListButton.__super__._init.call(this);
	  };

	  return OrderListButton;

	})(ListButton);

	UnorderListButton = (function(superClass) {
	  extend(UnorderListButton, superClass);

	  function UnorderListButton() {
	    return UnorderListButton.__super__.constructor.apply(this, arguments);
	  }

	  UnorderListButton.prototype.type = 'ul';

	  UnorderListButton.prototype.name = 'ul';

	  UnorderListButton.prototype.icon = 'list-ul';

	  UnorderListButton.prototype.htmlTag = 'ul';

	  UnorderListButton.prototype.shortcut = 'cmd+.';

	  UnorderListButton.prototype._init = function() {
	    if (this.editor.util.os.mac) {
	      this.title = this.title + ' ( Cmd + . )';
	    } else {
	      this.title = this.title + ' ( Ctrl + . )';
	      this.shortcut = 'ctrl+.';
	    }
	    return UnorderListButton.__super__._init.call(this);
	  };

	  return UnorderListButton;

	})(ListButton);

	Simditor.Toolbar.addButton(OrderListButton);

	Simditor.Toolbar.addButton(UnorderListButton);

	BlockquoteButton = (function(superClass) {
	  extend(BlockquoteButton, superClass);

	  function BlockquoteButton() {
	    return BlockquoteButton.__super__.constructor.apply(this, arguments);
	  }

	  BlockquoteButton.prototype.name = 'blockquote';

	  BlockquoteButton.prototype.icon = 'quote-left';

	  BlockquoteButton.prototype.htmlTag = 'blockquote';

	  BlockquoteButton.prototype.disableTag = 'pre, table';

	  BlockquoteButton.prototype.command = function() {
	    var $contents, $endBlock, $startBlock, endNode, j, len, node, range, ref, results, startNode;
	    range = this.editor.selection.getRange();
	    startNode = range.startContainer;
	    endNode = range.endContainer;
	    $startBlock = this.editor.util.furthestBlockEl(startNode);
	    $endBlock = this.editor.util.furthestBlockEl(endNode);
	    this.editor.selection.save();
	    range.setStartBefore($startBlock[0]);
	    range.setEndAfter($endBlock[0]);
	    $contents = $(range.extractContents());
	    results = [];
	    $contents.children().each((function(_this) {
	      return function(i, el) {
	        var c, converted, j, len, results1;
	        converted = _this._convertEl(el);
	        results1 = [];
	        for (j = 0, len = converted.length; j < len; j++) {
	          c = converted[j];
	          if (results.length && results[results.length - 1].is(_this.htmlTag) && c.is(_this.htmlTag)) {
	            results1.push(results[results.length - 1].append(c.children()));
	          } else {
	            results1.push(results.push(c));
	          }
	        }
	        return results1;
	      };
	    })(this));
	    ref = results.reverse();
	    for (j = 0, len = ref.length; j < len; j++) {
	      node = ref[j];
	      range.insertNode(node[0]);
	    }
	    this.editor.selection.restore();
	    return this.editor.trigger('valuechanged');
	  };

	  BlockquoteButton.prototype._convertEl = function(el) {
	    var $el, block, results;
	    $el = $(el);
	    results = [];
	    if ($el.is(this.htmlTag)) {
	      $el.children().each((function(_this) {
	        return function(i, node) {
	          return results.push($(node));
	        };
	      })(this));
	    } else {
	      block = $('<' + this.htmlTag + '/>').append($el);
	      results.push(block);
	    }
	    return results;
	  };

	  return BlockquoteButton;

	})(Button);

	Simditor.Toolbar.addButton(BlockquoteButton);

	CodeButton = (function(superClass) {
	  extend(CodeButton, superClass);

	  function CodeButton() {
	    return CodeButton.__super__.constructor.apply(this, arguments);
	  }

	  CodeButton.prototype.name = 'code';

	  CodeButton.prototype.icon = 'code';

	  CodeButton.prototype.htmlTag = 'pre';

	  CodeButton.prototype.disableTag = 'li, table';

	  CodeButton.prototype._init = function() {
	    CodeButton.__super__._init.call(this);
	    this.editor.on('decorate', (function(_this) {
	      return function(e, $el) {
	        return $el.find('pre').each(function(i, pre) {
	          return _this.decorate($(pre));
	        });
	      };
	    })(this));
	    return this.editor.on('undecorate', (function(_this) {
	      return function(e, $el) {
	        return $el.find('pre').each(function(i, pre) {
	          return _this.undecorate($(pre));
	        });
	      };
	    })(this));
	  };

	  CodeButton.prototype.render = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    CodeButton.__super__.render.apply(this, args);
	    return this.popover = new CodePopover({
	      button: this
	    });
	  };

	  CodeButton.prototype.status = function($node) {
	    var result;
	    result = CodeButton.__super__.status.call(this, $node);
	    if (this.active) {
	      this.popover.show($node);
	    } else if (this.editor.util.isBlockNode($node)) {
	      this.popover.hide();
	    }
	    return result;
	  };

	  CodeButton.prototype.decorate = function($pre) {
	    var lang;
	    lang = $pre.attr('data-lang');
	    $pre.removeClass();
	    if (lang && lang !== -1) {
	      return $pre.addClass('lang-' + lang);
	    }
	  };

	  CodeButton.prototype.undecorate = function($pre) {
	    var lang;
	    lang = $pre.attr('data-lang');
	    $pre.removeClass();
	    if (lang && lang !== -1) {
	      return $pre.addClass('lang-' + lang);
	    }
	  };

	  CodeButton.prototype.command = function() {
	    var $contents, $endBlock, $startBlock, endNode, j, len, node, range, ref, results, startNode;
	    range = this.editor.selection.getRange();
	    startNode = range.startContainer;
	    endNode = range.endContainer;
	    $startBlock = this.editor.util.closestBlockEl(startNode);
	    $endBlock = this.editor.util.closestBlockEl(endNode);
	    range.setStartBefore($startBlock[0]);
	    range.setEndAfter($endBlock[0]);
	    $contents = $(range.extractContents());
	    results = [];
	    $contents.children().each((function(_this) {
	      return function(i, el) {
	        var c, converted, j, len, results1;
	        converted = _this._convertEl(el);
	        results1 = [];
	        for (j = 0, len = converted.length; j < len; j++) {
	          c = converted[j];
	          if (results.length && results[results.length - 1].is(_this.htmlTag) && c.is(_this.htmlTag)) {
	            results1.push(results[results.length - 1].append(c.contents()));
	          } else {
	            results1.push(results.push(c));
	          }
	        }
	        return results1;
	      };
	    })(this));
	    ref = results.reverse();
	    for (j = 0, len = ref.length; j < len; j++) {
	      node = ref[j];
	      range.insertNode(node[0]);
	    }
	    this.editor.selection.setRangeAtEndOf(results[0]);
	    return this.editor.trigger('valuechanged');
	  };

	  CodeButton.prototype._convertEl = function(el) {
	    var $el, block, codeStr, results;
	    $el = $(el);
	    results = [];
	    if ($el.is(this.htmlTag)) {
	      block = $('<p/>').append($el.html().replace('\n', '<br/>'));
	      results.push(block);
	    } else {
	      if (!$el.text() && $el.children().length === 1 && $el.children().is('br')) {
	        codeStr = '\n';
	      } else {
	        codeStr = this.editor.formatter.clearHtml($el);
	      }
	      block = $('<' + this.htmlTag + '/>').text(codeStr);
	      results.push(block);
	    }
	    return results;
	  };

	  return CodeButton;

	})(Button);

	CodePopover = (function(superClass) {
	  extend(CodePopover, superClass);

	  function CodePopover() {
	    return CodePopover.__super__.constructor.apply(this, arguments);
	  }

	  CodePopover.prototype._tpl = "<div class=\"code-settings\">\n  <div class=\"settings-field\">\n    <select class=\"select-lang\">\n      <option value=\"-1\">选择程序语言</option>\n      <option value=\"bash\">Bash</option>\n      <option value=\"c++\">C++</option>\n      <option value=\"cs\">C#</option>\n      <option value=\"css\">CSS</option>\n      <option value=\"erlang\">Erlang</option>\n      <option value=\"less\">Less</option>\n      <option value=\"scss\">Sass</option>\n      <option value=\"diff\">Diff</option>\n      <option value=\"coffeeScript\">CoffeeScript</option>\n      <option value=\"html\">Html,XML</option>\n      <option value=\"json\">JSON</option>\n      <option value=\"java\">Java</option>\n      <option value=\"js\">JavaScript</option>\n      <option value=\"markdown\">Markdown</option>\n      <option value=\"oc\">Objective C</option>\n      <option value=\"php\">PHP</option>\n      <option value=\"perl\">Perl</option>\n      <option value=\"python\">Python</option>\n      <option value=\"ruby\">Ruby</option>\n      <option value=\"sql\">SQL</option>\n    </select>\n  </div>\n</div>";

	  CodePopover.prototype.render = function() {
	    this.el.addClass('code-popover').append(this._tpl);
	    this.selectEl = this.el.find('.select-lang');
	    this.selectEl.on('change', (function(_this) {
	      return function(e) {
	        var selected;
	        _this.lang = _this.selectEl.val();
	        selected = _this.target.hasClass('selected');
	        _this.target.removeClass().removeAttr('data-lang');
	        if (_this.lang !== -1) {
	          _this.target.addClass('lang-' + _this.lang);
	          _this.target.attr('data-lang', _this.lang);
	        }
	        if (selected) {
	          return _this.target.addClass('selected');
	        }
	      };
	    })(this));
	    return this.editor.on('valuechanged', (function(_this) {
	      return function(e) {
	        if (_this.active) {
	          return _this.refresh();
	        }
	      };
	    })(this));
	  };

	  CodePopover.prototype.show = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    CodePopover.__super__.show.apply(this, args);
	    this.lang = this.target.attr('data-lang');
	    if (this.lang != null) {
	      return this.selectEl.val(this.lang);
	    } else {
	      return this.selectEl.val(-1);
	    }
	  };

	  return CodePopover;

	})(Popover);

	Simditor.Toolbar.addButton(CodeButton);

	LinkButton = (function(superClass) {
	  extend(LinkButton, superClass);

	  function LinkButton() {
	    return LinkButton.__super__.constructor.apply(this, arguments);
	  }

	  LinkButton.prototype.name = 'link';

	  LinkButton.prototype.icon = 'link';

	  LinkButton.prototype.htmlTag = 'a';

	  LinkButton.prototype.disableTag = 'pre';

	  LinkButton.prototype.render = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    LinkButton.__super__.render.apply(this, args);
	    return this.popover = new LinkPopover({
	      button: this
	    });
	  };

	  LinkButton.prototype.status = function($node) {
	    var showPopover;
	    if ($node != null) {
	      this.setDisabled($node.is(this.disableTag));
	    }
	    if (this.disabled) {
	      return true;
	    }
	    if ($node == null) {
	      return this.active;
	    }
	    showPopover = true;
	    if (!$node.is(this.htmlTag) || $node.is('[class^="simditor-"]')) {
	      this.setActive(false);
	      showPopover = false;
	    } else if (this.editor.selection.rangeAtEndOf($node)) {
	      this.setActive(true);
	      showPopover = false;
	    } else {
	      this.setActive(true);
	    }
	    if (showPopover) {
	      this.popover.show($node);
	    } else if (this.editor.util.isBlockNode($node)) {
	      this.popover.hide();
	    }
	    return this.active;
	  };

	  LinkButton.prototype.command = function() {
	    var $contents, $endBlock, $link, $newBlock, $startBlock, endNode, linkText, range, startNode, txtNode;
	    range = this.editor.selection.getRange();
	    if (this.active) {
	      $link = $(range.commonAncestorContainer).closest('a');
	      txtNode = document.createTextNode($link.text());
	      $link.replaceWith(txtNode);
	      range.selectNode(txtNode);
	    } else {
	      startNode = range.startContainer;
	      endNode = range.endContainer;
	      $startBlock = this.editor.util.closestBlockEl(startNode);
	      $endBlock = this.editor.util.closestBlockEl(endNode);
	      $contents = $(range.extractContents());
	      linkText = this.editor.formatter.clearHtml($contents.contents(), false);
	      $link = $('<a/>', {
	        href: 'http://www.example.com',
	        target: '_blank',
	        text: linkText || this._t('linkText')
	      });
	      if ($startBlock[0] === $endBlock[0]) {
	        range.insertNode($link[0]);
	      } else {
	        $newBlock = $('<p/>').append($link);
	        range.insertNode($newBlock[0]);
	      }
	      range.selectNodeContents($link[0]);
	      this.popover.one('popovershow', (function(_this) {
	        return function() {
	          if (linkText) {
	            _this.popover.urlEl.focus();
	            return _this.popover.urlEl[0].select();
	          } else {
	            _this.popover.textEl.focus();
	            return _this.popover.textEl[0].select();
	          }
	        };
	      })(this));
	    }
	    this.editor.selection.selectRange(range);
	    return this.editor.trigger('valuechanged');
	  };

	  return LinkButton;

	})(Button);

	LinkPopover = (function(superClass) {
	  extend(LinkPopover, superClass);

	  function LinkPopover() {
	    return LinkPopover.__super__.constructor.apply(this, arguments);
	  }

	  LinkPopover.prototype.render = function() {
	    var tpl;
	    tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>" + (this._t('text')) + "</label>\n    <input class=\"link-text\" type=\"text\"/>\n    <a class=\"btn-unlink\" href=\"javascript:;\" title=\"" + (this._t('removeLink')) + "\" tabindex=\"-1\"><span class=\"simditor-icon simditor-icon-unlink\"></span></a>\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkUrl')) + "</label>\n    <input class=\"link-url\" type=\"text\"/>\n  </div>\n</div>";
	    this.el.addClass('link-popover').append(tpl);
	    this.textEl = this.el.find('.link-text');
	    this.urlEl = this.el.find('.link-url');
	    this.unlinkEl = this.el.find('.btn-unlink');
	    this.textEl.on('keyup', (function(_this) {
	      return function(e) {
	        if (e.which === 13) {
	          return;
	        }
	        return _this.target.text(_this.textEl.val());
	      };
	    })(this));
	    this.urlEl.on('keyup', (function(_this) {
	      return function(e) {
	        var val;
	        if (e.which === 13) {
	          return;
	        }
	        val = _this.urlEl.val();
	        if (!(/https?:\/\/|^\//ig.test(val) || !val)) {
	          val = 'http://' + val;
	        }
	        return _this.target.attr('href', val);
	      };
	    })(this));
	    $([this.urlEl[0], this.textEl[0]]).on('keydown', (function(_this) {
	      return function(e) {
	        if (e.which === 13 || e.which === 27 || (!e.shiftKey && e.which === 9 && $(e.target).hasClass('link-url'))) {
	          e.preventDefault();
	          return setTimeout(function() {
	            var range;
	            range = document.createRange();
	            _this.editor.selection.setRangeAfter(_this.target, range);
	            _this.hide();
	            return _this.editor.trigger('valuechanged');
	          }, 0);
	        }
	      };
	    })(this));
	    return this.unlinkEl.on('click', (function(_this) {
	      return function(e) {
	        var range, txtNode;
	        txtNode = document.createTextNode(_this.target.text());
	        _this.target.replaceWith(txtNode);
	        _this.hide();
	        range = document.createRange();
	        _this.editor.selection.setRangeAfter(txtNode, range);
	        return _this.editor.trigger('valuechanged');
	      };
	    })(this));
	  };

	  LinkPopover.prototype.show = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    LinkPopover.__super__.show.apply(this, args);
	    this.textEl.val(this.target.text());
	    return this.urlEl.val(this.target.attr('href'));
	  };

	  return LinkPopover;

	})(Popover);

	Simditor.Toolbar.addButton(LinkButton);

	ImageButton = (function(superClass) {
	  extend(ImageButton, superClass);

	  function ImageButton() {
	    return ImageButton.__super__.constructor.apply(this, arguments);
	  }

	  ImageButton.prototype.name = 'image';

	  ImageButton.prototype.icon = 'picture-o';

	  ImageButton.prototype.htmlTag = 'img';

	  ImageButton.prototype.disableTag = 'pre, table';

	  ImageButton.prototype.defaultImage = '';

	  ImageButton.prototype.needFocus = false;

	  ImageButton.prototype._init = function() {
	    var item, j, len, ref;
	    if (this.editor.opts.imageButton) {
	      if (Array.isArray(this.editor.opts.imageButton)) {
	        this.menu = [];
	        ref = this.editor.opts.imageButton;
	        for (j = 0, len = ref.length; j < len; j++) {
	          item = ref[j];
	          this.menu.push({
	            name: item + '-image',
	            text: this._t(item + 'Image')
	          });
	        }
	      } else {
	        this.menu = false;
	      }
	    } else {
	      if (this.editor.uploader != null) {
	        this.menu = [
	          {
	            name: 'upload-image',
	            text: this._t('uploadImage')
	          }, {
	            name: 'external-image',
	            text: this._t('externalImage')
	          }
	        ];
	      } else {
	        this.menu = false;
	      }
	    }
	    this.defaultImage = this.editor.opts.defaultImage;
	    this.editor.body.on('click', 'img:not([data-non-image])', (function(_this) {
	      return function(e) {
	        var $img, range;
	        $img = $(e.currentTarget);
	        range = document.createRange();
	        range.selectNode($img[0]);
	        _this.editor.selection.selectRange(range);
	        if (!_this.editor.util.support.onselectionchange) {
	          _this.editor.trigger('selectionchanged');
	        }
	        return false;
	      };
	    })(this));
	    this.editor.body.on('mouseup', 'img:not([data-non-image])', (function(_this) {
	      return function(e) {
	        return false;
	      };
	    })(this));
	    this.editor.on('selectionchanged.image', (function(_this) {
	      return function() {
	        var $contents, $img, range;
	        range = _this.editor.selection.getRange();
	        if (range == null) {
	          return;
	        }
	        $contents = $(range.cloneContents()).contents();
	        if ($contents.length === 1 && $contents.is('img:not([data-non-image])')) {
	          $img = $(range.startContainer).contents().eq(range.startOffset);
	          return _this.popover.show($img);
	        } else {
	          return _this.popover.hide();
	        }
	      };
	    })(this));
	    this.editor.on('valuechanged.image', (function(_this) {
	      return function() {
	        var $masks;
	        $masks = _this.editor.wrapper.find('.simditor-image-loading');
	        if (!($masks.length > 0)) {
	          return;
	        }
	        return $masks.each(function(i, mask) {
	          var $img, $mask, file;
	          $mask = $(mask);
	          $img = $mask.data('img');
	          if (!($img && $img.parent().length > 0)) {
	            $mask.remove();
	            if ($img) {
	              file = $img.data('file');
	              if (file) {
	                _this.editor.uploader.cancel(file);
	                if (_this.editor.body.find('img.uploading').length < 1) {
	                  return _this.editor.uploader.trigger('uploadready', [file]);
	                }
	              }
	            }
	          }
	        });
	      };
	    })(this));
	    return ImageButton.__super__._init.call(this);
	  };

	  ImageButton.prototype.render = function() {
	    var args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    ImageButton.__super__.render.apply(this, args);
	    this.popover = new ImagePopover({
	      button: this
	    });
	    if (this.editor.opts.imageButton === 'upload') {
	      return this._initUploader(this.el);
	    }
	  };

	  ImageButton.prototype.renderMenu = function() {
	    ImageButton.__super__.renderMenu.call(this);
	    return this._initUploader();
	  };

	  ImageButton.prototype._initUploader = function($uploadItem) {
	    var $input, createInput;
	    if ($uploadItem == null) {
	      $uploadItem = this.menuEl.find('.menu-item-upload-image');
	    }
	    if (this.editor.uploader == null) {
	      this.el.find('.btn-upload').remove();
	      return;
	    }
	    $input = null;
	    createInput = (function(_this) {
	      return function() {
	        if ($input) {
	          $input.remove();
	        }
	        return $input = $('<input type="file" title="' + _this._t('uploadImage') + '" accept="image/*">').appendTo($uploadItem);
	      };
	    })(this);
	    createInput();
	    $uploadItem.on('click mousedown', 'input[type=file]', (function(_this) {
	      return function(e) {
	        return e.stopPropagation();
	      };
	    })(this));
	    $uploadItem.on('change', 'input[type=file]', (function(_this) {
	      return function(e) {
	        if (_this.editor.inputManager.focused) {
	          _this.editor.uploader.upload($input, {
	            inline: true
	          });
	          createInput();
	        } else {
	          _this.editor.one('focus', function(e) {
	            _this.editor.uploader.upload($input, {
	              inline: true
	            });
	            return createInput();
	          });
	          _this.editor.focus();
	        }
	        return _this.wrapper.removeClass('menu-on');
	      };
	    })(this));
	    this.editor.uploader.on('beforeupload', (function(_this) {
	      return function(e, file) {
	        var $img;
	        if (!file.inline) {
	          return;
	        }
	        if (file.img) {
	          $img = $(file.img);
	        } else {
	          $img = _this.createImage(file.name);
	          file.img = $img;
	        }
	        $img.addClass('uploading');
	        $img.data('file', file);
	        return _this.editor.uploader.readImageFile(file.obj, function(img) {
	          var src;
	          if (!$img.hasClass('uploading')) {
	            return;
	          }
	          src = img ? img.src : _this.defaultImage;
	          return _this.loadImage($img, src, function() {
	            if (_this.popover.active) {
	              _this.popover.refresh();
	              return _this.popover.srcEl.val(_this._t('uploading')).prop('disabled', true);
	            }
	          });
	        });
	      };
	    })(this));
	    this.editor.uploader.on('uploadprogress', $.proxy(this.editor.util.throttle(function(e, file, loaded, total) {
	      var $img, $mask, percent;
	      if (!file.inline) {
	        return;
	      }
	      $mask = file.img.data('mask');
	      if (!$mask) {
	        return;
	      }
	      $img = $mask.data('img');
	      if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
	        $mask.remove();
	        return;
	      }
	      percent = loaded / total;
	      percent = (percent * 100).toFixed(0);
	      if (percent > 99) {
	        percent = 99;
	      }
	      return $mask.find('.progress').height((100 - percent) + "%");
	    }, 500), this));
	    this.editor.uploader.on('uploadsuccess', (function(_this) {
	      return function(e, file, result) {
	        var $img, $mask, msg;
	        if (!file.inline) {
	          return;
	        }
	        $img = file.img;
	        if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
	          return;
	        }
	        $img.removeData('file');
	        $img.removeClass('uploading').removeClass('loading');
	        $mask = $img.data('mask');
	        if ($mask) {
	          $mask.remove();
	        }
	        $img.removeData('mask');
	        if (typeof result !== 'object') {
	          try {
	            result = $.parseJSON(result);
	          } catch (_error) {
	            e = _error;
	            result = {
	              success: false
	            };
	          }
	        }
	        if (result.success === false) {
	          msg = result.msg || _this._t('uploadFailed');
	          alert(msg);
	          $img.attr('src', _this.defaultImage);
	        } else {
	          $img.attr('src', result.file_path);
	        }
	        if (_this.popover.active) {
	          _this.popover.srcEl.prop('disabled', false);
	          _this.popover.srcEl.val(result.file_path);
	        }
	        _this.editor.trigger('valuechanged');
	        if (_this.editor.body.find('img.uploading').length < 1) {
	          return _this.editor.uploader.trigger('uploadready', [file, result]);
	        }
	      };
	    })(this));
	    return this.editor.uploader.on('uploaderror', (function(_this) {
	      return function(e, file, xhr) {
	        var $img, $mask, msg, result;
	        if (!file.inline) {
	          return;
	        }
	        if (xhr.statusText === 'abort') {
	          return;
	        }
	        if (xhr.responseText) {
	          try {
	            result = $.parseJSON(xhr.responseText);
	            msg = result.msg;
	          } catch (_error) {
	            e = _error;
	            msg = _this._t('uploadError');
	          }
	          alert(msg);
	        }
	        $img = file.img;
	        if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
	          return;
	        }
	        $img.removeData('file');
	        $img.removeClass('uploading').removeClass('loading');
	        $mask = $img.data('mask');
	        if ($mask) {
	          $mask.remove();
	        }
	        $img.removeData('mask');
	        $img.attr('src', _this.defaultImage);
	        if (_this.popover.active) {
	          _this.popover.srcEl.prop('disabled', false);
	          _this.popover.srcEl.val(_this.defaultImage);
	        }
	        _this.editor.trigger('valuechanged');
	        if (_this.editor.body.find('img.uploading').length < 1) {
	          return _this.editor.uploader.trigger('uploadready', [file, result]);
	        }
	      };
	    })(this));
	  };

	  ImageButton.prototype.status = function($node) {
	    if ($node != null) {
	      this.setDisabled($node.is(this.disableTag));
	    }
	    if (this.disabled) {
	      return true;
	    }
	  };

	  ImageButton.prototype.loadImage = function($img, src, callback) {
	    var $mask, img, positionMask;
	    positionMask = (function(_this) {
	      return function() {
	        var imgOffset, wrapperOffset;
	        imgOffset = $img.offset();
	        wrapperOffset = _this.editor.wrapper.offset();
	        return $mask.css({
	          top: imgOffset.top - wrapperOffset.top,
	          left: imgOffset.left - wrapperOffset.left,
	          width: $img.width(),
	          height: $img.height()
	        }).show();
	      };
	    })(this);
	    $img.addClass('loading');
	    $mask = $img.data('mask');
	    if (!$mask) {
	      $mask = $('<div class="simditor-image-loading"><div class="progress"></div></div>').hide().appendTo(this.editor.wrapper);
	      positionMask();
	      $img.data('mask', $mask);
	      $mask.data('img', $img);
	    }
	    img = new Image();
	    img.onload = (function(_this) {
	      return function() {
	        var height, width;
	        if (!$img.hasClass('loading') && !$img.hasClass('uploading')) {
	          return;
	        }
	        width = img.width;
	        height = img.height;
	        $img.attr({
	          src: src,
	          'data-image-size': width + ',' + height
	        }).removeClass('loading');
	        if ($img.hasClass('uploading')) {
	          _this.editor.util.reflow(_this.editor.body);
	          positionMask();
	        } else {
	          $mask.remove();
	          $img.removeData('mask');
	        }
	        return callback(img);
	      };
	    })(this);
	    img.onerror = (function(_this) {
	      return function() {
	        callback(false);
	        $mask.remove();
	        return $img.removeData('mask').removeClass('loading');
	      };
	    })(this);
	    return img.src = src;
	  };

	  ImageButton.prototype.createImage = function(name) {
	    var $block, $img, $nextBlock, range;
	    if (name == null) {
	      name = 'Image';
	    }
	    if (!this.editor.inputManager.focused) {
	      this.editor.focus();
	    }
	    range = this.editor.selection.getRange();
	    range.deleteContents();
	    $block = this.editor.util.closestBlockEl();
	    if ($block.is('p') && !this.editor.util.isEmptyNode($block)) {
	      $block = $('<p/>').append(this.editor.util.phBr).insertAfter($block);
	      this.editor.selection.setRangeAtStartOf($block, range);
	    }
	    $img = $('<img/>').attr('alt', name);
	    range.insertNode($img[0]);
	    $nextBlock = $block.next('p');
	    if (!($nextBlock.length > 0)) {
	      $nextBlock = $('<p/>').append(this.editor.util.phBr).insertAfter($block);
	    }
	    this.editor.selection.setRangeAtStartOf($nextBlock);
	    return $img;
	  };

	  ImageButton.prototype.command = function(src) {
	    var $img;
	    $img = this.createImage();
	    return this.loadImage($img, src || this.defaultImage, (function(_this) {
	      return function() {
	        _this.editor.trigger('valuechanged');
	        _this.editor.util.reflow($img);
	        $img.click();
	        return _this.popover.one('popovershow', function() {
	          _this.popover.srcEl.focus();
	          return _this.popover.srcEl[0].select();
	        });
	      };
	    })(this));
	  };

	  return ImageButton;

	})(Button);

	ImagePopover = (function(superClass) {
	  extend(ImagePopover, superClass);

	  function ImagePopover() {
	    return ImagePopover.__super__.constructor.apply(this, arguments);
	  }

	  ImagePopover.prototype.offset = {
	    top: 6,
	    left: -4
	  };

	  ImagePopover.prototype.render = function() {
	    var tpl;
	    tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>" + (this._t('imageUrl')) + "</label>\n    <input class=\"image-src\" type=\"text\" tabindex=\"1\" />\n    <a class=\"btn-upload\" href=\"javascript:;\" title=\"" + (this._t('uploadImage')) + "\" tabindex=\"-1\">\n      <span class=\"simditor-icon simditor-icon-upload\"></span>\n    </a>\n  </div>\n  <div class='settings-field'>\n    <label>" + (this._t('imageAlt')) + "</label>\n    <input class=\"image-alt\" id=\"image-alt\" type=\"text\" tabindex=\"1\" />\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('imageSize')) + "</label>\n    <input class=\"image-size\" id=\"image-width\" type=\"text\" tabindex=\"2\" />\n    <span class=\"times\">×</span>\n    <input class=\"image-size\" id=\"image-height\" type=\"text\" tabindex=\"3\" />\n    <a class=\"btn-restore\" href=\"javascript:;\" title=\"" + (this._t('restoreImageSize')) + "\" tabindex=\"-1\">\n      <span class=\"simditor-icon simditor-icon-undo\"></span>\n    </a>\n  </div>\n</div>";
	    this.el.addClass('image-popover').append(tpl);
	    this.srcEl = this.el.find('.image-src');
	    this.widthEl = this.el.find('#image-width');
	    this.heightEl = this.el.find('#image-height');
	    this.altEl = this.el.find('#image-alt');
	    this.srcEl.on('keydown', (function(_this) {
	      return function(e) {
	        if (!(e.which === 13 && !_this.target.hasClass('uploading'))) {
	          return;
	        }
	        e.preventDefault();
	        _this.button.editor.body.focus();
	        _this.button.editor.selection.setRangeAfter(_this.target);
	        return _this.hide();
	      };
	    })(this));
	    this.srcEl.on('blur', (function(_this) {
	      return function(e) {
	        return _this._loadImage(_this.srcEl.val());
	      };
	    })(this));
	    this.el.find('.image-size').on('blur', (function(_this) {
	      return function(e) {
	        _this._resizeImg($(e.currentTarget));
	        return _this.el.data('popover').refresh();
	      };
	    })(this));
	    this.el.find('.image-size').on('keyup', (function(_this) {
	      return function(e) {
	        var inputEl;
	        inputEl = $(e.currentTarget);
	        if (!(e.which === 13 || e.which === 27 || e.which === 9)) {
	          return _this._resizeImg(inputEl, true);
	        }
	      };
	    })(this));
	    this.el.find('.image-size').on('keydown', (function(_this) {
	      return function(e) {
	        var inputEl;
	        inputEl = $(e.currentTarget);
	        if (e.which === 13 || e.which === 27) {
	          e.preventDefault();
	          if (e.which === 13) {
	            _this._resizeImg(inputEl);
	          } else {
	            _this._restoreImg();
	          }
	          _this.button.editor.body.focus();
	          _this.button.editor.selection.setRangeAfter(_this.target);
	          return _this.hide();
	        } else if (e.which === 9) {
	          return _this.el.data('popover').refresh();
	        }
	      };
	    })(this));
	    this.altEl.on('keydown', (function(_this) {
	      return function(e) {
	        if (e.which === 13) {
	          e.preventDefault();
	          _this.button.editor.body.focus();
	          _this.button.editor.selection.setRangeAfter(_this.target);
	          return _this.hide();
	        }
	      };
	    })(this));
	    this.altEl.on('keyup', (function(_this) {
	      return function(e) {
	        if (e.which === 13 || e.which === 27 || e.which === 9) {
	          return;
	        }
	        _this.alt = _this.altEl.val();
	        return _this.target.attr('alt', _this.alt);
	      };
	    })(this));
	    this.el.find('.btn-restore').on('click', (function(_this) {
	      return function(e) {
	        _this._restoreImg();
	        return _this.el.data('popover').refresh();
	      };
	    })(this));
	    this.editor.on('valuechanged', (function(_this) {
	      return function(e) {
	        if (_this.active) {
	          return _this.refresh();
	        }
	      };
	    })(this));
	    return this._initUploader();
	  };

	  ImagePopover.prototype._initUploader = function() {
	    var $uploadBtn, createInput;
	    $uploadBtn = this.el.find('.btn-upload');
	    if (this.editor.uploader == null) {
	      $uploadBtn.remove();
	      return;
	    }
	    createInput = (function(_this) {
	      return function() {
	        if (_this.input) {
	          _this.input.remove();
	        }
	        return _this.input = $('<input type="file" title="' + _this._t('uploadImage') + '" accept="image/*">').appendTo($uploadBtn);
	      };
	    })(this);
	    createInput();
	    this.el.on('click mousedown', 'input[type=file]', (function(_this) {
	      return function(e) {
	        return e.stopPropagation();
	      };
	    })(this));
	    return this.el.on('change', 'input[type=file]', (function(_this) {
	      return function(e) {
	        _this.editor.uploader.upload(_this.input, {
	          inline: true,
	          img: _this.target
	        });
	        return createInput();
	      };
	    })(this));
	  };

	  ImagePopover.prototype._resizeImg = function(inputEl, onlySetVal) {
	    var height, value, width;
	    if (onlySetVal == null) {
	      onlySetVal = false;
	    }
	    value = inputEl.val() * 1;
	    if (!($.isNumeric(value) || value < 0)) {
	      return;
	    }
	    if (inputEl.is(this.widthEl)) {
	      height = this.height * value / this.width;
	      this.heightEl.val(height);
	    } else {
	      width = this.width * value / this.height;
	      this.widthEl.val(width);
	    }
	    if (!onlySetVal) {
	      this.target.attr({
	        width: width || value,
	        height: height || value
	      });
	    }
	    return this.editor.trigger('valuechanged');
	  };

	  ImagePopover.prototype._restoreImg = function() {
	    var ref, size;
	    size = ((ref = this.target.data('image-size')) != null ? ref.split(",") : void 0) || [this.width, this.height];
	    this.target.attr({
	      width: size[0] * 1,
	      height: size[1] * 1
	    });
	    this.widthEl.val(size[0]);
	    this.heightEl.val(size[1]);
	    return this.editor.trigger('valuechanged');
	  };

	  ImagePopover.prototype._loadImage = function(src, callback) {
	    if (/^data:image/.test(src) && !this.editor.uploader) {
	      if (callback) {
	        callback(false);
	      }
	      return;
	    }
	    return this.button.loadImage(this.target, src, (function(_this) {
	      return function(img) {
	        var blob;
	        if (!img) {
	          return;
	        }
	        if (_this.active) {
	          _this.width = img.width;
	          _this.height = img.height;
	          _this.widthEl.val(_this.width);
	          _this.heightEl.val(_this.height);
	          _this.target.removeAttr('width').removeAttr('height');
	        }
	        if (/^data:image/.test(src)) {
	          blob = _this.editor.util.dataURLtoBlob(src);
	          blob.name = "Base64 Image.png";
	          _this.editor.uploader.upload(blob, {
	            inline: true,
	            img: _this.target
	          });
	        } else {
	          _this.editor.trigger('valuechanged');
	        }
	        if (callback) {
	          return callback(img);
	        }
	      };
	    })(this));
	  };

	  ImagePopover.prototype.show = function() {
	    var $img, args;
	    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	    ImagePopover.__super__.show.apply(this, args);
	    $img = this.target;
	    this.width = $img.width();
	    this.height = $img.height();
	    this.alt = $img.attr('alt');
	    if ($img.hasClass('uploading')) {
	      return this.srcEl.val(this._t('uploading')).prop('disabled', true);
	    } else {
	      this.srcEl.val($img.attr('src')).prop('disabled', false);
	      this.widthEl.val(this.width);
	      this.heightEl.val(this.height);
	      return this.altEl.val(this.alt);
	    }
	  };

	  return ImagePopover;

	})(Popover);

	Simditor.Toolbar.addButton(ImageButton);

	IndentButton = (function(superClass) {
	  extend(IndentButton, superClass);

	  function IndentButton() {
	    return IndentButton.__super__.constructor.apply(this, arguments);
	  }

	  IndentButton.prototype.name = 'indent';

	  IndentButton.prototype.icon = 'indent';

	  IndentButton.prototype._init = function() {
	    this.title = this._t(this.name) + ' (Tab)';
	    return IndentButton.__super__._init.call(this);
	  };

	  IndentButton.prototype.status = function($node) {
	    return true;
	  };

	  IndentButton.prototype.command = function() {
	    return this.editor.indentation.indent();
	  };

	  return IndentButton;

	})(Button);

	Simditor.Toolbar.addButton(IndentButton);

	OutdentButton = (function(superClass) {
	  extend(OutdentButton, superClass);

	  function OutdentButton() {
	    return OutdentButton.__super__.constructor.apply(this, arguments);
	  }

	  OutdentButton.prototype.name = 'outdent';

	  OutdentButton.prototype.icon = 'outdent';

	  OutdentButton.prototype._init = function() {
	    this.title = this._t(this.name) + ' (Shift + Tab)';
	    return OutdentButton.__super__._init.call(this);
	  };

	  OutdentButton.prototype.status = function($node) {
	    return true;
	  };

	  OutdentButton.prototype.command = function() {
	    return this.editor.indentation.indent(true);
	  };

	  return OutdentButton;

	})(Button);

	Simditor.Toolbar.addButton(OutdentButton);

	HrButton = (function(superClass) {
	  extend(HrButton, superClass);

	  function HrButton() {
	    return HrButton.__super__.constructor.apply(this, arguments);
	  }

	  HrButton.prototype.name = 'hr';

	  HrButton.prototype.icon = 'minus';

	  HrButton.prototype.htmlTag = 'hr';

	  HrButton.prototype.status = function($node) {
	    return true;
	  };

	  HrButton.prototype.command = function() {
	    var $hr, $newBlock, $nextBlock, $rootBlock;
	    $rootBlock = this.editor.util.furthestBlockEl();
	    $nextBlock = $rootBlock.next();
	    if ($nextBlock.length > 0) {
	      this.editor.selection.save();
	    } else {
	      $newBlock = $('<p/>').append(this.editor.util.phBr);
	    }
	    $hr = $('<hr/>').insertAfter($rootBlock);
	    if ($newBlock) {
	      $newBlock.insertAfter($hr);
	      this.editor.selection.setRangeAtStartOf($newBlock);
	    } else {
	      this.editor.selection.restore();
	    }
	    return this.editor.trigger('valuechanged');
	  };

	  return HrButton;

	})(Button);

	Simditor.Toolbar.addButton(HrButton);

	TableButton = (function(superClass) {
	  extend(TableButton, superClass);

	  function TableButton() {
	    return TableButton.__super__.constructor.apply(this, arguments);
	  }

	  TableButton.prototype.name = 'table';

	  TableButton.prototype.icon = 'table';

	  TableButton.prototype.htmlTag = 'table';

	  TableButton.prototype.disableTag = 'pre, li, blockquote';

	  TableButton.prototype.menu = true;

	  TableButton.prototype._init = function() {
	    TableButton.__super__._init.call(this);
	    $.merge(this.editor.formatter._allowedTags, ['tbody', 'tr', 'td', 'colgroup', 'col']);
	    $.extend(this.editor.formatter._allowedAttributes, {
	      td: ['rowspan', 'colspan'],
	      col: ['width']
	    });
	    this._initShortcuts();
	    this.editor.on('decorate', (function(_this) {
	      return function(e, $el) {
	        return $el.find('table').each(function(i, table) {
	          return _this.decorate($(table));
	        });
	      };
	    })(this));
	    this.editor.on('undecorate', (function(_this) {
	      return function(e, $el) {
	        return $el.find('table').each(function(i, table) {
	          return _this.undecorate($(table));
	        });
	      };
	    })(this));
	    this.editor.on('selectionchanged.table', (function(_this) {
	      return function(e) {
	        var $container, range;
	        _this.editor.body.find('.simditor-table td').removeClass('active');
	        range = _this.editor.selection.getRange();
	        if (range == null) {
	          return;
	        }
	        $container = $(range.commonAncestorContainer);
	        if (range.collapsed && $container.is('.simditor-table')) {
	          if (_this.editor.selection.rangeAtStartOf($container)) {
	            $container = $container.find('td:first');
	          } else {
	            $container = $container.find('td:last');
	          }
	          _this.editor.selection.setRangeAtEndOf($container);
	        }
	        return $container.closest('td', _this.editor.body).addClass('active');
	      };
	    })(this));
	    this.editor.on('blur.table', (function(_this) {
	      return function(e) {
	        return _this.editor.body.find('.simditor-table td').removeClass('active');
	      };
	    })(this));
	    this.editor.inputManager.addKeystrokeHandler('38', 'td', (function(_this) {
	      return function(e, $node) {
	        var $prevTr, $tr, index;
	        $tr = $node.parent('tr');
	        $prevTr = $tr.prev('tr');
	        if (!($prevTr.length > 0)) {
	          return true;
	        }
	        index = $tr.find('td').index($node);
	        _this.editor.selection.setRangeAtEndOf($prevTr.find('td').eq(index));
	        return true;
	      };
	    })(this));
	    return this.editor.inputManager.addKeystrokeHandler('40', 'td', (function(_this) {
	      return function(e, $node) {
	        var $nextTr, $tr, index;
	        $tr = $node.parent('tr');
	        $nextTr = $tr.next('tr');
	        if (!($nextTr.length > 0)) {
	          return true;
	        }
	        index = $tr.find('td').index($node);
	        _this.editor.selection.setRangeAtEndOf($nextTr.find('td').eq(index));
	        return true;
	      };
	    })(this));
	  };

	  TableButton.prototype.initResize = function($table) {
	    var $colgroup, $resizeHandle, $wrapper;
	    $wrapper = $table.parent('.simditor-table');
	    $colgroup = $table.find('colgroup');
	    if ($colgroup.length < 1) {
	      $colgroup = $('<colgroup/>').prependTo($table);
	      $table.find('tr:first td').each((function(_this) {
	        return function(i, td) {
	          var $col;
	          return $col = $('<col/>').appendTo($colgroup);
	        };
	      })(this));
	      this.refreshTableWidth($table);
	    }
	    $resizeHandle = $('<div class="simditor-resize-handle" contenteditable="false"></div>').appendTo($wrapper);
	    $wrapper.on('mousemove', 'td', (function(_this) {
	      return function(e) {
	        var $col, $td, index, ref, ref1, x;
	        if ($wrapper.hasClass('resizing')) {
	          return;
	        }
	        $td = $(e.currentTarget);
	        x = e.pageX - $(e.currentTarget).offset().left;
	        if (x < 5 && $td.prev().length > 0) {
	          $td = $td.prev();
	        }
	        if ($td.next('td').length < 1) {
	          $resizeHandle.hide();
	          return;
	        }
	        if ((ref = $resizeHandle.data('td')) != null ? ref.is($td) : void 0) {
	          $resizeHandle.show();
	          return;
	        }
	        index = $td.parent().find('td').index($td);
	        $col = $colgroup.find('col').eq(index);
	        if ((ref1 = $resizeHandle.data('col')) != null ? ref1.is($col) : void 0) {
	          $resizeHandle.show();
	          return;
	        }
	        return $resizeHandle.css('left', $td.position().left + $td.outerWidth() - 5).data('td', $td).data('col', $col).show();
	      };
	    })(this));
	    $wrapper.on('mouseleave', (function(_this) {
	      return function(e) {
	        return $resizeHandle.hide();
	      };
	    })(this));
	    return $wrapper.on('mousedown', '.simditor-resize-handle', (function(_this) {
	      return function(e) {
	        var $handle, $leftCol, $leftTd, $rightCol, $rightTd, minWidth, startHandleLeft, startLeftWidth, startRightWidth, startX, tableWidth;
	        $handle = $(e.currentTarget);
	        $leftTd = $handle.data('td');
	        $leftCol = $handle.data('col');
	        $rightTd = $leftTd.next('td');
	        $rightCol = $leftCol.next('col');
	        startX = e.pageX;
	        startLeftWidth = $leftTd.outerWidth() * 1;
	        startRightWidth = $rightTd.outerWidth() * 1;
	        startHandleLeft = parseFloat($handle.css('left'));
	        tableWidth = $leftTd.closest('table').width();
	        minWidth = 50;
	        $(document).on('mousemove.simditor-resize-table', function(e) {
	          var deltaX, leftWidth, rightWidth;
	          deltaX = e.pageX - startX;
	          leftWidth = startLeftWidth + deltaX;
	          rightWidth = startRightWidth - deltaX;
	          if (leftWidth < minWidth) {
	            leftWidth = minWidth;
	            deltaX = minWidth - startLeftWidth;
	            rightWidth = startRightWidth - deltaX;
	          } else if (rightWidth < minWidth) {
	            rightWidth = minWidth;
	            deltaX = startRightWidth - minWidth;
	            leftWidth = startLeftWidth + deltaX;
	          }
	          $leftCol.attr('width', (leftWidth / tableWidth * 100) + '%');
	          $rightCol.attr('width', (rightWidth / tableWidth * 100) + '%');
	          return $handle.css('left', startHandleLeft + deltaX);
	        });
	        $(document).one('mouseup.simditor-resize-table', function(e) {
	          $(document).off('.simditor-resize-table');
	          return $wrapper.removeClass('resizing');
	        });
	        $wrapper.addClass('resizing');
	        return false;
	      };
	    })(this));
	  };

	  TableButton.prototype._initShortcuts = function() {
	    this.editor.inputManager.addShortcut('ctrl+alt+up', (function(_this) {
	      return function(e) {
	        _this.editMenu.find('.menu-item[data-param=insertRowAbove]').click();
	        return false;
	      };
	    })(this));
	    this.editor.inputManager.addShortcut('ctrl+alt+down', (function(_this) {
	      return function(e) {
	        _this.editMenu.find('.menu-item[data-param=insertRowBelow]').click();
	        return false;
	      };
	    })(this));
	    this.editor.inputManager.addShortcut('ctrl+alt+left', (function(_this) {
	      return function(e) {
	        _this.editMenu.find('.menu-item[data-param=insertColLeft]').click();
	        return false;
	      };
	    })(this));
	    return this.editor.inputManager.addShortcut('ctrl+alt+right', (function(_this) {
	      return function(e) {
	        _this.editMenu.find('.menu-item[data-param=insertColRight]').click();
	        return false;
	      };
	    })(this));
	  };

	  TableButton.prototype.decorate = function($table) {
	    if ($table.parent('.simditor-table').length > 0) {
	      this.undecorate($table);
	    }
	    $table.wrap('<div class="simditor-table"></div>');
	    this.initResize($table);
	    return $table.parent();
	  };

	  TableButton.prototype.undecorate = function($table) {
	    if (!($table.parent('.simditor-table').length > 0)) {
	      return;
	    }
	    return $table.parent().replaceWith($table);
	  };

	  TableButton.prototype.renderMenu = function() {
	    $("<div class=\"menu-create-table\">\n</div>\n<div class=\"menu-edit-table\">\n  <ul>\n    <li><a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\" href=\"javascript:;\" data-param=\"deleteRow\"><span>" + (this._t('deleteRow')) + "</span></a></li>\n    <li><a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\" href=\"javascript:;\" data-param=\"insertRowAbove\"><span>" + (this._t('insertRowAbove')) + " ( Ctrl + Alt + ↑ )</span></a></li>\n    <li><a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\" href=\"javascript:;\" data-param=\"insertRowBelow\"><span>" + (this._t('insertRowBelow')) + " ( Ctrl + Alt + ↓ )</span></a></li>\n    <li><span class=\"separator\"></span></li>\n    <li><a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\" href=\"javascript:;\" data-param=\"deleteCol\"><span>" + (this._t('deleteColumn')) + "</span></a></li>\n    <li><a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\" href=\"javascript:;\" data-param=\"insertColLeft\"><span>" + (this._t('insertColumnLeft')) + " ( Ctrl + Alt + ← )</span></a></li>\n    <li><a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\" href=\"javascript:;\" data-param=\"insertColRight\"><span>" + (this._t('insertColumnRight')) + " ( Ctrl + Alt + → )</span></a></li>\n    <li><span class=\"separator\"></span></li>\n    <li><a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\" href=\"javascript:;\" data-param=\"deleteTable\"><span>" + (this._t('deleteTable')) + "</span></a></li>\n  </ul>\n</div>").appendTo(this.menuWrapper);
	    this.createMenu = this.menuWrapper.find('.menu-create-table');
	    this.editMenu = this.menuWrapper.find('.menu-edit-table');
	    this.createTable(6, 6).appendTo(this.createMenu);
	    this.createMenu.on('mouseenter', 'td', (function(_this) {
	      return function(e) {
	        var $td, $tr, num;
	        _this.createMenu.find('td').removeClass('selected');
	        $td = $(e.currentTarget);
	        $tr = $td.parent();
	        num = $tr.find('td').index($td) + 1;
	        return $tr.prevAll('tr').addBack().find('td:lt(' + num + ')').addClass('selected');
	      };
	    })(this));
	    this.createMenu.on('mouseleave', (function(_this) {
	      return function(e) {
	        return $(e.currentTarget).find('td').removeClass('selected');
	      };
	    })(this));
	    return this.createMenu.on('mousedown', 'td', (function(_this) {
	      return function(e) {
	        var $closestBlock, $table, $td, $tr, colNum, rowNum;
	        _this.wrapper.removeClass('menu-on');
	        if (!_this.editor.inputManager.focused) {
	          return;
	        }
	        $td = $(e.currentTarget);
	        $tr = $td.parent();
	        colNum = $tr.find('td').index($td) + 1;
	        rowNum = $tr.prevAll('tr').length + 1;
	        $table = _this.createTable(rowNum, colNum, true);
	        $closestBlock = _this.editor.util.closestBlockEl();
	        if (_this.editor.util.isEmptyNode($closestBlock)) {
	          $closestBlock.replaceWith($table);
	        } else {
	          $closestBlock.after($table);
	        }
	        _this.decorate($table);
	        _this.editor.selection.setRangeAtStartOf($table.find('td:first'));
	        _this.editor.trigger('valuechanged');
	        return false;
	      };
	    })(this));
	  };

	  TableButton.prototype.createTable = function(row, col, phBr) {
	    var $table, $tbody, $td, $tr, c, j, k, r, ref, ref1;
	    $table = $('<table/>');
	    $tbody = $('<tbody/>').appendTo($table);
	    for (r = j = 0, ref = row; 0 <= ref ? j < ref : j > ref; r = 0 <= ref ? ++j : --j) {
	      $tr = $('<tr/>').appendTo($tbody);
	      for (c = k = 0, ref1 = col; 0 <= ref1 ? k < ref1 : k > ref1; c = 0 <= ref1 ? ++k : --k) {
	        $td = $('<td/>').appendTo($tr);
	        if (phBr) {
	          $td.append(this.editor.util.phBr);
	        }
	      }
	    }
	    return $table;
	  };

	  TableButton.prototype.refreshTableWidth = function($table) {
	    var cols, tableWidth;
	    tableWidth = $table.width();
	    cols = $table.find('col');
	    return $table.find('tr:first td').each((function(_this) {
	      return function(i, td) {
	        var $col;
	        $col = cols.eq(i);
	        return $col.attr('width', ($(td).outerWidth() / tableWidth * 100) + '%');
	      };
	    })(this));
	  };

	  TableButton.prototype.setActive = function(active) {
	    TableButton.__super__.setActive.call(this, active);
	    if (active) {
	      this.createMenu.hide();
	      return this.editMenu.show();
	    } else {
	      this.createMenu.show();
	      return this.editMenu.hide();
	    }
	  };

	  TableButton.prototype.deleteRow = function($td) {
	    var $newTr, $tr, index;
	    $tr = $td.parent('tr');
	    if ($tr.siblings('tr').length < 1) {
	      return this.deleteTable($td);
	    } else {
	      $newTr = $tr.next('tr');
	      if (!($newTr.length > 0)) {
	        $newTr = $tr.prev('tr');
	      }
	      index = $tr.find('td').index($td);
	      $tr.remove();
	      return this.editor.selection.setRangeAtEndOf($newTr.find('td').eq(index));
	    }
	  };

	  TableButton.prototype.insertRow = function($td, direction) {
	    var $newTr, $table, $tr, colNum, i, index, j, ref;
	    if (direction == null) {
	      direction = 'after';
	    }
	    $tr = $td.parent('tr');
	    $table = $tr.closest('table');
	    colNum = 0;
	    $table.find('tr').each((function(_this) {
	      return function(i, tr) {
	        return colNum = Math.max(colNum, $(tr).find('td').length);
	      };
	    })(this));
	    $newTr = $('<tr/>');
	    for (i = j = 1, ref = colNum; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
	      $('<td/>').append(this.editor.util.phBr).appendTo($newTr);
	    }
	    $tr[direction]($newTr);
	    index = $tr.find('td').index($td);
	    return this.editor.selection.setRangeAtStartOf($newTr.find('td').eq(index));
	  };

	  TableButton.prototype.deleteCol = function($td) {
	    var $newTd, $table, $tr, index;
	    $tr = $td.parent('tr');
	    if ($tr.siblings('tr').length < 1 && $td.siblings('td').length < 1) {
	      return this.deleteTable($td);
	    } else {
	      index = $tr.find('td').index($td);
	      $newTd = $td.next('td');
	      if (!($newTd.length > 0)) {
	        $newTd = $tr.prev('td');
	      }
	      $table = $tr.closest('table');
	      $table.find('col').eq(index).remove();
	      $table.find('tr').each((function(_this) {
	        return function(i, tr) {
	          return $(tr).find('td').eq(index).remove();
	        };
	      })(this));
	      this.refreshTableWidth($table);
	      return this.editor.selection.setRangeAtEndOf($newTd);
	    }
	  };

	  TableButton.prototype.insertCol = function($td, direction) {
	    var $col, $newCol, $newTd, $table, $tr, index, tableWidth, width;
	    if (direction == null) {
	      direction = 'after';
	    }
	    $tr = $td.parent('tr');
	    index = $tr.find('td').index($td);
	    $table = $td.closest('table');
	    $col = $table.find('col').eq(index);
	    $table.find('tr').each((function(_this) {
	      return function(i, tr) {
	        var $newTd;
	        $newTd = $('<td/>').append(_this.editor.util.phBr);
	        return $(tr).find('td').eq(index)[direction]($newTd);
	      };
	    })(this));
	    $newCol = $('<col/>');
	    $col[direction]($newCol);
	    tableWidth = $table.width();
	    width = Math.max(parseFloat($col.attr('width')) / 2, 50 / tableWidth * 100);
	    $col.attr('width', width + '%');
	    $newCol.attr('width', width + '%');
	    this.refreshTableWidth($table);
	    $newTd = direction === 'after' ? $td.next('td') : $td.prev('td');
	    return this.editor.selection.setRangeAtStartOf($newTd);
	  };

	  TableButton.prototype.deleteTable = function($td) {
	    var $block, $table;
	    $table = $td.closest('.simditor-table');
	    $block = $table.next('p');
	    $table.remove();
	    if ($block.length > 0) {
	      return this.editor.selection.setRangeAtStartOf($block);
	    }
	  };

	  TableButton.prototype.command = function(param) {
	    var $td, range;
	    range = this.editor.selection.getRange();
	    $td = $(range.commonAncestorContainer).closest('td');
	    if (!($td.length > 0)) {
	      return;
	    }
	    if (param === 'deleteRow') {
	      this.deleteRow($td);
	    } else if (param === 'insertRowAbove') {
	      this.insertRow($td, 'before');
	    } else if (param === 'insertRowBelow') {
	      this.insertRow($td);
	    } else if (param === 'deleteCol') {
	      this.deleteCol($td);
	    } else if (param === 'insertColLeft') {
	      this.insertCol($td, 'before');
	    } else if (param === 'insertColRight') {
	      this.insertCol($td);
	    } else if (param === 'deleteTable') {
	      this.deleteTable($td);
	    } else {
	      return;
	    }
	    return this.editor.trigger('valuechanged');
	  };

	  return TableButton;

	})(Button);

	Simditor.Toolbar.addButton(TableButton);

	StrikethroughButton = (function(superClass) {
	  extend(StrikethroughButton, superClass);

	  function StrikethroughButton() {
	    return StrikethroughButton.__super__.constructor.apply(this, arguments);
	  }

	  StrikethroughButton.prototype.name = 'strikethrough';

	  StrikethroughButton.prototype.icon = 'strikethrough';

	  StrikethroughButton.prototype.htmlTag = 'strike';

	  StrikethroughButton.prototype.disableTag = 'pre';

	  StrikethroughButton.prototype.status = function($node) {
	    var active;
	    if ($node != null) {
	      this.setDisabled($node.is(this.disableTag));
	    }
	    if (this.disabled) {
	      return true;
	    }
	    active = document.queryCommandState('strikethrough') === true;
	    this.setActive(active);
	    return active;
	  };

	  StrikethroughButton.prototype.command = function() {
	    document.execCommand('strikethrough');
	    if (!this.editor.util.support.oninput) {
	      this.editor.trigger('valuechanged');
	    }
	    return $(document).trigger('selectionchange');
	  };

	  return StrikethroughButton;

	})(Button);

	Simditor.Toolbar.addButton(StrikethroughButton);

	return Simditor;

	}));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module unless amdModuleId is set
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(13),__webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, SimpleModule) {
	      return (root['hotkeys'] = factory($, SimpleModule));
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory(require("jquery"),require("simplemodule"));
	  } else {
	    root.simple = root.simple || {};
	    root.simple['hotkeys'] = factory(jQuery,SimpleModule);
	  }
	}(this, function ($, SimpleModule) {

	var Hotkeys, hotkeys,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	Hotkeys = (function(superClass) {
	  extend(Hotkeys, superClass);

	  function Hotkeys() {
	    return Hotkeys.__super__.constructor.apply(this, arguments);
	  }

	  Hotkeys.count = 0;

	  Hotkeys.keyNameMap = {
	    8: "Backspace",
	    9: "Tab",
	    13: "Enter",
	    16: "Shift",
	    17: "Control",
	    18: "Alt",
	    19: "Pause",
	    20: "CapsLock",
	    27: "Esc",
	    32: "Spacebar",
	    33: "PageUp",
	    34: "PageDown",
	    35: "End",
	    36: "Home",
	    37: "Left",
	    38: "Up",
	    39: "Right",
	    40: "Down",
	    45: "Insert",
	    46: "Del",
	    91: "Meta",
	    93: "Meta",
	    48: "0",
	    49: "1",
	    50: "2",
	    51: "3",
	    52: "4",
	    53: "5",
	    54: "6",
	    55: "7",
	    56: "8",
	    57: "9",
	    65: "A",
	    66: "B",
	    67: "C",
	    68: "D",
	    69: "E",
	    70: "F",
	    71: "G",
	    72: "H",
	    73: "I",
	    74: "J",
	    75: "K",
	    76: "L",
	    77: "M",
	    78: "N",
	    79: "O",
	    80: "P",
	    81: "Q",
	    82: "R",
	    83: "S",
	    84: "T",
	    85: "U",
	    86: "V",
	    87: "W",
	    88: "X",
	    89: "Y",
	    90: "Z",
	    96: "0",
	    97: "1",
	    98: "2",
	    99: "3",
	    100: "4",
	    101: "5",
	    102: "6",
	    103: "7",
	    104: "8",
	    105: "9",
	    106: "Multiply",
	    107: "Add",
	    109: "Subtract",
	    110: "Decimal",
	    111: "Divide",
	    112: "F1",
	    113: "F2",
	    114: "F3",
	    115: "F4",
	    116: "F5",
	    117: "F6",
	    118: "F7",
	    119: "F8",
	    120: "F9",
	    121: "F10",
	    122: "F11",
	    123: "F12",
	    124: "F13",
	    125: "F14",
	    126: "F15",
	    127: "F16",
	    128: "F17",
	    129: "F18",
	    130: "F19",
	    131: "F20",
	    132: "F21",
	    133: "F22",
	    134: "F23",
	    135: "F24",
	    59: ";",
	    61: "=",
	    186: ";",
	    187: "=",
	    188: ",",
	    190: ".",
	    191: "/",
	    192: "`",
	    219: "[",
	    220: "\\",
	    221: "]",
	    222: "'"
	  };

	  Hotkeys.aliases = {
	    "escape": "esc",
	    "delete": "del",
	    "return": "enter",
	    "ctrl": "control",
	    "space": "spacebar",
	    "ins": "insert",
	    "cmd": "meta",
	    "command": "meta",
	    "wins": "meta",
	    "windows": "meta"
	  };

	  Hotkeys.normalize = function(shortcut) {
	    var i, j, key, keyname, keys, len;
	    keys = shortcut.toLowerCase().replace(/\s+/gi, "").split("+");
	    for (i = j = 0, len = keys.length; j < len; i = ++j) {
	      key = keys[i];
	      keys[i] = this.aliases[key] || key;
	    }
	    keyname = keys.pop();
	    keys.sort().push(keyname);
	    return keys.join("_");
	  };

	  Hotkeys.prototype.opts = {
	    el: document
	  };

	  Hotkeys.prototype._init = function() {
	    this.id = ++this.constructor.count;
	    this._map = {};
	    this._delegate = typeof this.opts.el === "string" ? document : this.opts.el;
	    return $(this._delegate).on("keydown.simple-hotkeys-" + this.id, this.opts.el, (function(_this) {
	      return function(e) {
	        var ref;
	        return (ref = _this._getHander(e)) != null ? ref.call(_this, e) : void 0;
	      };
	    })(this));
	  };

	  Hotkeys.prototype._getHander = function(e) {
	    var keyname, shortcut;
	    if (!(keyname = this.constructor.keyNameMap[e.which])) {
	      return;
	    }
	    shortcut = "";
	    if (e.altKey) {
	      shortcut += "alt_";
	    }
	    if (e.ctrlKey) {
	      shortcut += "control_";
	    }
	    if (e.metaKey) {
	      shortcut += "meta_";
	    }
	    if (e.shiftKey) {
	      shortcut += "shift_";
	    }
	    shortcut += keyname.toLowerCase();
	    return this._map[shortcut];
	  };

	  Hotkeys.prototype.respondTo = function(subject) {
	    if (typeof subject === 'string') {
	      return this._map[this.constructor.normalize(subject)] != null;
	    } else {
	      return this._getHander(subject) != null;
	    }
	  };

	  Hotkeys.prototype.add = function(shortcut, handler) {
	    this._map[this.constructor.normalize(shortcut)] = handler;
	    return this;
	  };

	  Hotkeys.prototype.remove = function(shortcut) {
	    delete this._map[this.constructor.normalize(shortcut)];
	    return this;
	  };

	  Hotkeys.prototype.destroy = function() {
	    $(this._delegate).off(".simple-hotkeys-" + this.id);
	    this._map = {};
	    return this;
	  };

	  return Hotkeys;

	})(SimpleModule);

	hotkeys = function(opts) {
	  return new Hotkeys(opts);
	};

	return hotkeys;

	}));



/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module unless amdModuleId is set
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(13),__webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, SimpleModule) {
	      return (root['uploader'] = factory($, SimpleModule));
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory(require("jquery"),require("simplemodule"));
	  } else {
	    root.simple = root.simple || {};
	    root.simple['uploader'] = factory(jQuery,SimpleModule);
	  }
	}(this, function ($, SimpleModule) {

	var Uploader, uploader,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	Uploader = (function(superClass) {
	  extend(Uploader, superClass);

	  function Uploader() {
	    return Uploader.__super__.constructor.apply(this, arguments);
	  }

	  Uploader.count = 0;

	  Uploader.prototype.opts = {
	    url: '',
	    params: null,
	    fileKey: 'upload_file',
	    connectionCount: 3
	  };

	  Uploader.prototype._init = function() {
	    this.files = [];
	    this.queue = [];
	    this.id = ++Uploader.count;
	    this.on('uploadcomplete', (function(_this) {
	      return function(e, file) {
	        _this.files.splice($.inArray(file, _this.files), 1);
	        if (_this.queue.length > 0 && _this.files.length < _this.opts.connectionCount) {
	          return _this.upload(_this.queue.shift());
	        } else {
	          return _this.uploading = false;
	        }
	      };
	    })(this));
	    return $(window).on('beforeunload.uploader-' + this.id, (function(_this) {
	      return function(e) {
	        if (!_this.uploading) {
	          return;
	        }
	        e.originalEvent.returnValue = _this._t('leaveConfirm');
	        return _this._t('leaveConfirm');
	      };
	    })(this));
	  };

	  Uploader.prototype.generateId = (function() {
	    var id;
	    id = 0;
	    return function() {
	      return id += 1;
	    };
	  })();

	  Uploader.prototype.upload = function(file, opts) {
	    var f, i, key, len;
	    if (opts == null) {
	      opts = {};
	    }
	    if (file == null) {
	      return;
	    }
	    if ($.isArray(file) || file instanceof FileList) {
	      for (i = 0, len = file.length; i < len; i++) {
	        f = file[i];
	        this.upload(f, opts);
	      }
	    } else if ($(file).is('input:file')) {
	      key = $(file).attr('name');
	      if (key) {
	        opts.fileKey = key;
	      }
	      this.upload($.makeArray($(file)[0].files), opts);
	    } else if (!file.id || !file.obj) {
	      file = this.getFile(file);
	    }
	    if (!(file && file.obj)) {
	      return;
	    }
	    $.extend(file, opts);
	    if (this.files.length >= this.opts.connectionCount) {
	      this.queue.push(file);
	      return;
	    }
	    if (this.triggerHandler('beforeupload', [file]) === false) {
	      return;
	    }
	    this.files.push(file);
	    this._xhrUpload(file);
	    return this.uploading = true;
	  };

	  Uploader.prototype.getFile = function(fileObj) {
	    var name, ref, ref1;
	    if (fileObj instanceof window.File || fileObj instanceof window.Blob) {
	      name = (ref = fileObj.fileName) != null ? ref : fileObj.name;
	    } else {
	      return null;
	    }
	    return {
	      id: this.generateId(),
	      url: this.opts.url,
	      params: this.opts.params,
	      fileKey: this.opts.fileKey,
	      name: name,
	      size: (ref1 = fileObj.fileSize) != null ? ref1 : fileObj.size,
	      ext: name ? name.split('.').pop().toLowerCase() : '',
	      obj: fileObj
	    };
	  };

	  Uploader.prototype._xhrUpload = function(file) {
	    var formData, k, ref, v;
	    formData = new FormData();
	    formData.append(file.fileKey, file.obj);
	    formData.append("original_filename", file.name);
	    if (file.params) {
	      ref = file.params;
	      for (k in ref) {
	        v = ref[k];
	        formData.append(k, v);
	      }
	    }
	    return file.xhr = $.ajax({
	      url: file.url,
	      data: formData,
	      processData: false,
	      contentType: false,
	      type: 'POST',
	      headers: {
	        'X-File-Name': encodeURIComponent(file.name)
	      },
	      xhr: function() {
	        var req;
	        req = $.ajaxSettings.xhr();
	        if (req) {
	          req.upload.onprogress = (function(_this) {
	            return function(e) {
	              return _this.progress(e);
	            };
	          })(this);
	        }
	        return req;
	      },
	      progress: (function(_this) {
	        return function(e) {
	          if (!e.lengthComputable) {
	            return;
	          }
	          return _this.trigger('uploadprogress', [file, e.loaded, e.total]);
	        };
	      })(this),
	      error: (function(_this) {
	        return function(xhr, status, err) {
	          return _this.trigger('uploaderror', [file, xhr, status]);
	        };
	      })(this),
	      success: (function(_this) {
	        return function(result) {
	          _this.trigger('uploadprogress', [file, file.size, file.size]);
	          _this.trigger('uploadsuccess', [file, result]);
	          return $(document).trigger('uploadsuccess', [file, result, _this]);
	        };
	      })(this),
	      complete: (function(_this) {
	        return function(xhr, status) {
	          return _this.trigger('uploadcomplete', [file, xhr.responseText]);
	        };
	      })(this)
	    });
	  };

	  Uploader.prototype.cancel = function(file) {
	    var f, i, len, ref;
	    if (!file.id) {
	      ref = this.files;
	      for (i = 0, len = ref.length; i < len; i++) {
	        f = ref[i];
	        if (f.id === file * 1) {
	          file = f;
	          break;
	        }
	      }
	    }
	    this.trigger('uploadcancel', [file]);
	    if (file.xhr) {
	      file.xhr.abort();
	    }
	    return file.xhr = null;
	  };

	  Uploader.prototype.readImageFile = function(fileObj, callback) {
	    var fileReader, img;
	    if (!$.isFunction(callback)) {
	      return;
	    }
	    img = new Image();
	    img.onload = function() {
	      return callback(img);
	    };
	    img.onerror = function() {
	      return callback();
	    };
	    if (window.FileReader && FileReader.prototype.readAsDataURL && /^image/.test(fileObj.type)) {
	      fileReader = new FileReader();
	      fileReader.onload = function(e) {
	        return img.src = e.target.result;
	      };
	      return fileReader.readAsDataURL(fileObj);
	    } else {
	      return callback();
	    }
	  };

	  Uploader.prototype.destroy = function() {
	    var file, i, len, ref;
	    this.queue.length = 0;
	    ref = this.files;
	    for (i = 0, len = ref.length; i < len; i++) {
	      file = ref[i];
	      this.cancel(file);
	    }
	    $(window).off('.uploader-' + this.id);
	    return $(document).off('.uploader-' + this.id);
	  };

	  Uploader.i18n = {
	    'zh-CN': {
	      leaveConfirm: '正在上传文件，如果离开上传会自动取消'
	    }
	  };

	  Uploader.locale = 'zh-CN';

	  return Uploader;

	})(SimpleModule);

	uploader = function(opts) {
	  return new Uploader(opts);
	};

	return uploader;

	}));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(18);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(19)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./simditor.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./simditor.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(21)();
	exports.push([module.id, "/*!\n* Simditor v2.1.9\n* http://simditor.tower.im/\n* 2015-28-04\n*/\n@font-face {\n  font-family: 'Simditor';\n  src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABjcAA4AAAAAJnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAYwAAAABsAAAAccuyiWE9TLzIAAAG0AAAARQAAAGAQ+ZGCY21hcAAAAkAAAABRAAABWuAwGx9jdnQgAAAEeAAAAAoAAAAKAwQAxGZwZ20AAAKUAAABsQAAAmUPtC+nZ2x5ZgAABMQAABJlAAAcyB43YbdoZWFkAAABRAAAADAAAAA2BiBqimhoZWEAAAF0AAAAHQAAACQH9AToaG10eAAAAfwAAABDAAAAfGTkAJBsb2NhAAAEhAAAAEAAAABAZZJsZm1heHAAAAGUAAAAIAAAACABQQG4bmFtZQAAFywAAAEEAAAB12fQ/+Zwb3N0AAAYMAAAAI0AAAEw8uYuXHByZXAAAARIAAAALgAAAC6w8isUeNpjYGRgYABi/X865+P5bb4yyDN/AIowXIyaXIug/zuzWDAnALkcDEwgUQBQAAs9eNpjYGRgYE5gmMAQzWLBAARAkpEBFcgDADC4AegAAAAAAQAAAB8AoAAKAAAAAAACAAEAAgAWAAABAAEUAAAAAHjaY2BhbmScwMDKwMDUz3SQgYGhF0IzPmYwYmQBijKwMjPAAKMAAxo4wMDwQYI54X8BQzRzAsOEBqAaJFkFBkYARfkLFAAAAHjaY8xhUGQAAsYABgbmDwjMYsEgzyzBwMDkAOQnALEEgx1UjhNMr4BjTqBakDxC/wqIPsYMqJoEKIbpg6oFAEfgEckAeNpjYGBgZoBgGQZGBhAIAfIYwXwWBgsgzcXAwcAEhAwMvAwKHyT+/werArEZgGzm/9//PxVgg+qFAkY2iJFgNkgnCwMqAKpmZRjeAACyngtDAAAAeNpdUbtOW0EQ3Q0PA4HE2CA52hSzmZAC74U2SCCuLsLIdmM5QtqNXORiXMAHUCBRg/ZrBmgoU6RNg5ALJD6BT4iUmTWJojQ7O7NzzpkzS8qRqndpveepcxZI4W6DZpt+J6TaRYAH0vWNRkbawSMtNjN65bp9v4/BZjTlThpAec9bykNG006gFu25fzI/g+E+/8s8B4OWZpqeWmchPYTAfDNuafA1o1l3/UFfsTpcDQaGFNNU3PXHVMr/luZcbRm2NjOad3AhIj+YBmhqrY1A0586pHo+jmIJcvlsrA0mpqw/yURwYTJd1VQtM752cJ/sLDrYpEpz4AEOsFWegofjowmF9C2JMktDhIPYKjFCxCSHQk45d7I/KVA+koQxb5LSzrhhrYFx5DUwqM3THL7MZlPbW4cwfhFH8N0vxpIOPrKhNkaE2I5YCmACkZBRVb6hxnMviwG51P4zECVgefrtXycCrTs2ES9lbZ1jjBWCnt823/llxd2qXOdFobt3VTVU6ZTmQy9n3+MRT4+F4aCx4M3nfX+jQO0NixsNmgPBkN6N3v/RWnXEVd4LH9lvNbOxFgAAALgB/4WwAY0AS7AIUFixAQGOWbFGBitYIbAQWUuwFFJYIbCAWR2wBitcWFmwFCsAAAAAAKMAhQAhAn8AAAAAACoAKgAqACoAKgAqAH4BOAHuAuQDJgP4BSAFwAY+B1AIMgiyCNgJYgnsCwQLKgtQC+IMPAzgDRYNsg42DmR42qVZDXAc5Xn+vt3bv/vd3bvdO51Ouv876U6nPd3ejy76tS1h2ZYNlizANnZsfp1AC7FxDC1jSEohQ9Pi0JImhDTUU89AQ2e+PRkSwJ5x27SZAXaGDIxC89NJp2HKZKYdp5NpCSOd+357kiwESWCqO30/7/dzu+/7vM/7fruIQUmEcIF5BrFIQIMWRsZoS3Cx/1mxeO4noy2WgSayWCrmqLgl8K7l0RamclNJKnlTSSex9O73v888s3IkyRxGsFP8yj+6uph/QgHUjYoIZQU+j3MNXI9jPYDDOmZ5A/pB2pcwbU/gPPzXw1jHB2M+X/t9nw/zPh80f/pTH574AaemVN4p8V10sDNAK5i2u1NtWMHsWikonNulMku0aj/0wTXQQ4heJ7ryXTbCRpCM4mgvehyRWYMwNkkklhSStIlkkKBNqgbpMknNJsM2JnMGGVgiXpsoldaA111cnBxISkVSrRCvbLlwkWy3iU6XT9jWPC5a3gFFtbqvbTaJrrwoS0zX8MhsJtwkLpVMNZElMYraSg9sb8KEoAIiUlVb+tAE9MtDWd2s1Kr5QZxOCVqID+ksCOq1ag76Ib0H48Y4fF2juCbnB13pfD1jVmBGL9ZCfkboVOkUzObxcCH7ViR963y/jF1sLHXk9ruvixdc7TewtCfk4l0M9rLBeCTOMJ/CgRmf6Zu6dz5SLeRuODFy24mtkVu7Rn4uKhcmcs0E3+K2Fmr4666Zg7PbhZ7jsf0r79QYvyjImhz1xlimqHMCx7AG9uC+o9OZ4UJECd6zb/pYs5v1gs4x1TkzCTo3kY1Iv0GQSfI2wTZRHW1HKiQokyioumpYNVBoPfry+I2/fBRpRbefCDLxXLJS+Nckfgk6i6LgCRYXJad005Kk5MVEKg7dJC1bMCHxWOKxNO9X1CaRmsTdbME47SSbaFIS4ilRcnsSycG1P/xRQjIZxcjC/WBMY6jZtNQ8tNgYtIJRRSUhsJbWGGcadbBHLT/I5BvhChiHF/xY4AWeEXiAepgXUjw1CDWJ21vKBGQBx9O5CPanih7Pj7tHdoRYMTCn8YHAFm8SY20eFkZ4eas82xc7tr3scntELcM+fu6FL/r8Ig/WklgOR6KcLvrn9rZ/2HzS7+a8Pd2Mh/GArhkH30dA10fR59CzqHUHQkXy+za53iApmzSMRcQEt2TCJiDbYscqFTIsEx8F76dMotlkWwWT4wY5tATmaEUPUbBHg1KxdShKm4cYwH1UtgbARrN2a3aACmcnpKJ1AnAfPQQK8kgA6wHlvE9uDF9PUT+rWlOAdWRpKUVdPFrZfgiklq8BKpxokmGFjIIigykD181KGKDcgLpuCmEN1CbwPZgqUe8MdD616iAG+sjn0kK+YYb1RljXQgKfBp1rIV2DuVT99JNOgSPlc2O4ms9h6kPJFGwY0s1kpd6tCowQUAdv5BLjRtqfYDHOJtJuAYtsNJgeqoyW45GoR5M8LpFlGY/a1RQZ40TfNW4XE9X6XSIGyPvcvlCxMDo6f2jb1Fa/JPmYK25x+Xui2y2yo6Kb+XdmCDPgGFjIcpxf2Jb8wjevKabUbtmthuRUPHeg1JgvJ/OeIGbKPCPioJv1A9WKAVYX3W/93kQpnE4l1GA0um9q8IYLd/qCy7/I0M1p4fjV+JX/YX7EPOHwbSiA4YYNLDhlrlal/EpL0GccN5wSFEW5mPmRPCvrmnrunKrp0JTPnZM/LLnvNw+tS1b59DLgLYBq6DZ0GpFtBrnJJqJBAjb19Qi49e0GCS2Rkr24txQSi2TOJiXZuhlA1LStOwA5c3sBDXKTlBSy0CQ3qy9kI5X6tpsofJrK+Vi61khAG1niTQChenPnHIVQfwA6ciiRptMiCokBjnAFODLEg6Gp1etmI0d10HCgRT/0/jvYSVG0dIRhwXQQtAYaZ4IDmvoYbvQy4Q0ABG7Osf9KjbBcpWVb9XTvmn2iZzI7wfOAKEOM9Q5NT+az2ex9hUZ39OH/cIU9PUqpUCxds6W0Jym6MGaakiKyoa5IOtWXKfZ3R0sKPtaxKi0yAGnz9pntHl7TB8b7IYCwzL64mUwOFbL5lC/iUc9o8ZHRnh6lp9vt9elu3iUJY91KP44wwYLuiushrzfgSyf7yn0BGvN4JF25B2x0EMVQA21HC2CnkziEWmOUG6ZsEq6QKZnoNuVi1iCiTeIGDX4Nmxw0yM026TPAeOROg+wwyXGb7LLJTKW1607q/bvmpSImnzeIvkTmKkAhLU2ncq0LqEKTrVmw8oJNopXW7ILDFjul4qJnYRZgkDMJskm50vIgOuKhQXVBtuqeIumhv2CdAmhoOliZ9xf2OlyiLPqqtWtp06NOSiIrK5m+kjnfAQcLIOKaZExZRLzXRyfpquWPdsIsoGtKJV1NqwaBAOKAdTMw0PlMrmwW6Mw+hRQBP+EQJY1GJ+YK+XqjBuytpWumBrE1qKUBTONMrQroyQOmdCfomjVO2wC5ZEXHdMUYBkYCgtI2jyqb+ktjgyPZRCyuREYCFZ+UkUZfqfUkmdfZPqMvHg2We6/pH84N5vF2dp9bXNlHUcI8L7qX3704hl2Rvt0j7MJG+ca2UapmK1ElkOXiW7yY6VkY2iL04237A3K6EUsGepPJMaMvZnTF/cnFu+giWuBfNhqP8ZJW3P7zf7kqjKw3AU/oyk/Yy8yvIHsMQBaVd1B1N2ppFE8xwBCNJwI4uUGqNvHQHnDBmEGxlqa9PHDCjEG4JcubgRCEbUtMVCrWDlxEVkwDg2MXh6iPV0vQkbw+kXamxqCTzGQpF5SH6iE+lavWK2s13qRW9Bvkm9X/9sSBibUve8MHNfwRwo3tk86yf3PK9t+uK4gxNks2as+J0ZCIPgucGUcTaA61OKq3jElVNwouBFozabo5ALF4EtxxiWZKXXarS6Ru0qWAm2DZ6gPHgny1abeafVTeHIIwvAU0CCwIt1jEqVxNqdZHVikR+k7so33ud4xjMlF6uzTx3KlMQNMCmZGFhH66NIHf+0jpFMgmSvjLp57TAjMBbWFE1RPOxA8J6W271++dIseA+78WfRqw8yBk4t9Cj6DWk1QXXtsauAmAwRlWZp9JFWPNPlChqrGm7oX+qG3d9WXo1wzr1oeh/zTg6RmDfG2JSLYVGYYRSbYQsIdchna/bc0co7VsJUA2eQTa+23rvi/RWrauA9k9D0H7K7b1147+spArbNAHRIEP9rlN47j228c/6fzNv9dQOpCl9nL4JeEWz1NAfaDYKG3/7KPlH2fO1WKmll3xZmu1LPOrXPXAOoR/tt564yrCv/sRwt8xfHWfCytPOz9zK2ientGkK3/Pfou9ASXQFnQH+itEthvUOTiD3GKT6yiDGDbJGeQA2P2YQRaWSNEmRdlKgk8chvhEZ4RtctgBAdlqW58BG+8qKuoLuck91+0/QNkknIRsdfcRiA6HFUs7CjVSF2PXbL/FCSbXxSA68Gjrrt10rsHB3D10zi2KNUTX5NRWceFw58hWhYQhJfS6KLGkBtk8JBaQapkVSL0wHUunIDXriBqDrhrYsNLLhuuYZmydVK2Rv5q01Tt5mhDuZGysKZ8MDKqswntcCV0M+AWZVQP3yno4MC+3711rySeh3jQLv1eeNx4pnzAqlfL01qGTxqbu+XDgpKyysuAPiHrC5eEVVg1HYMfAnIzPrjYG5A/Naf/J1OCcUb53aOs0uJdxcmjrpj64uIvmha5h8HMB+VEvGkSfQa2ww3NOjgHRQTbAapgYBskvkZBNQrLFgbXcNB60MEc5DUsdrusGecK2ymBFDKYg3ibpVogP7MSGISaIUifcCwrxg0GuMn+y1gjjLGT9mtLJ+sGDcuHN3nTMoXnmweV3zx/ACZxYfsDJ4B+Gcq6WXX6A0gH7cK7K7Ojw+oXlu+jEsxtDgbqyz0Hw87lqFXXOvDjBRvB7wHMaosgFQvfC7cqGpayT9MY4xEYS+so+PZHQmef1BP6Hu2iTFohzOPPyBzizfjXaZiGQmmTABjYEYiTeCpk24HSGyXWGtZdG1Bp9HoERxaraOSV07h3gtfkiap+w/8/cWYGnOuCFs6yxlhSzrztx8mlHObdubl+dg5/wCmc5t4inRDd3tv3Ob6WQNzaG0I+hE9cGnfg+WieSSHUSpHig3tc5K+n/X5287WiD62iGjXxSpTCD7QtUHYKjm/bMx1eK6JzFnmWPIAkwl0Sj6AZ0C8TW+9GrqFWmmsnbLUg+iotsvgz5d57SZNQgcZvcZJCjNtlikHnQ0R8YZM8SmbbJtGzJ4HkeyOFk67PQus0mt8lWFVop2/pD8MbpPaBGhgNClJUXJT08ObODJuPWZz3glgOlsXEnibtNUb9j5BvDhz99/CT105RC7gffjZYV9UUxFEwNlKp03k2QmS82hmd20M6Wo7BobHx6zx3Hjp+gi+YVch9YqyHwKee5oR7WqJ9TrVf0XCehcdIZbu0knMs3wjpl4RqwcEMHMsVCPkfJmBK0kFsjXIdnXRt2wBt2Dq//3v+eAZP4fGd80Tm37Ibv6fVIyfygPF+a3lZ+xe1/9OuBQcrHT7kDykWjfe5qX/VfNNam4ePra9tvd3Z7Z337J89wnNPIrEfj086UAw7PXnDr7qcoNQPxf+NRKXBxCC9sEHi9F1cJ+YJ7zFmGE+v7HFrbepWj0Hlm0uEodZWjNhLU1fjk4JqZ9CxLCWnZowXwewENvyVDG0QypIPOXjN4ivkS7BVEzi4inOMgs+9shjYTz9TqygDsgu+7uq1nuRM7AMejzvkiD759D2oJFL9+sxMoIBjQIOI2aTSJddJkc4n6+4BsYYCnD3xetiRoKXZLUmgskSKd/NgaMAGzI6OAWaxYrgzUPvooClmZBH3UV6ackKnmUnxIr9RX68YGHx/BvdjJyoArWADNajIN570OUCiamDe0Xk3rPeeUhxL68vcom1/2DKfPpIc9l/XEd8SuM1rgTEA7A1m9uuyJeZZVZ/Lq9+x5uoAWfX2JBL5eX6a6WtbDMtW53Hmm6jzn60dVRJUh2/Tk0AcWLBgkSM8MVpEynSZDJoORJ9bTOedamRy9QyRTczgXbOrhXmzSe4VzLX161rmdaqMep87BHmm3jv7duMe7mxclV/+pbaeee+7U5+Z3q26xC64KLmnHg99uMdH20+25nT7Pbp7haiPP/ddzu/fIYR2umd7gzKkOZ69es4Z6UBaVUA19BbVK1LJDjkH9cM4xSMKk5/9MhT49qsH91B3jdjI8mglAZheWrTS0gLnispWHlmFbDbBtuBtyPC/fPzBEGYWklUWW8Tu5QVx9Qdb6SuWak951+WGepOaKRoUO9iiL+cKg6ZwrsR9TvdQbdaoWMPM4hnotp3Ct1qqcS/CyngA1JnJyPcGc1o7/2XGN8/v9MZd/9vCs3xWDdvudwmihMIp3OtXLb7aX3nwTF3D3SvuplRV8O2an5uen/N0uWFcaHi75/ZyrG3N07uq3/ee48CZdxnR3lqx03mFsg9hngn+4IbvKoZaX6tDjZMgSaCxgUOJGFudV1BbDC06eik2czieFNGaTuJbU8GtH8PbTO9vf2HkKn/hTHF15gG654n3pJebz7b9Z+cXFi2j9eTI9r4loFl2PiGS0cgPTJhy63HYrMbi1AgenAg0ku0yalA9D4IUL2G1Ye+gFuAtwAanMDH3XYShWfAvUw+qiNxoZdd6IQJpOr0yg7zDqZg43xtlGN3hXONhLtR6mJgiH6GsNwXmpIQBfV8ZdlND9IIQ0em0kzeOvHYndE+M0rtwGI1Z6kuIj3yz08ifUuYjHCHgkzx6RwTj9eKbwVBezE/sFL8/NrcgNORHJu3Dyi0kuxJSZ7AqDH28zJZcodGn4IP5Lb/u/C6/VI/fHuwRJZl0+DydxkoD9vQEXw3Eip13Eua/6varEwSZuzuMS1/T2F857JgXp6NtUb4R1ct6ACZxEUIUwBsEmUW0SBAILG1ak8+Lj0tj7p+mLD6IO+ol+ibMY5td+4r708sRr779NBziCYcQPI0E6ErrEEb+8iPw4WCSMDIB309cjtKTyAJWzaNHtD+mdVx1ehBlWcvsDarAj2vDCg9J+IxlM0qek6Tg2a41gMo+TLJdlHhDbchTf6L37buFm7+vMq7H2V6UriI3MtF9pX2TkW9pvPtTbe+3TTTyMh27H4vIPDx5c1QNglXkVUBuiUQbBXQNA4CSvO4FBAyhm4fiUF/KN/Dgew9gMa+zllZeCme7s7B89lgiEGXFv8+L+/W/5uuKzwh8PsJrfxD9uzv4f36VfGgAAAHjafY+xbsIwEIY/Q6BUahFjVXXw0KlSUBLBgrpVjRgyUZWtA4IosgSxlIRn6tYn6TN07Wv0SI6lA7bO/mz/998ZGPOFoRu3PCgbRjwr97jiXbnPI5/KgWh+lAfcGKM8ZGSsKE1wLaf7NuvEhglPyj2p+6rcZ8mHciCab+UBd/wqD5mYMSmekgbHtqUaSybzBVJfNm7ry9pmmRzfRHNgJ2sjykou3GHnGi+0IqfgyJ7N6WGVF8f9RuBsnrYJhagsCVMi2RcS/y2720TeQ2YSJ4qZd62kvipym0wju7Dn0oJJFM7CJIrnFztcS+1KPufajqy4dl2wzqva+dLG4nvJ4Q/MJ0XqeNptzUkOAVEYReF3XqH0fU9iC/WXrgwpalQxkFiEiZkN2DjCHbrJzTc8zrvvXk8Xu39bfI7zeAIXUKBIiZAyFarUqNOgSYs2Hbr06DNgyIgxE6bMmBfO1zz36SV83G9ZFEXSZCyXciXXciO3MpE7uZcHmcqjPMnsp6lv6pv6pr6pb+qb+qa+JW+gxjwxAAAAeNpjYGBgZACCC+bVcSD6YtTkGihdCwBBJwZXAA==) format(\"woff\");\n  font-weight: normal;\n  font-style: normal;\n}\n.simditor-icon {\n  display: inline-block;\n  font: normal normal normal 14px/1 'Simditor';\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  transform: translate(0, 0);\n}\n\n.simditor-icon-code:before {\n  content: '\\f000';\n}\n\n.simditor-icon-bold:before {\n  content: '\\f001';\n}\n\n.simditor-icon-italic:before {\n  content: '\\f002';\n}\n\n.simditor-icon-underline:before {\n  content: '\\f003';\n}\n\n.simditor-icon-times:before {\n  content: '\\f004';\n}\n\n.simditor-icon-strikethrough:before {\n  content: '\\f005';\n}\n\n.simditor-icon-list-ol:before {\n  content: '\\f006';\n}\n\n.simditor-icon-list-ul:before {\n  content: '\\f007';\n}\n\n.simditor-icon-quote-left:before {\n  content: '\\f008';\n}\n\n.simditor-icon-table:before {\n  content: '\\f009';\n}\n\n.simditor-icon-link:before {\n  content: '\\f00a';\n}\n\n.simditor-icon-picture-o:before {\n  content: '\\f00b';\n}\n\n.simditor-icon-minus:before {\n  content: '\\f00c';\n}\n\n.simditor-icon-indent:before {\n  content: '\\f00d';\n}\n\n.simditor-icon-outdent:before {\n  content: '\\f00e';\n}\n\n.simditor-icon-chain-broken:before {\n  content: '\\f00f';\n}\n\n.simditor-icon-caret-down:before {\n  content: '\\f010';\n}\n\n.simditor-icon-caret-right:before {\n  content: '\\f011';\n}\n\n.simditor-icon-upload:before {\n  content: '\\f012';\n}\n\n.simditor-icon-undo:before {\n  content: '\\f013';\n}\n\n.simditor-icon-smile-o:before {\n  content: '\\f014';\n}\n\n.simditor-icon-tint:before {\n  content: '\\f015';\n}\n\n.simditor-icon-font:before {\n  content: '\\f016';\n}\n\n.simditor-icon-html5:before {\n  content: '\\f017';\n}\n\n.simditor-icon-mark:before {\n  content: '\\f018';\n}\n\n.simditor {\n  position: relative;\n  border: 1px solid #c9d8db;\n}\n.simditor textarea {\n  display: none !important;\n  width: 100%;\n  box-sizing: border-box;\n  font-family: monaco;\n  font-size: 16px;\n  line-height: 1.6;\n  border: none;\n  padding: 22px 15px 40px;\n  min-height: 300px;\n  outline: none;\n  background: transparent;\n  resize: none;\n}\n.simditor.simditor-source-mode textarea {\n  display: block !important;\n}\n.simditor.simditor-source-mode .simditor-body, .simditor.simditor-source-mode .simditor-placeholder {\n  display: none !important;\n}\n.simditor .simditor-wrapper {\n  position: relative;\n  background: #ffffff;\n  overflow: hidden;\n}\n.simditor .simditor-wrapper .simditor-placeholder {\n  display: none;\n  position: absolute;\n  left: 0;\n  z-index: 0;\n  padding: 22px 15px;\n  font-size: 16px;\n  font-family: arial, sans-serif;\n  line-height: 1.5;\n  color: #999999;\n  background: transparent;\n}\n.simditor .simditor-wrapper.toolbar-floating .simditor-toolbar {\n  position: fixed;\n  top: 0;\n  z-index: 10;\n  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);\n}\n.simditor .simditor-wrapper .simditor-image-loading {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n}\n.simditor .simditor-wrapper .simditor-image-loading .progress {\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.4);\n  position: absolute;\n  bottom: 0;\n  left: 0;\n}\n.simditor .simditor-body {\n  padding: 22px 15px 40px;\n  min-height: 300px;\n  outline: none;\n  cursor: text;\n  position: relative;\n  z-index: 1;\n  background: transparent;\n}\n.simditor .simditor-body a.selected {\n  background: #b3d4fd;\n}\n.simditor .simditor-body a.simditor-mention {\n  cursor: pointer;\n}\n.simditor .simditor-body .simditor-table {\n  position: relative;\n}\n.simditor .simditor-body .simditor-table.resizing {\n  cursor: col-resize;\n}\n.simditor .simditor-body .simditor-table .simditor-resize-handle {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 10px;\n  height: 100%;\n  cursor: col-resize;\n}\n.simditor .simditor-body pre {\n  /*min-height: 28px;*/\n  box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  word-wrap: break-word !important;\n  white-space: pre-wrap !important;\n}\n.simditor .simditor-body img {\n  cursor: pointer;\n}\n.simditor .simditor-body img.selected {\n  box-shadow: 0 0 0 4px #cccccc;\n}\n.simditor .simditor-paste-area,\n.simditor .simditor-clean-paste-area {\n  background: transparent;\n  border: none;\n  outline: none;\n  resize: none;\n  padding: 0;\n  margin: 0;\n}\n.simditor .simditor-toolbar {\n  border-bottom: 1px solid #eeeeee;\n  background: #ffffff;\n  width: 100%;\n}\n.simditor .simditor-toolbar > ul {\n  margin: 0;\n  padding: 0 0 0 6px;\n  list-style: none;\n}\n.simditor .simditor-toolbar > ul:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.simditor .simditor-toolbar > ul > li {\n  position: relative;\n  float: left;\n}\n.simditor .simditor-toolbar > ul > li > span.separator {\n  display: block;\n  float: left;\n  background: #cfcfcf;\n  width: 1px;\n  height: 18px;\n  margin: 11px 15px;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item {\n  display: block;\n  float: left;\n  width: 46px;\n  height: 40px;\n  outline: none;\n  color: #333333;\n  font-size: 15px;\n  line-height: 40px;\n  text-align: center;\n  text-decoration: none;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item span {\n  opacity: 0.6;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item span.simditor-icon {\n  display: inline;\n  line-height: normal;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item:hover span {\n  opacity: 1;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.active {\n  background: #eeeeee;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.active span {\n  opacity: 1;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.disabled {\n  cursor: default;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.disabled span {\n  opacity: 0.3;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.toolbar-item-title span:before {\n  content: \"H\";\n  font-size: 19px;\n  font-weight: bold;\n  font-family: 'Times New Roman';\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.toolbar-item-title.active-h1 span:before {\n  content: 'H1';\n  font-size: 18px;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.toolbar-item-title.active-h2 span:before {\n  content: 'H2';\n  font-size: 18px;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.toolbar-item-title.active-h3 span:before {\n  content: 'H3';\n  font-size: 18px;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.toolbar-item-image {\n  position: relative;\n  overflow: hidden;\n}\n.simditor .simditor-toolbar > ul > li > .toolbar-item.toolbar-item-image > input[type=file] {\n  position: absolute;\n  right: 0px;\n  top: 0px;\n  opacity: 0;\n  font-size: 100px;\n  cursor: pointer;\n}\n.simditor .simditor-toolbar > ul > li.menu-on .toolbar-item {\n  position: relative;\n  z-index: 21;\n  background: #ffffff;\n  box-shadow: 0 -3px 3px rgba(0, 0, 0, 0.2);\n}\n.simditor .simditor-toolbar > ul > li.menu-on .toolbar-item span {\n  opacity: 1;\n}\n.simditor .simditor-toolbar > ul > li.menu-on .toolbar-menu {\n  display: block;\n}\n.simditor .simditor-toolbar .toolbar-menu {\n  display: none;\n  position: absolute;\n  top: 40px;\n  left: 0;\n  z-index: 20;\n  background: #ffffff;\n  text-align: left;\n  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);\n}\n.simditor .simditor-toolbar .toolbar-menu ul {\n  min-width: 160px;\n  list-style: none;\n  margin: 0;\n  padding: 10px 1px;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item {\n  display: block;\n  font-size: 16px;\n  line-height: 2em;\n  padding: 0 10px;\n  text-decoration: none;\n  color: #666666;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item:hover {\n  background: #f6f6f6;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item.menu-item-h1 {\n  font-size: 24px;\n  color: #333333;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item.menu-item-h2 {\n  font-size: 22px;\n  color: #333333;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item.menu-item-h3 {\n  font-size: 20px;\n  color: #333333;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item.menu-item-h4 {\n  font-size: 18px;\n  color: #333333;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .menu-item.menu-item-h5 {\n  font-size: 16px;\n  color: #333333;\n}\n.simditor .simditor-toolbar .toolbar-menu ul > li .separator {\n  display: block;\n  border-top: 1px solid #cccccc;\n  height: 0;\n  line-height: 0;\n  font-size: 0;\n  margin: 6px 0;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color {\n  width: 96px;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list {\n  height: 40px;\n  margin: 10px 6px 6px 10px;\n  padding: 0;\n  min-width: 0;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li {\n  float: left;\n  margin: 0 4px 4px 0;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color {\n  display: block;\n  width: 16px;\n  height: 16px;\n  background: #dfdfdf;\n  border-radius: 2px;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color:hover {\n  opacity: 0.8;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color.font-color-default {\n  background: #333333;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-1 {\n  background: #E33737;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-2 {\n  background: #e28b41;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-3 {\n  background: #c8a732;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-4 {\n  background: #209361;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-5 {\n  background: #418caf;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-6 {\n  background: #aa8773;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-color .color-list li .font-color-7 {\n  background: #999999;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-create-table {\n  background: #ffffff;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-create-table table {\n  border: none;\n  border-collapse: collapse;\n  border-spacing: 0;\n  table-layout: fixed;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-create-table table td {\n  height: 16px;\n  padding: 0;\n  border: 2px solid #ffffff;\n  background: #f3f3f3;\n  cursor: pointer;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-create-table table td:before {\n  width: 16px;\n  display: block;\n  content: \"\";\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-create-table table td.selected {\n  background: #cfcfcf;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-edit-table {\n  display: none;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-table .menu-edit-table ul {\n  min-width: 240px;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-image .menu-item-upload-image {\n  position: relative;\n  overflow: hidden;\n}\n.simditor .simditor-toolbar .toolbar-menu.toolbar-menu-image .menu-item-upload-image input[type=file] {\n  position: absolute;\n  right: 0px;\n  top: 0px;\n  opacity: 0;\n  font-size: 100px;\n  cursor: pointer;\n}\n.simditor .simditor-popover {\n  display: none;\n  padding: 5px 8px 0;\n  background: #ffffff;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);\n  border-radius: 2px;\n  position: absolute;\n  z-index: 2;\n}\n.simditor .simditor-popover .settings-field {\n  margin: 0 0 5px 0;\n  font-size: 12px;\n  height: 25px;\n  line-height: 25px;\n}\n.simditor .simditor-popover .settings-field label {\n  margin: 0 8px 0 0;\n  float: left;\n}\n.simditor .simditor-popover .settings-field input[type=text] {\n  float: left;\n  width: 200px;\n  box-sizing: border-box;\n  font-size: 12px;\n}\n.simditor .simditor-popover .settings-field input[type=text].image-size {\n  width: 87px;\n}\n.simditor .simditor-popover .settings-field .times {\n  float: left;\n  width: 26px;\n  font-size: 12px;\n  text-align: center;\n}\n.simditor .simditor-popover.link-popover .btn-unlink, .simditor .simditor-popover.image-popover .btn-upload, .simditor .simditor-popover.image-popover .btn-restore {\n  float: left;\n  margin: 0 0 0 8px;\n  color: #333333;\n  font-size: 14px;\n  outline: 0;\n}\n.simditor .simditor-popover.link-popover .btn-unlink span, .simditor .simditor-popover.image-popover .btn-upload span, .simditor .simditor-popover.image-popover .btn-restore span {\n  opacity: 0.6;\n}\n.simditor .simditor-popover.link-popover .btn-unlink:hover span, .simditor .simditor-popover.image-popover .btn-upload:hover span, .simditor .simditor-popover.image-popover .btn-restore:hover span {\n  opacity: 1;\n}\n.simditor .simditor-popover.image-popover .btn-upload {\n  position: relative;\n  display: inline-block;\n  overflow: hidden;\n}\n.simditor .simditor-popover.image-popover .btn-upload input[type=file] {\n  position: absolute;\n  right: 0px;\n  top: 0px;\n  opacity: 0;\n  height: 100%;\n  width: 28px;\n}\n.simditor.simditor-mobile .simditor-toolbar > ul > li > .toolbar-item {\n  width: 46px;\n}\n.simditor.simditor-mobile .simditor-wrapper.toolbar-floating .simditor-toolbar {\n  position: absolute;\n  top: 0;\n  z-index: 10;\n  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);\n}\n\n.simditor .simditor-body, .editor-style {\n  font-size: 16px;\n  font-family: arial, sans-serif;\n  line-height: 1.6;\n  color: #333;\n  outline: none;\n  word-wrap: break-word;\n}\n.simditor .simditor-body > :first-child, .editor-style > :first-child {\n  margin-top: 0 !important;\n}\n.simditor .simditor-body a, .editor-style a {\n  color: #4298BA;\n  text-decoration: none;\n  word-break: break-all;\n}\n.simditor .simditor-body a:visited, .editor-style a:visited {\n  color: #4298BA;\n}\n.simditor .simditor-body a:hover, .editor-style a:hover {\n  color: #0F769F;\n}\n.simditor .simditor-body a:active, .editor-style a:active {\n  color: #9E792E;\n}\n.simditor .simditor-body a:hover, .simditor .simditor-body a:active, .editor-style a:hover, .editor-style a:active {\n  outline: 0;\n}\n.simditor .simditor-body h1, .simditor .simditor-body h2, .simditor .simditor-body h3, .simditor .simditor-body h4, .simditor .simditor-body h5, .simditor .simditor-body h6, .editor-style h1, .editor-style h2, .editor-style h3, .editor-style h4, .editor-style h5, .editor-style h6 {\n  font-weight: normal;\n  margin: 40px 0 20px;\n  color: #000000;\n}\n.simditor .simditor-body h1, .editor-style h1 {\n  font-size: 24px;\n}\n.simditor .simditor-body h2, .editor-style h2 {\n  font-size: 22px;\n}\n.simditor .simditor-body h3, .editor-style h3 {\n  font-size: 20px;\n}\n.simditor .simditor-body h4, .editor-style h4 {\n  font-size: 18px;\n}\n.simditor .simditor-body h5, .editor-style h5 {\n  font-size: 16px;\n}\n.simditor .simditor-body h6, .editor-style h6 {\n  font-size: 16px;\n}\n.simditor .simditor-body p, .simditor .simditor-body div, .editor-style p, .editor-style div {\n  word-wrap: break-word;\n  margin: 0 0 15px 0;\n  color: #333;\n  word-wrap: break-word;\n}\n.simditor .simditor-body b, .simditor .simditor-body strong, .editor-style b, .editor-style strong {\n  font-weight: bold;\n}\n.simditor .simditor-body i, .simditor .simditor-body em, .editor-style i, .editor-style em {\n  font-style: italic;\n}\n.simditor .simditor-body u, .editor-style u {\n  text-decoration: underline;\n}\n.simditor .simditor-body strike, .simditor .simditor-body del, .editor-style strike, .editor-style del {\n  text-decoration: line-through;\n}\n.simditor .simditor-body ul, .simditor .simditor-body ol, .editor-style ul, .editor-style ol {\n  list-style: disc outside none;\n  margin: 15px 0;\n  padding: 0 0 0 40px;\n  line-height: 1.6;\n}\n.simditor .simditor-body ul ul, .simditor .simditor-body ul ol, .simditor .simditor-body ol ul, .simditor .simditor-body ol ol, .editor-style ul ul, .editor-style ul ol, .editor-style ol ul, .editor-style ol ol {\n  padding-left: 30px;\n}\n.simditor .simditor-body ul ul, .simditor .simditor-body ol ul, .editor-style ul ul, .editor-style ol ul {\n  list-style: circle outside none;\n}\n.simditor .simditor-body ul ul ul, .simditor .simditor-body ol ul ul, .editor-style ul ul ul, .editor-style ol ul ul {\n  list-style: square outside none;\n}\n.simditor .simditor-body ol, .editor-style ol {\n  list-style: decimal;\n}\n.simditor .simditor-body blockquote, .editor-style blockquote {\n  border-left: 6px solid #ddd;\n  padding: 5px 0 5px 10px;\n  margin: 15px 0 15px 15px;\n}\n.simditor .simditor-body blockquote > :first-child, .editor-style blockquote > :first-child {\n  margin-top: 0;\n}\n.simditor .simditor-body pre, .editor-style pre {\n  padding: 10px 5px 10px 10px;\n  margin: 15px 0;\n  display: block;\n  line-height: 18px;\n  background: #F0F0F0;\n  border-radius: 3px;\n  font-size: 13px;\n  font-family: 'monaco', 'Consolas', \"Liberation Mono\", Courier, monospace;\n  white-space: pre;\n  word-wrap: normal;\n  overflow-x: auto;\n}\n.simditor .simditor-body code, .editor-style code {\n  display: inline-block;\n  padding: 0 4px;\n  margin: 0 5px;\n  background: #eeeeee;\n  border-radius: 3px;\n  font-size: 13px;\n  font-family: 'monaco', 'Consolas', \"Liberation Mono\", Courier, monospace;\n}\n.simditor .simditor-body hr, .editor-style hr {\n  display: block;\n  height: 0px;\n  border: 0;\n  border-top: 1px solid #ccc;\n  margin: 15px 0;\n  padding: 0;\n}\n.simditor .simditor-body table, .editor-style table {\n  width: 100%;\n  table-layout: fixed;\n  border-collapse: collapse;\n  border-spacing: 0;\n  margin: 15px 0;\n}\n.simditor .simditor-body table thead, .editor-style table thead {\n  background-color: #f9f9f9;\n}\n.simditor .simditor-body table td, .editor-style table td {\n  min-width: 40px;\n  height: 30px;\n  border: 1px solid #ccc;\n  vertical-align: top;\n  padding: 2px 4px;\n  box-sizing: border-box;\n}\n.simditor .simditor-body table td.active, .editor-style table td.active {\n  background-color: #ffffee;\n}\n.simditor .simditor-body img, .editor-style img {\n  margin: 0 5px;\n  vertical-align: middle;\n}\n.simditor .simditor-body *[data-indent=\"0\"], .editor-style *[data-indent=\"0\"] {\n  margin-left: 0px;\n}\n.simditor .simditor-body *[data-indent=\"1\"], .editor-style *[data-indent=\"1\"] {\n  margin-left: 40px;\n}\n.simditor .simditor-body *[data-indent=\"2\"], .editor-style *[data-indent=\"2\"] {\n  margin-left: 80px;\n}\n.simditor .simditor-body *[data-indent=\"3\"], .editor-style *[data-indent=\"3\"] {\n  margin-left: 120px;\n}\n.simditor .simditor-body *[data-indent=\"4\"], .editor-style *[data-indent=\"4\"] {\n  margin-left: 160px;\n}\n.simditor .simditor-body *[data-indent=\"5\"], .editor-style *[data-indent=\"5\"] {\n  margin-left: 200px;\n}\n.simditor .simditor-body *[data-indent=\"6\"], .editor-style *[data-indent=\"6\"] {\n  margin-left: 240px;\n}\n.simditor .simditor-body *[data-indent=\"7\"], .editor-style *[data-indent=\"7\"] {\n  margin-left: 280px;\n}\n.simditor .simditor-body *[data-indent=\"8\"], .editor-style *[data-indent=\"8\"] {\n  margin-left: 320px;\n}\n.simditor .simditor-body *[data-indent=\"9\"], .editor-style *[data-indent=\"9\"] {\n  margin-left: 360px;\n}\n.simditor .simditor-body *[data-indent=\"10\"], .editor-style *[data-indent=\"10\"] {\n  margin-left: 400px;\n}\n", ""]);

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module.
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($) {
	      return (root.returnExportsGlobal = factory($));
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like enviroments that support module.exports,
	    // like Node.
	    module.exports = factory(require("jquery"));
	  } else {
	    root['SimpleModule'] = factory(jQuery);
	  }
	}(this, function ($) {

	var Module,
	  __slice = [].slice;

	Module = (function() {
	  Module.extend = function(obj) {
	    var key, val, _ref;
	    if (!((obj != null) && typeof obj === 'object')) {
	      return;
	    }
	    for (key in obj) {
	      val = obj[key];
	      if (key !== 'included' && key !== 'extended') {
	        this[key] = val;
	      }
	    }
	    return (_ref = obj.extended) != null ? _ref.call(this) : void 0;
	  };

	  Module.include = function(obj) {
	    var key, val, _ref;
	    if (!((obj != null) && typeof obj === 'object')) {
	      return;
	    }
	    for (key in obj) {
	      val = obj[key];
	      if (key !== 'included' && key !== 'extended') {
	        this.prototype[key] = val;
	      }
	    }
	    return (_ref = obj.included) != null ? _ref.call(this) : void 0;
	  };

	  Module.connect = function(cls) {
	    if (typeof cls !== 'function') {
	      return;
	    }
	    if (!cls.pluginName) {
	      throw new Error('Module.connect: cannot connect plugin without pluginName');
	      return;
	    }
	    cls.prototype._connected = true;
	    if (!this._connectedClasses) {
	      this._connectedClasses = [];
	    }
	    this._connectedClasses.push(cls);
	    if (cls.pluginName) {
	      return this[cls.pluginName] = cls;
	    }
	  };

	  Module.prototype.opts = {};

	  function Module(opts) {
	    var cls, instance, instances, name, _base, _i, _len;
	    this.opts = $.extend({}, this.opts, opts);
	    (_base = this.constructor)._connectedClasses || (_base._connectedClasses = []);
	    instances = (function() {
	      var _i, _len, _ref, _results;
	      _ref = this.constructor._connectedClasses;
	      _results = [];
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        cls = _ref[_i];
	        name = cls.pluginName.charAt(0).toLowerCase() + cls.pluginName.slice(1);
	        if (cls.prototype._connected) {
	          cls.prototype._module = this;
	        }
	        _results.push(this[name] = new cls());
	      }
	      return _results;
	    }).call(this);
	    if (this._connected) {
	      this.opts = $.extend({}, this.opts, this._module.opts);
	    } else {
	      this._init();
	      for (_i = 0, _len = instances.length; _i < _len; _i++) {
	        instance = instances[_i];
	        if (typeof instance._init === "function") {
	          instance._init();
	        }
	      }
	    }
	    this.trigger('initialized');
	  }

	  Module.prototype._init = function() {};

	  Module.prototype.on = function() {
	    var args, _ref;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    (_ref = $(this)).on.apply(_ref, args);
	    return this;
	  };

	  Module.prototype.one = function() {
	    var args, _ref;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    (_ref = $(this)).one.apply(_ref, args);
	    return this;
	  };

	  Module.prototype.off = function() {
	    var args, _ref;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    (_ref = $(this)).off.apply(_ref, args);
	    return this;
	  };

	  Module.prototype.trigger = function() {
	    var args, _ref;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    (_ref = $(this)).trigger.apply(_ref, args);
	    return this;
	  };

	  Module.prototype.triggerHandler = function() {
	    var args, _ref;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return (_ref = $(this)).triggerHandler.apply(_ref, args);
	  };

	  Module.prototype._t = function() {
	    var args, _ref;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return (_ref = this.constructor)._t.apply(_ref, args);
	  };

	  Module._t = function() {
	    var args, key, result, _ref;
	    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    result = ((_ref = this.i18n[this.locale]) != null ? _ref[key] : void 0) || '';
	    if (!(args.length > 0)) {
	      return result;
	    }
	    result = result.replace(/([^%]|^)%(?:(\d+)\$)?s/g, function(p0, p, position) {
	      if (position) {
	        return p + args[parseInt(position) - 1];
	      } else {
	        return p + args.shift();
	      }
	    });
	    return result.replace(/%%s/g, '%s');
	  };

	  Module.i18n = {
	    'zh-CN': {}
	  };

	  Module.locale = 'zh-CN';

	  return Module;

	})();


	return Module;


	}));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }
/******/ ]);