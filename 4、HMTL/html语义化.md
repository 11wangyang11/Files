## 一、html语义化标签
HTML语义化的核心在于通过标签准确描述内容的含义和结构，而非仅依赖视觉呈现。HTML语义化可以提升页面的可访问性、增强SEO（Search Engine Optimization）、提升代码的可读性等。下面列举几个常见的语义化标签。
# 1、文本语义化
1. 强调内容：
<strong>：重要性（如警告）。
<em>：强调（如斜体语义）。

2. 时间与地址：
<time datetime="2023-10-01">：机器可读的时间。
<address>：联系方式（通常放在 <footer> 内）。

3. 引用内容：
<blockquote>：长引用（需配合 cite 属性）。
<q>：短内联引用。

# 2、多媒体与图表
<figure> + <figcaption>：
关联图片、图表与其标题，增强可访问性和 SEO。
<img> 的 alt 属性：
描述图片内容，对 SEO 和屏幕阅读器至关重要。

# 3、表格与列表
**表格结构**：表格结构上使用<thead>、<tbody>、<tfoot> 明确划分表格区域。同时，浏览器在解析表格时，会根据标签的逻辑<thead> -> <tbody> -> <tfoot>的顺序而非代码顺序来渲染。其次，渲染上会先显示表头 <thead>（标题行），接着显示表尾 <tfoot>（总计行）。最后逐步渲染 <tbody> 的数据行。如果表格数据量极大（如数千行），还使用多个 <tbody> 分割数据块，浏览器可以分块渲染如果。最后，这些标签为 CSS 提供了更精确的选择器作用域，能实现差异化样式。另外需要注意的是，应该使用 <th> 定义列标题（而非 <td>）。
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>商品价格表</title>
    <style>
        /* 基础表格样式 */
        table {
            width: 100%;
            border-collapse: collapse; /* 合并边框 */
            margin: 20px 0;
            font-family: Arial, sans-serif;
        }

        caption {
            font-size: 1.2em;
            font-weight: bold;
            padding: 10px;
            caption-side: top; /* 标题位置（top/bottom） */
        }

        th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd; /* 浅灰色边框 */
        }

        thead {
            background-color: #f8f9fa; /* 浅灰色背景 */
        }

        tfoot {
            background-color: #e9ecef; /* 稍深的灰色 */
            font-weight: bold;
        }

        tbody tr:nth-child(even) {
            background-color: #f2f2f2; /* 斑马纹效果 */
        }
    </style>
</head>
<body>
    <!-- 表格容器 -->
    <table>
        <!-- 表格标题 -->
        <caption>2023年商品销售清单</caption>

        <!-- 表头：定义列标题 -->
        <thead>
            <tr>
                <th scope="col">商品ID</th>  <!-- scope="col" 表示列标题 -->
                <th scope="col">商品名称</th>
                <th scope="col">单价（元）</th>
                <th scope="col">销量</th>
            </tr>
        </thead>

        <!-- 表格主体：实际数据 -->
        <tbody>
            <tr>
                <td>001</td>
                <td>无线鼠标</td>
                <td>150.00</td>
                <td>320</td>
            </tr>
            <tr>
                <td>002</td>
                <td>机械键盘</td>
                <td>450.00</td>
                <td>180</td>
            </tr>
            <tr>
                <td>003</td>
                <td>蓝牙耳机</td>
                <td>299.00</td>
                <td>450</td>
            </tr>
        </tbody>

        <!-- 表尾：汇总数据 -->
        <tfoot>
            <tr>
                <td colspan="3">总销售额</td>  <!-- 合并前三列 -->
                <td>¥ 256,350.00</td>          <!-- 实际数据 -->
            </tr>
        </tfoot>
    </table>
</body>
</html>
```

**列表类型**：
列表类型	标签结构	               适用场景	                 默认样式
<ul>	<ul> + <li>	             导航、无顺序清单	         项目符号（如圆点）
<ol>	<ol> + <li>	          步骤、排名、需顺序的内容	       数字或字母序列
<dl>	<dl> + <dt> + <dd>	术语定义、问答对、键值对数据	    术语与描述缩进

```html
<!-- <ul> -->
<ul style="list-style-type: none;">
  <li>Milk</li>
  <li>
    Cheese
    <ul>
      <li>Blue cheese</li>
      <li>Feta</li>
    </ul>
  </li>
</ul>

<!-- <ol> -->
<ol type="1">
  <li>Mix flour, baking powder, sugar, and salt.</li>
  <li>In another bowl, mix eggs, milk, and oil.</li>
</ol>

<!-- <dl> -->
<dl>
  <dt>Morgawr</dt>
  <dd>A sea serpent.</dd>
  <dt>Morgawr</dt>
  <dd>A sea serpent.</dd>
</dl>
```

## 二、语义化标签作用
前面已经提到了，HTML语义化可以提升可访问性、增强SEO、提升代码的可读性。这里就以列表类型为例，简单说明一下。
# 1、提升可访问性（Accessibility）
屏幕阅读器（如 NVDA、VoiceOver）能识别列表类型，为用户提供清晰的导航提示：
<ul>/<ol>：告知用户列表项数量和类型（如“列表包含3项”）。
<dl>：明确区分术语（<dt>）和描述（<dd>），帮助理解内容关系。

# 2、增强 SEO
搜索引擎通过标签理解内容结构，例如：
<ol> 中的步骤可能被识别为“操作指南”类内容，提升相关性评分。
<dl> 中的术语可能被提取为关键词，优化搜索结果。

# 3、代码可维护性
开发者友好：通过标签名称快速理解代码意图（如看到 <dl> 就知道是定义列表）。
样式分离：CSS 可直接针对标签（如 ul { ... }）设计样式，减少对类名的依赖。

## 三、无障碍
无障碍对开发者而言，需要要做什么？首先，除了语义化标签外，无障碍还要做到以下几点：
1. 页面的结构清晰、内容和背景的对比度清晰，让用户可以看清楚文字信息；
2. 提供内容链接导航，让阅读障碍的用户可以快速定位到自己需要的信息；
3. 为视频和音频内容提供字幕和文字转录，图片提供alt描述文案，为所有交互元素（如链接、按钮、表单控件）都可以通过键盘操作等，提供不同形式的信息和交互给不同需求的用户使用；
4. 功能上，要尽可能支持各种阅读辅助工具。

支持无障碍，需要页面设计者到页面开发者的共同努力。但是，我认为如果对无障碍阅读有一套设计标准、测试标准，可以更好地规范开发者。
