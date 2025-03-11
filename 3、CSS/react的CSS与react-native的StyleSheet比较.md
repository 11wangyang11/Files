todo...
css多种样式写法，以及各自的优缺点，比如：
1、css用module.css还是.css，各自的优缺点。
2、css与RN的样式表不同，是静态的，面对不同场景的样式差异，是通过一个标签多个className还是类似RN那种通过style传入更加合适。
3、动态布局方面，react常直接获取元素并修改其样式，而RN好像（待调研）只能onlayout修改传入的style样式。直接修改好像可以实现无感知的动态布局（目前react上确实看不到样式变动过程，而RN经常会有）。
4、classname命名，RN样式表用法单一，且类似于css的.module.css，命名不容易冲突。而css使用非常多样化，比如子标签的classname是直接在父标签基础上&-xx，还是可以简写（项目中多种写法都有）。还有除了classname以外的其他写法为什么没有被推崇。
5、全局样式，比如暗黑模式。目前RN都是通过传入provider传入，usecontext触发。如果在css上我们怎么用？用相同方式传style吗
6其他


## 一、reactnative图文混排问题
我们经常遇到比如一段描述文案，后面紧跟着一个按钮。这种就是图文混排。reactnative没有什么好的解决方案，都是采用Text组件嵌套View的方式，但是很不稳定，且样式会走样。比如Text内容变长，里面的View位置可能不会动，仅仅是文本变长，导致样式出问题。
第一，如果按钮是复杂的样式（必须使用View组件），那确实没什么好的方法；
第二，如果按钮就是一个文本，或者本身就是一个文本但是视觉希望这个文本是永远绑定在一起的，那其实有一个解决方法，就是使用**连字符(\u2060)**，比如：
```jsx
// 我们希望roomNights是完整的不会从中间断开，做法：newRoomNight = roomNights?.split('').join('\u2060');每个字符都连起来
<Text>
    <Text>{roomName}</HText>
    <HText>{roomNights}</HText>
</Text>
```


## 二、