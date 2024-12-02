**TypeScript**是`javaScript`的超集，本质上就是在`javaScript`的基础上增加“类型定义”及其相关功能，如类型检查、类型推断、泛型等。下面介绍一下`TypeScript`的预定义和泛型。今天这里主要介绍一下预定义，也就是语言本身或其标准库中已经定义好的类型、接口、函数、对象等，不需要开发者自己定义。

### 一、预定义
预定义类型是指在类型文件中提前为某些元素或组件定义好类型，以便在使用这些元素或组件时，TypeScript 编译器能够自动推断出正确的类型，而无需显式传入类型参数。预定义包含了接口（interface）、基础类型（如number、string）、枚举、别名（type）、数组和元组、联合类型和交叉类型等等。这里主要介绍两大类，一类是针对原生 HTML 和 DOM 的定义；另一类是常用库 React 提供的类型定义（毕竟我常用的是 React，其他框架自然也会提供属于它的类型定义）。

## 1、interface和type区别
预定义的方式最主要就是“接口”和“类型”。TypeScript中，接口`interface`与类型`type`往往都可以互换使用。不同之处是：

1. 定义方式不同
```ts
interface User {
    name: string;
    age: number;
}

type User = {
    name: string;
    age: number;
};
``` 

2. 扩展（继承）
```ts
// interface使用extends关键字(此外，interface支持声明合并，即可以多次声明同一个接口，TypeScript会将它们合并，下面会提到)
interface Person {
    name: string;
}

interface Employee extends Person {
    employeeId: number;
}

// type使用交叉类型（&）
type Person = {
    name: string;
};

type Employee = Person & {
    employeeId: number;
};
```
3. 适用范围
- interface主要用于定义对象的结构。
- type不仅可以定义对象的结构，还可以定义联合类型、交叉类型、元组等更复杂的类型。
```ts
// type用“=”可以进行这种复杂类型的定义，但interface就无法做到了
type ID = number | string; // 联合类型
type Coordinates = [number, number]; // 元组
```


## 2、HTML和DOM类型定义
TypeScript 提供了一套完整的类型定义，用于描述原生 HTML 元素、DOM API 和浏览器环境中的其他对象。由于我们通常不是直接在原生HTML和DOM上开发，所以下面简单介绍一下。

# （1）HTML元素
在web开发中，浏览器会将HTML解析成DOM树。这里先简单介绍一下DOM结构，如下图：
```plaintext
Node
  └── Element
        └── HTMLElement
              └── HTMLDivElement
```
基础类型 Node、Element、HTMLElement 外（Element、HTMLElement提供了访问和操作具体元素的方法和属性，这里先不展开介绍），HTML相关的类型主要就是HTMLDivElement、HTMLButtonElement等HTML元素类型。每个元素的属性有差异，如下：
```ts
// 获取 <input> 元素
const inputElement = document.querySelector('input') as HTMLInputElement;
inputElement.type = 'text';
inputElement.value = 'Hello, World!';
inputElement.placeholder = 'Enter text';

// 获取 <img> 元素
const imageElement = document.querySelector('img') as HTMLImageElement;
imageElement.src = 'https://www.example.com/image.jpg';
imageElement.alt = 'Example Image';
imageElement.width = 300;
imageElement.height = 200;

// 获取 <button> 元素
const buttonElement = document.querySelector('button') as HTMLButtonElement;
buttonElement.disabled = false;
buttonElement.type = 'submit';
buttonElement.value = 'Click Me';
```

那如果我们希望对<button>元素增加一个属性，怎么办? 如下所示：

```ts
// global.d.ts
// 扩展 HTMLButtonElement 接口，添加 test 属性
interface HTMLButtonElement {
    testid: string;
}

// 使用
const buttonElement = document.querySelector('button') as HTMLButtonElement;
buttonElement.testid = 'button';
```

这里你是不是很疑惑，为什么`interface HTMLButtonElement { testid: string; }`为什么是扩展`HTMLButtonElement`，而不是重新定义`HTMLButtonElement`？因为interface支持声明合并，即可以多次声明同一个接口，TypeScript会将它们合并。比如：
```ts
interface User {
  name: string;
}

interface User {
  age: int;
}

// 那Typescript会User接口定义为:
interface User {
  name: string;
  age: int;
}
```
接口`interface`可以合并，命名空间`namespace`也可以合并。

# (2) DOM API
介绍DOM API预定义之前，先再理一下DOM的结构。上面介绍HTML元素类型的时候简单介绍了一下DOM结构。这里再提供一个更加详细的DOM接口继承图，如下：    

```plainText
Node
 ├── Document
 ├── DocumentFragment
 ├── DocumentType
 ├── Element
 │    ├── HTMLElement
 │    │    ├── HTMLAnchorElement
 │    │    ├── HTMLButtonElement
 │    │    ├── HTMLDivElement
 │    │    ├── HTMLImageElement
 │    │    ├── HTMLInputElement
 │    │    ├── HTMLParagraphElement
 │    │    ├── HTMLSpanElement
 │    │    ├── HTMLTableElement
 │    │    ├── HTMLTableRowElement
 │    │    ├── HTMLTableCellElement
 │    │    └── ... (其他 HTML 元素)
 │    ├── SVGElement
 │    └── ... (其他类型的元素)
 ├── Attr
 ├── CharacterData
 │    ├── Text
 │    ├── Comment
 │    └── CDATASection
 ├── ProcessingInstruction
 └── ... (其他节点类型)
```

