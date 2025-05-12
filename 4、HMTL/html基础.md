### 一、html的基础结构
下面是一个简单的html代码。
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## 1、<!DOCTYPE html>
<!DOCTYPE html> 是 HTML5 文档的**文档类型**声明，用于告知浏览器当前页面遵循的 HTML 版本标准，确保浏览器以标准模式正确渲染页面内容。省略，浏览器可能进入怪异模式，导致布局错乱。

## 2、<html lang="en">

## 3、<meta charset="UTF-8" />
`<meta/>` 标签是 HTML 中用于定义网页元数据（metadata）的标签，它提供关于网页的附加信息，但这些信息不会直接显示在页面上。这些元数据通常用于指导浏览器、搜索引擎或其他网络服务如何解析或处理当前页面。

# (1)、<meta>标签的属性
1. charset: 声明网页的字符编码（如 UTF-8），确保浏览器正确解析文本内容。charset属性常用的值有3个。
    1. UTF-8: 万国码，可识别中文、英文、符号、表情等复杂内容；
    2. GBK: 简/繁中文+扩展，兼容GB2312；
    3. GB2312: 简体中文。
2. name/content: SEO 优化（搜索引擎优化）。向搜索引擎提供页面描述、关键词、作者等信息，影响搜索结果的展示。
```html
<meta name="description" content="这是一个关于HTML元标签的教程">
<meta name="keywords" content="HTML, meta标签, 网页开发">
<meta name="author" content="张三">
```
3. http-equiv: 通过 http-equiv 属性模拟 HTTP 协议头，实现页面刷新、缓存控制等功能。
```html
<!-- 5秒后跳转到指定URL -->
<meta http-equiv="refresh" content="5; url=https://example.com">
<!-- 禁止浏览器使用缓存 -->
<meta http-equiv="Cache-Control" content="no-cache">
```

# (2) <meta> 标签的特点
1. 位置：必须放在 <head> 标签内；
2. 无闭合标签：在 HTML5 中是自闭合标签（如 <meta ...>），无需 </meta>，也不存在包裹内容；
3. 属性依赖：功能由 name、charset 或 http-equiv 等属性决定。

## 4、<title>
作用：定义页面的标题（显示在浏览器标签页或搜索结果中）。
必要性：HTML 规范要求每个文档必须包含 <title>，否则文档被视为不合法。

## 5、<meta name="viewport" content="width=device-width, initial-scale=1.0" />
作用：控制移动端视口的缩放与布局，确保页面适配不同设备。
必要性：非强制，但现代响应式设计几乎必须包含。

### 二、常用的html实体字符
&lt; 左箭头；
&gt; 右箭头；
&nbsp; 空格；

### 三、布局方式
html标签有三种布局方式。元素有默认的布局方式，同时可以设置。
## 1、块级(block)
独占一行，可设置宽高、内外边距。常见标签：
```html
<div>         <!-- 通用容器 -->
<h1>-<h6>     <!-- 标题 -->
<p>           <!-- 段落 -->
<ul>, <ol>    <!-- 无序/有序列表 -->
<li>          <!-- 列表项 -->
<table>       <!-- 表格 -->
<form>        <!-- 表单 -->
<header>, <footer>, <section>, <article> <!-- HTML5 语义标签 -->
```
块级元素通常可以包含其他块级元素或内联/内联块级元素。当然，也应该准守 HTML 规范。比如： 

1. 段落标签 <p> 内部不能嵌套其他块级元素。
```html
<p>
  段落内容
  <div>禁止嵌套块级元素</div> <!-- 浏览器会提前闭合 <p> 标签 -->
</p>
<!--浏览器解析后-->
<p>段落内容</p>
<div>禁止嵌套块级元素</div>
```

2. <li> 必须直接位于列表容器内（如 <ul>、<ol>），不可单独嵌套块级元素。

3. <table> 的直接子元素只能是 <thead>、<tbody>、<tr>。

## 2、内联(inline)
不独占一行，不可以设置宽高（需通过 display: inline-block 或 block 覆盖），边距仅左右生效（上下边距不影响布局）。只能嵌套内敛/内联块级元素。常见标签：
```html
<img>         <!-- 图片（默认 inline-block）-->
<input>       <!-- 输入框 -->
<button>      <!-- 按钮 -->
<select>      <!-- 下拉框 -->
<textarea>    <!-- 多行文本框 -->
```

## 3、内联块级(inline-block)
不独占一行，但可以设置宽高。默认对齐方式为基线对齐（可通过 vertical-align 调整）。常见标签：
```html
<img>         <!-- 图片（默认 inline-block）-->
<input>       <!-- 输入框 -->
<button>      <!-- 按钮 -->
<select>      <!-- 下拉框 -->
<textarea>    <!-- 多行文本框 -->
```
