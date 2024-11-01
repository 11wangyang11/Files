**TypeScript**是`javaScript`的超集，本质上就是在`javaScript`的基础上增加“预定义”及其相关功能，如类型检查、类型推断、泛型等。下面介绍一下`TypeScript`的预定义和泛型。

### 一、预定义
预定义类型是指在类型定义文件中提前为某些元素或组件定义好类型，以便在使用这些元素或组件时，TypeScript 编译器能够自动推断出正确的类型，而无需显式传入类型参数。预定义包含了接口（interface）、基础类型（如number、string）、枚举、别名（type）、数组和元组、联合类型和交叉类型等等。这里主要介绍两大类，一类是针对原生 HTML 和 DOM 的定义；另一类是常用库 React 提供的类型定义（毕竟我常用的是 React，其他框架自然也会提供属于它的类型定义）。

## 1、HTML和DOM类型定义
TypeScript 提供了一套完整的类型定义，用于描述原生 HTML 元素、DOM API 和浏览器环境中的其他对象。由于我们通常不是直接在原生HTML和DOM上开发，所以下面简单介绍一下。

**主要内容** 

1. HTML 元素：包括如 HTMLDivElement, HTMLSpanElement, HTMLInputElement 等具体的 HTML 元素类型。
2. HTML 属性：包括如 HTMLElement, Element, Attributes 等描述 HTML 元素属性的类型。
3. DOM API：包括如 document, window, Event, Node 等 DOM 操作相关的类型。

下面分别介绍一下：
# (1) HTML 元素
HTML 元素是指 HTML 文档中的各种标签。TypeScript 为每种 HTML 元素提供了对应的类型定义，这些类型定义描述了元素的属性和方法。常用 HTML 元素类型定义有：

- HTMLDivElement：对应 <div> 元素
- HTMLButtonElement：对应 <button> 元素
- HTMLInputElement：对应 <input> 元素
- HTMLAnchorElement：对应 <a> 元素
- HTMLImageElement：对应 <img> 元素 

```ts
const divElement = document.createElement('div') as HTMLDivElement;
divElement.className = 'my-class';
document.body.appendChild(divElement);

const buttonElement = document.createElement('button') as HTMLButtonElement;
buttonElement.textContent = 'Click me';
buttonElement.disabled = false;
document.body.appendChild(buttonElement);

const inputElement = document.createElement('input') as HTMLInputElement;
inputElement.type = 'text';
inputElement.value = 'Type here';
document.body.appendChild(inputElement);
```

# (2) HTML 属性
HTML 属性是指 HTML 元素的各种属性。TypeScript 为这些属性提供了类型定义，用于描述属性的类型和用途。常用 HTML 属性类型定义有：
- className：string
- id：string
- style：CSSStyleDeclaration
- disabled：boolean
- value：string 

```js
const inputElement = document.createElement('input') as HTMLInputElement;
inputElement.type = 'text';
inputElement.value = 'Type here';
inputElement.className = 'input-class';
inputElement.style.color = 'red';
document.body.appendChild(inputElement);

const buttonElement = document.createElement('button') as HTMLButtonElement;
buttonElement.textContent = 'Click me';
buttonElement.disabled = false;
document.body.appendChild(buttonElement);
```

# (3) DOM API
DOM API 是指用于操作和管理 HTML 文档的 JavaScript 接口。TypeScript 为这些接口提供了详细的类型定义，帮助开发者安全地操作 DOM。常用 DOM API 类型定义有：  

- Document：表示整个 HTML 文档
- Element：表示一个 HTML 元素
- HTMLElement：表示一个 HTML 元素，包含所有 HTML 元素的通用属性和方法
- Node：表示 DOM 树中的一个节点
- Event：表示事件对象
- NodeList：表示节点列表 

```ts
const element = document.getElementById('my-element') as HTMLElement;

if (element) {
  element.innerHTML = 'Hello, TypeScript!';
}

const elements = document.querySelectorAll('.my-class') as NodeListOf<HTMLElement>;

elements.forEach((el) => {
  el.classList.add('highlight');
});

document.addEventListener('click', (event: MouseEvent) => {
  console.log('Document clicked:', event);
});
```

### 二、React类型定义
React 在 HTML 基础上扩展了许多类型定义，以便更好地支持组件化开发和事件处理。以下是一些具体的例子，展示了 React 在 HTML 基础上扩展的类型定义。
# 1. className vs class
在原生 HTML 中，使用`class`属性来指定元素的 CSS 类。然而，由于`class`是 JavaScript 中的保留字，React 使用`className`来代替。

原生HTML:
```html
<div class="my-class"></div>
```
React:
```jsx
<div className="my-class"></div>
```
你可能有疑惑，DOM接口`HTMLElement`不是有`className`属性吗？以下是 TypeScript 标准库中关于 HTML 元素的一些定义（简化版）：
```js
// TypeScript's DOM type definitions (simplified)
interface HTMLElement extends Element {
  className: string;
  id: string;
  style: CSSStyleDeclaration;
  title: string;
  // ... more properties
}

interface HTMLDivElement extends HTMLElement {
  // Properties specific to <div> elements
}

interface HTMLSpanElement extends HTMLElement {
  // Properties specific to <span> elements
}

// Event handlers
interface HTMLElementEventMap {
  click: MouseEvent;
  mouseenter: MouseEvent;
  mouseleave: MouseEvent;
  // ... more events
}
```
在原生JavaScript中，你可以这样使用 className 属性：
```js
const element = document.getElementById('my-element');
element.className = 'my-class';
```
在React中，className 属性在JSX中用于指定元素的CSS类，与原生JavaScript中的 className 属性作用相同。以下是一个React组件的例子：
```jsx
function MyComponent() {
  return (
    <div className="my-class">
      Hello, World!
    </div>
  );
}
```
<div className="my-class"> 是JSX语法，它被React转换为虚拟DOM节点，然后由React负责将其渲染为真实的DOM元素。你不需要手动调用 document.createElement 或设置属性，React会处理这些细节。

