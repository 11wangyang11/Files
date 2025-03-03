## 一、基本选择器
首先，基本选择器的作用范围是全局的。他们不仅会匹配到同一个文件中使用了相同元素/类等，还会匹配到不同文件的相同元素/类等，只要他们共享同一个DOM环境（在同一个 HTML 文件中被加载和渲染）。
# 1、元素选择器
定义：按照给定的节点名称，选择所有匹配的元素。如input匹配任何<input>元素。
语法：`elementname { /* 样式规则 */ }`
特点：元素选择器不受元素的层级、位置或属性的影响，只要元素的标签名称与选择器相符，就会被匹配。

# 2、类选择器
定义：按照给定的 class 属性的值，选择所有匹配的元素。
语法：`.classname { /* 样式规则 */ }`
特点： 类选择器也不受元素的层级、位置或标签类型的影响，只要元素的 class 属性中包含指定的类名，就会被匹配。

# 3、ID选择器
定义：按照 id 属性选择一个与之匹配的元素。需要注意的是，一个文档中，每个 ID 属性都应当是唯一的。
语法：`#idname { /* 样式规则 */ }`
特点：首先，在一个有效的 HTML 文档中，每个 ID 应该是唯一的，否则会导致js操作和样式渲染问题。其次，ID选择器的优先级高于类选择器和元素选择器。

# 4、属性选择器
定义：按照给定的属性，选择所有匹配的元素。
语法：[attr] [attr=value] [attr~=value] [attr|=value] [attr^=value] [attr$=value] [attr*=value]
1. `[attr] { /* 样式规则 */ }`:  选择具有指定“属性”的所有元素，而不考虑属性值(后面省略{ /* 样式规则 */ })
2. `[attr=value]`:              选择具有指定“属性和值”的元素
3. `[attribute~="value"]`:      选择属性值中包含“指定词”的元素（词之间用*空格分隔*）
4. `[attribute^="value"]`:      选择属性值以指定字符串“开头”的元素
5. `[attribute$="value"]`:      选择属性值以指定字符串“结尾”的元素
6. `[attribute*="value"]`:      选择属性值中包含指定“子串”的元素（不需要空格）

## 二、分组选择器
定义：`, `是将不同的选择器组合在一起的方法。比如div, span 会同时匹配 <span> 元素和 <div> 元素。注意，分组选择器只有**逗号**一种语法。
语法：`A, B { /* 样式规则 */ }`

## 三、组合选择器
组合选择器是由两个或者多个**基本选择器**组合而成（注意，不是html元素，html元素仅仅是其中的元素选择器），以便在复杂的 DOM 结构中精确选择元素。
# 1、后代组合器
定义：“ ”（空格）组合器选择前一个元素的后代节点。
语法：`A B { /* 样式规则 */ }`
特点：选择所有在元素 A 内的元素 B，无论它们之间隔了多少层。

# 2、直接子代组合器
定义：> 组合器选择前一个元素的直接子代的节点。
语法：`A > B { /* 样式规则 */ }`
特点：只选择紧邻的子元素，不包括更深层次的后代。

# 3、一般兄弟组合器
定义：~ 组合器选择兄弟元素，也就是说，后一个节点在前一个节点后面的任意位置，并且共享同一个父节点。
语法：`A ～ B { /* 样式规则 */ }`
特点： A ~ B 匹配同一父元素下，A 元素后的所有 B 元素。

# 4、紧邻兄弟组合器
定义：+ 组合器选择相邻元素，即后一个元素紧跟在前一个之后，并且共享同一个父节点。
语法：`A + B { /* 样式规则 */ }`
特点：A + B，元素B必须紧跟在A后面，否则无效。**如果想要选择 A 之后的第一个 B 元素，而不论它是否紧邻，则需要使用 JavaScript 或其他逻辑计算来实现，因为纯 CSS 无法直接选择非紧邻的第一个特定类型的兄弟元素。如果 B 元素是固定的，可以通过id选择器实现**

## 四、SASS
在标准的 CSS 中，嵌套是不存在的，所有的选择器都是独立的。因此，所谓的“嵌套”在标准 CSS 中是没有直接作用的。嵌套语法通常是由 CSS 预处理器（如 Sass，后缀.scss）提供的功能，用于提高代码的可读性和组织性。比如：
```scss
.common-od-table {
    overflow: hidden;
    border: 1px solid var(--smtcColorDividerInfo);
    th,
    td {
        position: relative;
        padding: 12px 16px;
        text-align: left;
        font: var(--smtcTypographyTitle3);
    }
}
```
这里，th, td嵌套在.common-od-table内，如果是css文件是不支持的。但是在scss中，**嵌套有作用**，可以约束选择器的作用范围。编译后的css为：
```css
.common-od-table {
  overflow: hidden;
  border: 1px solid var(--smtcColorDividerInfo);
}

.common-od-table th,
.common-od-table td {
  position: relative;
  padding: 12px 16px;
  text-align: left;
  font: var(--smtcTypographyTitle3);
}
```
嵌套语法是scss一个重要的功能，除此之外，scss相比标准css有以下功能：
# 1、使用变量
sass使用$符号来标识变量。
```scss
$nav-color: #F90;
nav {
  $width: 100px; // 只能在nav内部使用
  width: $width;
  color: $nav-color;
}
//编译后
nav {
  width: 100px;
  color: #F90;
}
```
# 2、嵌套CSS
为了嵌套功能的完善，sass还提供了父选择器的标识符“&”，最常见的一种情况是当你为链接之类的元素写：hover这种伪类时，必须与一个选择器结合。如下：
```scss
article a {
  color: blue;
  &:hover { color: red } // 去掉&是错误的
}
// 编译后(如果不提供&，就只能用下面写法，不能嵌套了)
article a { color: blue }
article a:hover { color: red }
```
除此之外，sass针对组合选择器，也可以毫不费力地应用到sass的规则嵌套中。如下：
```scss
article {
  ~ article { border-top: 1px dashed #ccc }
  > section { background: #eee }
  dl > {
    dt { color: #333 }
    dd { color: #555 }
  }
  nav + & { margin-top: 0 }
}
```
sass会如你所愿地将这些嵌套规则一一解开组合在一起：
```css
article ~ article { border-top: 1px dashed #ccc }
article > section { background: #eee }
article dl > dt { color: #333 }
article dl > dd { color: #555 }
nav + article { margin-top: 0 }
```
除此之外，在sass中，除了CSS选择器，属性也可以进行嵌套。如下：
```scss
nav {
  border: {
  style: solid;
  width: 1px;
  color: #ccc;
  }
}
// 编译后
nav {
  border-style: solid;
  border-width: 1px;
  border-color: #ccc;
}
```

