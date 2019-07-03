<%= name %>

<%= description %>

<%= name %>小程序，基于 gulp4 和 webpack 打包，src 为源代码，dist** 为打包后代码，小程序添加项目文件夹指定 dist** 目录

# 设配方案介绍
http://confluence.corp.imdada.cn/pages/viewpage.action?pageId=10933392

# 目录结构介绍

src--|--config    --项目配置文件(微信/百度/支付宝)
     |--distWeapp --微信包
     |--distSwan  --百度包
     |--disAliapp --支付宝包
     |--src--|--adapters--|--index   --统一api对象
             |            |--weapp   --微信适配模块
             |            |--swan    --百度适配模块
             |            |--aliapp--|  --支付宝适配模块 （微信/百度/支付宝三个模块的目录结构基本一致）
             |                       |--common --该目录以及自目录 与 src中common模块以及子目录 一一对应
             |                       |--pages  --该目录以及自目录 与 src中pages模块以及子目录 一一对应
             |--common --各小程序，通用模块，对应子项目库--git@git.corp.imdada.cn:fe/spruce.git
                    |--components --通用组件
                    |--pages/web  --小程序通过webview适配H5。多端可以使用一套H5，减少开发/维护成本。（浏览器/APP/小程序）
             |--pages  --达达小程序业务逻辑页面

# adapters目录内容总结

组件适配：cell、modal、pure-modal、slide-up
页面适配：登陆、个人中心头部
api适配：getStorageSync, setStorageSync, removeStorageSync, request, triggerEvent,
        showToast, setIncludePoints, getClipboardData

# 脚本命令

yarn 安装依赖
yarn start:weapp   发布微信小程序代码   生产目录 distWeapp
yarn start:swan    发布百度小程序代码   生产目录 distSwan
yarn start:aliapp  发布支付宝小程序代码 生产目录 disAliapp

# 多端（微信/百度/支付宝）差异整理

http://confluence.corp.imdada.cn/pages/viewpage.action?pageId=10789946

# 多端适配注意事项

1，编译：微信组件，可以接收组件未定义属性 如事件/样式，支付宝组件经编译后，这些属性会丢失，需要注意把这些属性统一写在外层。
编译正确示例：
```JavaScript
<view class="padding" bindtap="handleOrderListClick">
  <icon-dada type="order-list" other-size="{{36}}" />
</view>
```
编译错误示例：
```JavaScript
<icon-dada class="padding" bindtap="handleOrderListClick" type="order-list" other-size="{{36}}" />
```
2，事件传递接收传参：
事件触发
```JavaScript
triggerEvent(this, 'chooseCoupon', {
    couponId: event.currentTarget.dataset.coupon.couponId,
})
```
接收参数
```JavaScript
<!-- event.couponId 支付宝 -->
<!-- event.detail.couponId 微信 -->
let activeId = event.couponId || event.detail.couponId
```

3，事件通过设置data传参大小写：
```JavaScript
<button 
  bindtap="setShareModal"
  data-taskTypeId="{{task.taskTypeId}}">
  去完成
</button>
 
<!-- 获取参数 -->
<!-- 微信 -->
taskTypeId = e.currentTarget.dataset.tasktypeid
<!-- 百度 -->
taskTypeId = e.currentTarget.dataset.taskTypeId
```


4，组件属性赋值：
支付宝组件外面传入属性定义如 props: { title: 'abc'}，而微信中是property: { type: String, title: 'abc' },
这里适配核心是属性有默认值或者被赋值，所以统一适配成被赋值。需要注意的点是，即使仅需要使用默认值的情况，在使用组件时，
不能省略赋值操作。

```JavaScript
<!-- 组件cell -->
Component({
  properties: {
    // 是否可点击，显示箭头
    hasArrow: {
      type: Boolean,
      value: true,
    },
  }
})

<!-- 正确示例： -->
<cell hasArrow="{{true}}" />

<!-- 错误示例： -->
<cell />
```