Document负责提供访问和操作整个文档的方法和属性；Element负责提供访问和操作具体元素的方法和属性。这里介绍与Element同级别的Document，它是访问和操作整个文档的入口点，比如：  

```ts
// NodeList
const elements = document.querySelectorAll('.my-class') as NodeListOf<HTMLElement>;
elements.forEach((el) => {
  el.classList.add('highlight');
});

// MouseEvent
document.addEventListener('click', (event: MouseEvent) => {
  console.log('Document clicked:', event);
});
```

### 二、React类型定义
React 在 HTML 基础上扩展了许多类型定义，以便更好地支持组件化开发和事件处理。以下是一些具体的例子，展示了 React 在 HTML 基础上扩展的类型定义。
## 1、className vs class
在原生 HTML 中，使用`class`属性来指定元素的 CSS 类。然而，在 JavaScript 中，class 是一个保留字，用于定义类(如class Button)。为了避免冲突，JSX 使用 `className` 来表示 HTML 元素的类属性。而 JSX 是 JavaScript 的扩展，所以在 JSX 文件中，也只能用`className`表示HTML 元素的类属性。如下：

**原生HTML:**
```html
<style>
    .my-class {
        color: red;
        font-size: 20px;
    }
</style>
<div class="my-class">This is a styled div.</div>
<script>
    const element = document.querySelector('.my-class');
    element.addEventListener('click', () => {
        alert('Element clicked!');
    });
</script>
```
**JSX**
```jsx
// 这里就不能使用class了
<div className="my-class"></div>
```
这里说的是JSX，与React有什么关系？因为React支持JSX，使用React写组件一般使用JSX或者TSX。当然你用传统JS写也可以，比如：
```js
import React from 'react';

function MyComponent() {
    return React.createElement('div', null, 'Hello, JavaScript!');
}

export default MyComponent;
```

## 2、React预定义
上面比较了`className`和`class`，仅仅是解释了在 React 中为什么HTML元素都使用`className`，而不是`class`作为类名的原因。这里开始介绍React类型定义。React针对JSX语法也提供了系统的预定义。

首先，我在React库的global库的global.d.ts文件中看到如下类型定义：
```ts
interface Event { }
interface AnimationEvent extends Event { }
interface MouseEvent extends Event { }
// ...

interface Element { }
interface HTMLElement extends Element { }
interface HTMLButtonElement extends HTMLElement { }
interface HTMLLinkElement extends HTMLElement { }
// ...
```
为什么React库中要定义一下这些类型？这些都是Typescript库中已有的定义啊。应该是为了后面方便扩展用的吧！

其次，React还针对div等元素进行类型扩展，来确保在使用JSX时能够正确地推断出元素的类型和属性。比如新增className、onClick等。
代码示例：
```ts
// react的index.d.ts文件
export = React;
export as namespace React;

declare namespace React {
  // 许多元素类型都继承HTMLAttributes<T>
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string | undefined;
    dir?: string | undefined;
    placeholder?: string | undefined;
    //...
  }

  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean | undefined;
    form?: string | undefined;
    type?: 'submit' | 'reset' | 'button' | undefined;
    // ...
  }

  interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
    href?: string | undefined;
    imageSizes?: string | undefined;
    rel?: string | undefined;
    sizes?: string | undefined;
    type?: string | undefined;
    // ...
  }
  
  // React.DOM
  interface ReactHTML {
    button: DetailedHTMLFactory<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    div: DetailedHTMLFactory<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    link: DetailedHTMLFactory<LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
    // ...
  }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            // HTML
            button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
            div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
            h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            i: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            small: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            strong: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
            input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
            link: React.DetailedHTMLProps<React.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
            script: React.DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
            section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            
            style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;

            // SVG
            svg: React.SVGProps<SVGSVGElement>;
            circle: React.SVGProps<SVGCircleElement>;
            ellipse: React.SVGProps<SVGEllipseElement>;
            view: React.SVGProps<SVGViewElement>;
        }
    }
}
```
React的`index.d.ts`文件中，一方面提供了命名空间React，用于模块化的方式导入和使用 React。外部可以通过`React.ReactHTML`的方式使用该类型。当然如果某接口使用`export`导出，还可以直接引入接口。另一方面，全局声明中提供了命名空间JSX的接口。将 JSX 命名空间定义在全局作用域中，确保 TypeScript 编译器在处理任何包含 JSX 语法的文件时，都能正确地理解和检查这些 JSX 元素的类型。比如如下代码：
```tsx
// App.tsx
const App = () => {
  return (
    <div>
      <span>Hello, World!</span>
    </div>
  );
};
export default App;
```

你可能疑惑了，我虽然定义了JSX命名空间，但是我并没有在`App.jsx`文件中引入该命名空间。为什么它会使用JSX的类型来理解和检查我的JSX元素类型。原因是，当你使用 JSX 语法时（JSX语法只能在`.jsx` 文件中使用），TypeScript 会隐式地使用 JSX 命名空间的接口来进行类型检查。

## 3、事件处理程序
React在事件处理程序方面进行了扩展，以便更好地支持合成事件（Synthetic Events）。React的事件处理程序属性名采用驼峰命名法，并且事件处理程序接收的参数是合成事件对象，而不是原生事件对象。

**原生HTML:**
```html
<button onclick="handleClick(event)">Click me</button>
```
**React:**
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