# 3、导入Sass文件
css有一个特别不常用的特性，即@import规则，它允许在一个css文件中导入其他css文件。然而，后果是只有执行到@import时，浏览器才会去下载其他css文件，这导致页面加载起来特别慢。  

sass也有一个@import规则，但不同的是，sass的@import规则在生成css文件时就把相关文件导入进来。这种导入方式，我们可以在样式表中对导入的样式稍作修改（一般情况下，你反复声明一个变量，只有最后一处声明有效且它会覆盖前边的值）。sass还提供了默认值（加`!default`），可以更好地支持该功能。如下：
```scss
$fancybox-width: 400px !default;
.fancybox {
width: $fancybox-width;
}
```
在上例中，如果用户在导入你的sass局部文件之前声明了一个$fancybox-width变量，那么你的局部文件中对$fancybox-width赋值400px的操作就无效（因为`!default`的作用是仅当变量尚未被赋值时才赋予默认值，可以理解为比确定的设置如`$fancybox-width: 200px;`等级要低，不管先后顺序都无效）。如果用户没有做这样的声明，则$fancybox-width将默认为400px。  

此外，跟原生的css不同，sass允许@import命令写在css规则内。比如：
```scss blue-theme
aside {
  background: blue;
  color: white;
}
```
然后把它导入到一个CSS规则内，如下所示：
```scss
.blue-theme {@import "blue-theme"}

//生成的结果跟你直接在.blue-theme选择器内写_blue-theme.scss文件的内容完全一样。(// 这种注释也是sass提供的，css只有/* */)

.blue-theme {
  aside {
    background: blue;
    color: #fff;
  }
}
```

# 4、选择器继承
使用sass的时候，最后一个减少重复的主要特性就是选择器继承。选择器继承是说一个选择器可以继承为另一个选择器定义的所有样式。这个通过@extend语法实现，如下代码:
```scss
//通过选择器继承继承样式
.error {
  border: 1px solid red;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```
在上边的代码中，`.seriousError`将会继承`.error`定义的所有样式。以`class="seriousError"` 修饰的html元素最终的展示效果就好像是`class="seriousError error"`。**@extend 通常会结合 %（占位符选择器）一起使用**，如下所示：
```scss
%error {
  border: 1px solid red;
  background-color: #fdd;
}
.normalError {
  @extend %error;
  border-width: 1px;
}
.seriousError {
  @extend %error;
  border-width: 3px;
}
```
%error 是一个 占位符选择器（Placeholder Selector），它本身不会生成 CSS，只有在被 @extend 引用时才会生效。并且，如果 %flexColumn 被多个选择器继承，Sass 会将这些选择器合并，生成更简洁的 CSS。

# 5、计算
标准CSS的calc()函数允许在属性值中进行基本的加、减、乘、除运算。以下是一些示例：
```css
.container {
  width: calc(100% - 50px); /* 减法运算 */
  padding: calc(10px + 2em); /* 加法运算 */
  font-size: calc(16px * 1.5); /* 乘法运算 */
  margin-top: calc(50px / 2); /* 除法运算 */
}
```
而Sass允许在任何地方进行运算，包括变量、颜色、属性值等。以下是一些示例：
```scss
// 变量运算
$base-padding: 10px;
$double-padding: $base-padding * 2;

// 使用变量进行运算
.container {
  padding: $double-padding; // 结果为20px
}

// 颜色运算
$base-color: #ff6600;
$lighter-color: lighten($base-color, 20%);

// 复杂运算
$width: 100%;
$sidebar-width: 250px;
$content-width: $width - $sidebar-width;

.content {
  width: $content-width; // 结果为calc(100% - 250px)
}
```
值得注意的是，Sass的运算是在编译时完成的，因此生成的CSS已经包含了计算结果，而calc()是在浏览器中运行时计算的。

sass在标准css基础上增加了不少实用的功能，这里仅仅介绍了一部分比较常用的功能。

## 参考
1. CSS选择器官网[https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_selectors]
2. SCSS官方文档[https://sass.nodejs.cn/guide/]
3. SCSS文档[https://www.sass.hk/guide/]