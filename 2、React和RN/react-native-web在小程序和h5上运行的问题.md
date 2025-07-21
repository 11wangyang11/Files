**互联网发展到今天，一码多端是前端的一个大趋势。react-native提供了react-native-web库可以实现跨平台兼容h5端(手机浏览器)，同时由于小程序可以内嵌h5页面，所以h5页面也可以运行在小程序上。但是毕竟不是原生系统，会存在一些底层api调用的问题。**

### 一、小程序上打开pdf功能异常
这里说一下rn-web运行在微信小程序上遇到的问题，即在android小程序上无法直接打开pdf链接。这就是api调用的问题，多端兼容，除了样式问题，就是这类问题了。

# 1、分析如下：
1. 微信小程序因为安全问题(也可能是分流问题)，限制了外部链接的访问，所以无法通过唤起默认浏览器的方式打开PDF；
https://pages.c-ctrip.com/wireless-app/imgs/order_images/invoice/cantVatCommon.pdf
2. 支付宝小程序等，打开该链接会自动跳转默认浏览器去打开pdf文件；
3. android打开pdf需要通过浏览器的方式，而iOS内置了对pdf的支持，可以直接打开pdf；
4. 由于android缺乏pdf阅读器，尝试一下react-native-pdf库是否可以；
5. 使用wx.navigateToWebview。小程序的 WebView 有一些限制和安全策略，可能会限制或阻止打开外部链接。因此，在使用 `wx.navigateToWebview` 方法之前，你需要确保小程序的 WebView 允许打开外部链接。尝试了发现微信小程序不行，支付宝小程序可以。

# 方案：
所以，目前考虑的方法如下：   
1. 一是直接使用wx提供给内嵌h5页面的api接口。微信小程序也确实为内嵌h5页面提供了相关API。但是，微信JS-SDK(面向网页开发者提供的基于微信内的网页开发工具包，https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)并没有提供打开pdf文件。尝试了wx.openDocument等都是不行的。原生小程序是有这样的API的，但是给内嵌h5的api却没有。。。

2. 二是提供pdf阅读器。首先，react-native-pdf只适用于app端且需要iOS/android提供支持。所以需要写一个支持小程序端的pdf阅读器，比较复杂；    

**最后，让小程序开发者提供一个跳转原生页面，我们直接跳转该原生页面并打开pdf。但是这需要小程序开发实现。**

## 二、小程序图片长按功能异常
我们需求是进入到我们的微信小程序页面然后唤起一个弹窗，引导长按二维码唤起添加企业微信浮层。弹窗也是由市场提供，直接嵌套在我们的react-native页面中。但是，存在一个问题，react-native嵌套的web页面是通过iframe的形式嵌套的，可能是iframe独立的环境与小程序的通讯存在障碍，在iOS的手机上，长按是无法唤起添加企业微信浮层的，只能唤起系统的图片弹窗。

# 解决方案：
弹窗由我们自己做，避免了iframe嵌套的影响。但是，微信小程序上长按二维码图片可以唤起添加微信浮层，这是微信小程序对web页面存在的默认功能，但前提是需要识别出这是图片，img标签就是图片。但是react-native的Image组件生成的web端代码并不是img标签，所以在微信小程序无法实现该功能。所以，必须使用react的img标签，而不能使用Image组件。所以，这个弹窗代码必须运行在web端，app端是无法运行的。

<!-- ## 项目中混用react标签，react标签的事件无法捕获
我在reactnative中用了一下button标签，但是点击事件onClick没有反应。而最外层使用的reactnative的按钮组件TouchableOpacity的onPress是会捕获到button冒泡过来的点击事件的。所以，reactnative虽然可以运行在web端，但是事件机制存在差异，虽然可以混合使用react标签。展示没有问题，但是事件触发上存在问题。事件绑定好像没有问题，但是目前不知道为什么。。。。 -->