你可能疑惑，为什么<div class="my-class">有效，但是<div className="my-class">无效。HTML 规范 vs. DOM 规范？？

2. 事件处理程序
React在事件处理程序方面进行了扩展，以便更好地支持合成事件（Synthetic Events）。React的事件处理程序属性名采用驼峰命名法，并且事件处理程序接收的参数是合成事件对象，而不是原生事件对象。

原生HTML:
```html
<button onclick="handleClick(event)">Click me</button>
```
React:
```jsx
<button onClick={handleClick}>Click me</button>
```
3. 特殊属性
React添加了一些特殊属性，用于控制组件的行为和优化性能。例如，key属性用于唯一标识列表中的每个元素，以便React能够高效地更新和重新渲染列表。

React:
```jsx
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```
4. 扩展的HTML属性
React还扩展了一些HTML属性，以便更好地支持组件化开发。例如，htmlFor属性用于代替for属性，以避免与JavaScript中的保留字冲突。

原生HTML:
```html
<label for="input-id">Label</label>
<input id="input-id" type="text">
```
React:
```jsx
<label htmlFor="input-id">Label</label>
<input id="input-id" type="text">
```

5. JSX 特性
React的JSX语法允许你在JavaScript代码中直接编写HTML标记。为了支持这种语法，React在类型定义中添加了一些特性。例如，children属性用于表示组件的子元素。

React:
```jsx
<div>
  <h1>Hello, World!</h1>
  <p>This is a paragraph.</p>
</div>
```
具体的类型定义示例
以下是React的类型定义中一些具体的扩展示例：

```jsx
// React's type definitions (simplified)
declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
    id?: string;
    style?: CSSProperties;
    title?: string;
    // ... more attributes
  }

  interface DOMAttributes<T> {
    onClick?: MouseEventHandler<T>;
    onMouseEnter?: MouseEventHandler<T>;
    onMouseLeave?: MouseEventHandler<T>;
    // ... more event handlers
  }

  // Specific element attributes
  interface DetailedHTMLProps<E extends HTMLAttributes<T>, T> extends HTMLAttributes<T> {
    // ... additional properties
  }

  // Example for <label> element
  interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
    htmlFor?: string;
  }

  // Example for <input> element
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: string;
    value?: string | number | readonly string[];
    // ... more attributes
  }
}
```

## JSX类型
在 React 中，有对常见的 HTML 元素（如 div、span 等）进行类型定义，并放在 React 的类型定义文件中。例如：
```ts
// 代码1
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      // 其他元素的定义...
    }
  }
}
```
“代码1”是*TypeScript*中的一种声明，用于扩展全局的 JSX 命名空间，以便在 React 项目中使用自定义的JSX元素类型。`declare global` 用于扩展全局命名空间。如果你不使用`declare global`，那么你定义的接口或类型将只在当前模块内可见，而不是全局可见。

## React工厂函数类型
```ts
// 代码2
declare namespace React {
  interface ReactHTML {
    div: DetailedHTMLFactory<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    span: DetailedHTMLFactory<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    // 其他元素...
  }
}
```
“代码2”也是 React 定义文件中的代码，用于描述 React 提供的工厂函数。主要用于 React.createElement 和 React.DOM 相关的 API。以下是一些具体的用途：

# 1、React.createElement：
React.createElement 是 React 创建元素的核心函数之一。ReactHTML 定义了特定 HTML 元素的工厂函数，这些工厂函数用于创建具体的 HTML 元素。
```js
React.createElement('div', { className: 'my-class' }, 'Hello, World!');
```
在这个例子中，React.createElement 使用了 ReactHTML.div 的定义来进行类型检查。

# 2、React.DOM：
在早期版本的 React 中（React 16 之前），React.DOM 提供了一组工厂函数，用于创建 HTML 元素。ReactHTML 定义了这些工厂函数的类型。
```js
React.DOM.div({ className: 'my-class' }, 'Hello, World!');
```
虽然这种用法在现代 React 中已经不常见，但 ReactHTML 的定义仍然存在于类型定义中，以确保兼容性。

## 总结
React 在其类型定义中重新定义了一些属性和事件处理程序，以便更好地支持JSX语法和组件化开发。主要的区别包括：
1. 使用className代替class，使用htmlFor代替for，以避免与JavaScript保留字冲突。
2. 事件处理程序采用驼峰命名法，并且使用合成事件对象。
3. 引入特殊属性如key和ref，用于优化和控制组件的行为。


todo。。。。
react扩展了html哪些属性定义和功能？
declare global？
namespace JSX？
div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>？
等等，都说明一下。。。


### 三、自定义函数类型
所以，我们在使用 HTML 元素时，就会对类型进行判断。对于自定义的组件，我们为其添加预定义类型，这样使用的时候就可以直接判断类型是否存在，并给出提示。
```ts
import React from 'react';

interface MyButtonProps {
  label: string;
  onClick: () => void;
}
const MyButton: React.FC<MyButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};

export default MyButton;
```

### 泛型
泛型与预定义有一点不一样，它并不是具体的类型，而是一种用于定义类型的模板或模式，它提供一种灵活和可重用的类型定义方式。

