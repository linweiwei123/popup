require('./popup.css');

var is = function (obj, type) { return Object.prototype.toString.call(obj).toLowerCase() === ("[object " + type + "]"); };

var addClass = function (el, cls) {
    var arr = el.className
        .split(/\s+/)
        .filter(function (c) { return !!c && c === cls; });

    if (!arr.length) {
        el.className += " " + cls;
    }
};

var removeClass = function (el, cls) {
    el.className = el.className
        .split(/\s+/)
        .filter(function (c) { return !!c && c !== cls; })
        .join(' ');
};

var Popup = function Popup(el, options){
    var _this = this;
    var defaultOpts = {
        container: 'body', // 页面容器
        header: 'center', // header 位置样式left, center
        animate: false,
        popupSelector: 'meet-popup-container',
        popupCloseSelector: 'p-right',
        popupMaskSelector: 'meet-popup-mask',
        popupCloseClass: 'meet-popup-close',
        popupOpenClass: 'meet-popup-open',
        popupSlideUp: 'meet-popup-bounce-up',
        popupSlideDown: 'meet-popup-slide-down'
    };

    var opts = Object.assign(defaultOpts, options || {});

    opts.popupSlideUp = opts.animate? opts.popupSlideUp: '';
    opts.popupSlideDown = opts.animate? opts.popupSlideDown: '';

    this.opts = {};

    Object.keys(opts)
        .forEach(function(key){
            _this.opts[key] = opts[key];
        });

    this.wrapper = el;
    this.popup = el.querySelector('.' + this.opts.popupSelector);
    this.mask = el.querySelector('.' + this.opts.popupMaskSelector);

    // header 样式
    var headerEl = el.querySelector('.popup-header');
    headerEl.classList.add(this.opts.header);

    this.wrapper.querySelector('.' + this.opts.popupCloseSelector).addEventListener('click', function(){
        _this.close();
    });

    this.mask.addEventListener('click',function(){
        _this.close();
    });

    scrollPrevent(el);
};

Popup.prototype.open = function(){
    var _this = this;
    if(!is(this.opts.beforeOpen,'function')){
        return this._doOpen();
    }

    this.opts.beforeOpen(function(){
        _this._doOpen();
    });

};

Popup.prototype._doOpen = function(){
    var _this = this;
    // clear close styes
    removeClass(this.wrapper, this.opts.popupCloseClass);
    removeClass(this.popup, this.opts.popupSlideDown);
    removeClass(this.mask, 'fade-out');

    // 显示
    addClass(this.wrapper, this.opts.popupOpenClass);
    this.lockBody();
    // 上滑动画
    addClass(this.popup,this.opts.popupSlideUp);

    setTimeout(function(){
        if(is(_this.opts.afterOpen,'function')){
            return _this.opts.afterOpen();
        }
    },300);

};

Popup.prototype.close = function(){
    var _this = this;
    if(!is(this.opts.beforeClose,'function')){
        return this._doClose();
    }

    this.opts.beforeClose(function(){
        _this._doClose();
    })
};

Popup.prototype._doClose = function(){
    var _this = this;

    // clear open styles
    removeClass(this.popup, this.opts.popupSlideUp);

    // 下滑动画
    addClass(this.popup,this.opts.popupSlideDown);
    // 背景淡出
    addClass(this.mask,'fade-out');

    setTimeout(function(){
        // clear open styles
        removeClass(_this.wrapper, _this.opts.popupOpenClass);
        // close popup
        addClass(_this.wrapper, _this.opts.popupCloseClass);
        _this.unlockBody();
        if(is(_this.opts.afterClose,'function')){
            return _this.opts.afterClose();
        }
    },300)
};

// 阻止滚动穿透
Popup.prototype.lockBody = function(){
    document.querySelector('html').classList.add('noscroll');
};

// 回复body滚动
Popup.prototype.unlockBody = function(){
    document.querySelector('html').classList.remove('noscroll');
};

function scrollPrevent(popupSelector){
    var popupContainer = popupSelector;
    var popupContent = popupContainer.querySelector('.popup-content');

    var data = {
        maxscroll: 0
    };

    popupContainer.addEventListener('touchstart',function(event){
        var elTarget = event.target;

        if(elTarget.classList.contains('.popup-content') || getClosest(elTarget,'.popup-content') !== null){

            data.scrollY = popupContent.scrollTop;
            data.posY = (event.targetTouches[0] || event).pageY;
            data.maxscroll = popupContent.scrollHeight - popupContent.clientHeight;
            data.elScroll = elTarget;
        }
        else{
            data.elScroll = null;
        }
        return;
    });

    popupContainer.addEventListener('touchmove',function(event){
        if(!data.elScroll){
            event.preventDefault();
        }
        if(event.maxscroll<=0){
            event.preventDefault();
        }

        console.log(event.originalEvent,event);

        // 现在移动的垂直位置，用来判断是往上移动还是往下
        var events = event.targetTouches[0] || event;
        // 当前的滚动高度
        var scrollTop = popupContent.scrollTop;
        console.log(events.pageY);
        // 移动距离
        var distanceY = events.pageY - data.posY;

        // 上下边缘检测
        if (distanceY > 0 && scrollTop == 0) {
            // 往上滑，并且到头
            // 禁止滚动的默认行为
            event.preventDefault();
            return;
        }

        // 下边缘检测
        if (distanceY < 0 && (scrollTop + 1 >= data.maxscroll)) {
            // 往下滑，并且到头
            // 禁止滚动的默认行为
            event.preventDefault();
            return;
        }
    });

}

var getClosest = function (elem, selector) {

    // Element.matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    // Get the closest matching element
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
        if ( elem.matches( selector ) ) return elem;
    }
    return null;

};

module.exports = Popup;
