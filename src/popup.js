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
   let defaultOpts = {
     container: 'body', // 页面容器
     header: 'center', // header 位置样式left, center
     animate: false,
     popupSelector: 'meet-popup-container',
     popupCloseSelector: 'popup-close-icon',
     popupMaskSelector: 'meet-popup-mask',
     popupCloseClass: 'meet-popup-close',
     popupOpenClass: 'meet-popup-open',
     popupSlideUp: 'meet-popup-bounce-up',
     popupSlideDown: 'meet-popup-slide-down'
   };

   let opts = Object.assign(defaultOpts, options || {});

   opts.popupSlideUp = opts.animate? 'meet-popup-bounce-up': 'meet-popup-bounce-up';
   opts.popupSlideDown = opts.animate? 'meet-popup-bounce-down': 'meet-popup-slide-down';

   this.opts = {};

   Object.keys(opts)
     .forEach((key)=>{
       this.opts[key] = opts[key];
     });

   this.wrapper = el;
   this.docContainer = document.querySelector(this.opts.container);
   this.popup = document.querySelector('.' + this.opts.popupSelector);
   this.mask = document.querySelector('.' + this.opts.popupMaskSelector);

   // header 样式
   let headerEl = document.querySelector('.popup-header');
   headerEl.classList.add(this.opts.header);

   this.wrapper.querySelector('.' + this.opts.popupCloseSelector).addEventListener('click', () => {
     this.close();
   });

   headerEl.addEventListener('touchmove', function(e){
     e.preventDefault();
     e.stopPropagation();
     return false;
   },false);

  this.mask.addEventListener('touchmove', function(e){
    e.preventDefault();
    e.stopPropagation();
    return false;
  },false)
};

Popup.prototype.open = function(){
  if(!is(this.opts.beforeOpen,'function')){
    return this._doOpen();
  }

  this.opts.beforeOpen(()=>{
    this._doOpen();
  });

};

Popup.prototype._doOpen = function(){
  // clear close styes
  removeClass(this.wrapper, this.opts.popupCloseClass);
  removeClass(this.popup, this.opts.popupSlideDown);
  removeClass(this.mask, 'fade-out');

  // 显示
  addClass(this.wrapper, this.opts.popupOpenClass);
  this.lockBody();
  // 上滑动画
  addClass(this.popup,this.opts.popupSlideUp);

  setTimeout(()=>{
    if(is(this.opts.afterOpen,'function')){
      return this.opts.afterOpen();
    }
  },300);

};

Popup.prototype.close = function(){

  if(!is(this.opts.beforeClose,'function')){
    return this._doClose();
  }

  this.opts.beforeClose(()=>{
    this._doClose();
  })
};

Popup.prototype._doClose = function(){
  // clear open styles
  removeClass(this.popup, this.opts.popupSlideUp);

  // 下滑动画
  addClass(this.popup,this.opts.popupSlideDown);
  // 背景淡出
  addClass(this.mask,'fade-out');

  setTimeout(()=>{
    // clear open styles
    removeClass(this.wrapper, this.opts.popupOpenClass);
    // close popup
    addClass(this.wrapper, this.opts.popupCloseClass);
    this.unlockBody();
    if(is(this.opts.afterClose,'function')){
      return this.opts.afterClose();
    }
  },300)
};

// 阻止滚动穿透
Popup.prototype.lockBody = function(){
  if(window.pageYOffset){
     this.scrollTop = window.pageYOffset;
     this.docContainer.style.top = - this.scrollTop +"px";
   }
  this.docContainer.classList.add('overflow-hidden');
};

// 回复body滚动
Popup.prototype.unlockBody = function(){
  this.docContainer.classList.remove('overflow-hidden');
  this.docContainer.style.top = "0px";
  if(this.scrollTop !== null){
    window.scrollTo(0,this.scrollTop);
  }
  if(this.scrollTimer){
    clearTimeout(this.scrollTimer);
  }
  this.scrollTimer = window.setTimeout(()=>{
    this.scrollTop = null;
  }, 0);
};

module.exports = Popup;
