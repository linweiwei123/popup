
Docs and Demos
================

## showcase
![image](http://adstatic.oss-cn-beijing.aliyuncs.com/ad-activity.meiyou.com/dkd2/v4/example.jpg?x-oss-process=image/resize,m_fixed,h_667,w_375)

## feature
1、解决ios滚动穿透问题

2、支持open，close前后的生命周期

3、支持动画

## install
``` bash
npm install popup --save-dev
```

## How to use?
### HTML
``` html
  <body>

    <div class="container">
       <!-- 你的页面内容 -->
    </div>

    <div class="meet-popup">
      <div class="meet-popup-mask"></div>
      <div class="meet-popup-container">
        <div class="popup-header">
          <span class="p-left">顶部header数据</span>
          <span class="p-right">
            <div class="popup-close-icon"></div>
          </span>
        </div>
        <div class="popup-content">
           <!-- 你的弹框内容 -->
        </div>
      </div>
    </div>

  </body>
```
### javascript
####基础使用
``` javascript
const Popup = require('popup');

var popupMsg = new Popup(document.querySelector('.meet-popup'),{
  container: '.container',  // 必须，页面容器的选择器
});

popupMsg.open();

Is it easy to use ? 😂

```

#### 高级使用
``` javascript
const Popup = require('popup');

var popupMsg = new Popup(document.querySelector('.meet-popup'),{
  container: '.container',  // 必须，页面容器的选择器
  header: 'center',  // 必须 弹框header的布局 ，支持：left， center
  animate: true, // 非必须， 默认无动画
  beforeOpen: function(next){ // 非必须，open前的钩子函数
    next();
  },
  afterOpen: function(){  // 非必须 open后的钩子函数
  },
  beforeClose: function(next){  // 非必须 close前的钩子函数
    next()
  },
  afterClose: function(){  // 非必须 close后的钩子函数
  }
});

popupMsg.open();

```

## All Popup options

property | description
---|---
open | show popup
close | close popup

## demo

![image](http://adstatic.oss-cn-beijing.aliyuncs.com/ad-activity.meiyou.com/dkd2/v4/qrcode2.png?x-oss-process=image/resize,m_fixed,h_400,w_400)