背景：但是为什么项目总是使用Babel等编译器或转换工具，将代码编译成ES5的JavaScript代码呢？理一理ECMAScript、JS、TS以及ESModules的关系。

### 一、TS、JS和ES的关系
TypeScript（TS）是由微软开发的一种编程语言，它是 JavaScript 的超集，主要增加了静态类型和其他一些特性。TypeScript 编译器（tsc）会**将 TypeScript 代码编译为标准的 JavaScript 代码**，以便在任何支持 JavaScript 的环境中运行。
*具体来说：*

**1、语法和特性：**
1. TypeScript 支持 ES6 及其后续版本的大多数语法和特性，例如箭头函数、类、模板字符串、解构赋值、模块系统等，当然也支持ES6之前的语法。
2. TypeScript 还增加了一些 JavaScript 中没有的特性，例如接口、类型注解、枚举、元组等。

**2、编译目标：**
TypeScript 编译器允许你指定编译目标，可以是 ES3、ES5、ES6 或更高版本。通过配置 tsconfig.json 文件中的 target 选项，你可以控制编译后的 JavaScript 版本。

**3、兼容性：**
1. TypeScript 的设计目标之一是与现有的 JavaScript 代码兼容。因此，任何有效的 JavaScript 代码都是有效的 TypeScript 代码。
2. TypeScript 编译器会将 TypeScript 代码编译为符合指定 ECMAScript 版本的 JavaScript 代码，确保生成的代码可以在目标环境中运行。

总结一下，TS是JS的超集，ES(ECMAScript)是由 ECMA 国际（欧洲计算机制造商协会）制定的标准，定义了 JavaScript 的核心语法和功能。那TS和ES的关系是什么呢？TypeScript 在 ECMAScript 的基础上进行了扩展，添加了静态类型检查、接口、枚举、泛型等特性。这些特性并不是 ECMAScript 标准的一部分，但它们增强了代码的可读性和可维护性。TypeScript 代码需要通过 TypeScript 编译器（tsc）编译成纯 JavaScript 代码（即 ECMAScript 代码），才能在浏览器或 Node.js 环境中运行。

## 具体关系
1. ECMAScript：定义了 JavaScript 的核心语法和功能，是JS代码的标准。
2. JavaScript：基于 ECMAScript 标准的实现。
3. TypeScript：基于 ECMAScript 标准的 JavaScript 超集，添加了额外的类型和语法特性。

```js
ECMAScript 标准
    |
    v
JavaScript (JS) <---- TypeScript (TS)
    |
    v
ES5, ES6, ES7, ...
```
**例如，ECMAScript 标准中定义了变量声明的语法：**
```js
var x = 10;
let y = 20;
const z = 30;
```
**JavaScript 作为 ECMAScript 的实现，自然也就按照这种方式声明变量：**
```js
var x = 10;
let y = 20;
const z = 30;
console.log(x); // 输出 10
```

**既然ECMAScript：定义了 JavaScript 的核心语法和功能，那非核心的语法和功能呢？**
前面提到，ECMAScript 定义了 JavaScript 的核心语法和功能，但在实际使用中，JavaScript 还包含了一些非核心的语法和功能，这些通常由运行环境（例如浏览器或 Node.js）提供。上面JavaScript中的`console.log(x);`其实就是浏览器或者 Node.js提供的功能。当然，这里`console`浏览器和 Node.js均提供了这个功能，还有`setTimeout、setInterval`等。还有一些功能是浏览器或者 Node.js单独的功能，比如浏览器提供的`window`等。具体关系如下图：
[ECMAScript与Node.js/浏览器关系图](https://ibb.co/2Y5r4Wb)

这里再细说一下，浏览器还包括了：
1. 浏览器对象模型（Browser Object Model，简称 BOM），也就是 window 对象
2. 文档对象模型（Document Object Model，简称 DOM），也就是 document 对象   

浏览器使用的引擎主要包括两个部分：渲染引擎和 JavaScript 引擎。渲染引擎负责解析 HTML、CSS，并将它们渲染成网页。不同浏览器使用不同的渲染引擎，如Google Chrome使用Blink 渲染引擎（与JS无关，这里不做细说）。同时，不同浏览器的 JavaScript 引擎也不同，如 Chrome 的 V8，Firefox 的 SpiderMonkey，Safari 的 JavaScriptCore。而 Node.js 则是使用 V8 JavaScript引擎（与 Chrome 浏览器相同的引擎），且 Node.js提供了许多服务器端特性，如文件系统访问、网络通信、进程管理等。

举个代码转换的例子：
```ts
// 使用 ES6 类和箭头函数的TS代码
class Person {
  constructor(public name: string) {}

  greet = () => {
    console.log(`Hello, my name is ${this.name}`);
  }
}

// 使用 TypeScript 类型注解
function sayHello(person: Person): void {
  person.greet();
}

const john = new Person("John");
sayHello(john);

```

编译后的 JavaScript 代码（假设目标是 ES6）可能如下所示：
```js
class Person {
  constructor(name) {
    this.name = name;
    this.greet = () => {
      console.log(`Hello, my name is ${this.name}`);
    };
  }
}

function sayHello(person) {
  person.greet();
}

const john = new Person("John");
sayHello(john);
```

### 二、TS扩展语法
前面提到，TS是JS的超集。TypeScript 还增加了一些 JavaScript 中没有的特性，例如接口、类型注解、枚举、元组等。以下是一些 TypeScript 特性及其具体示例：

**1. 类型注解**
类型注解允许你在变量、函数参数和返回值中指定类型。
```ts
let age: number = 30;
let name: string = "Alice";

function greet(person: string): string {
  return `Hello, ${person}`;
}

console.log(greet(name)); // 输出 "Hello, Alice"
```

**2. 接口**
接口用于定义对象的结构，可以用于类型检查。
```ts
interface Person {
  name: string;
  age: number;
}

let user: Person = {
  name: "Bob",
  age: 25
};

function printPerson(person: Person): void {
  console.log(`${person.name} is ${person.age} years old.`);
}

printPerson(user); // 输出 "Bob is 25 years old."
```

**3. 枚举**
枚举用于定义一组命名常量。这里要注意的是，JS没有枚举，通常是通过对象来模拟枚举的行为。
```ts
enum Color {
  Red,
  Green,
  Blue
}

let c: Color = Color.Green;
console.log(c); // 输出 1 (枚举成员的索引)

// 上述代码如果在JS中只能写成对象形式：
const Color = {
  Red: 0,
  Green: 1,
  Blue: 2
};

let c = Color.Green;
console.log(c); // 输出 1
```

**4. 元组**
元组用于定义一个已知数量和类型的数组。
```ts
let tuple: [string, number];
tuple = ["hello", 10]; // 正确
// tuple = [10, "hello"]; // 错误：类型不匹配

console.log(tuple[0]); // 输出 "hello"
console.log(tuple[1]); // 输出 10
let tuple: [string, number];
```

**5. 泛型**
泛型允许你创建可重用的组件，这些组件可以适用于多种类型。
```ts
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString"); // 明确指定类型
let output2 = identity<number>(42); // 明确指定类型

console.log(output1); // 输出 "myString"
console.log(output2); // 输出 42
```

**6. 类和继承**
TypeScript 增强了对类和继承的支持，使其更接近于面向对象编程语言。
```ts
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance} meters.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof! Woof!");
  }
}

const dog = new Dog("Buddy");
dog.bark(); // 输出 "Woof! Woof!"
dog.move(10); // 输出 "Buddy moved 10 meters."
```

**7. 类型别名**
类型别名用于为类型创建新的名称。
```ts
type StringOrNumber = string | number;

let value: StringOrNumber;
value = "hello"; // 正确
value = 42; // 正确
// value = true; // 错误：类型不匹配

console.log(value);
```

这些示例展示了 TypeScript 增加的一些特性，这些特性使得代码更加类型安全和可维护。

### 三、ECMAScript和ESModules的关系
ESModules（ECMAScript Modules）是 JavaScript 的一种模块系统，它是 ECMAScript 规范的一部分。ESModules 是 ECMAScript 规范中的一个重要特性，用于在 JavaScript 中进行模块化编程。**ESModules 允许你将代码分割成独立的模块，每个模块可以导入和导出其他模块中的功能。这种模块化的方式有助于提高代码的可维护性、可读性和重用性。**具体见“模块化”文档。


到这里，总计一下TS、JS和ECMAScript以及ESModules的关系：
```js
ECMAScript 标准
    |                
    v                
JavaScript (JS) <---- TypeScript (TS)
    |
    v
ES5, ES6, ES7, ...
    |
    v
ESModules
```


### 四、ES6新语法
**1、ES6 引入了类的语法，使得面向对象编程更加直观和易用。此外，ES6 还引入了模块化的语法，可以将代码分割成多个模块，并使用 `import` 和 `export` 关键字进行模块的导入和导出。**
```js
// ES6 代码：
class Person {
  constructor(name) {
    this.name = name;
  }
  sayHello() {
    console.log('Hello, ' + this.name + '!');
  }
}
export default Person;

// 转换成 ES5 代码：
function _classCallCheck(instance, Constructor) { ... }
var Person = function Person(name) {
  _classCallCheck(this, Person);
  this.name = name;
};
Person.prototype.sayHello = function() {
  console.log('Hello, ' + this.name + '!');
};
exports.default = Person;
```

**2、ES6 引入了模板字符串的语法，可以使用反引号（`）来定义多行字符串，并且可以在字符串中插入变量或表达式。**
```js
// ES6 代码：
const name = 'Alice';
const greeting = `Hello, ${name}!`;

// 转换成 ES5 代码：
var name = 'Alice';
var greeting = 'Hello, ' + name + '!';
```

**3、ES6 引入了解构赋值的语法，可以从数组或对象中提取值并赋给变量，使得代码更加简洁和易读。**
```js
// ES6代码：
const { name, age } = person;

// 转换成 ES5 代码：
var name = person.name, age = person.age;
```

**4、ES6 允许在函数定义中为参数提供默认值，简化了函数的调用和定义。**
```js
// ES6 代码：
function greet(name = 'World') {
  console.log('Hello, ' + name + '!');
}

// 转换成 ES5 代码：
function greet(name) {
  if (name === undefined) {
    name = 'World';
  }
  console.log('Hello, ' + name + '!');
}
```

ES6 还引入了许多其他的语法和特性，如箭头函数、模块化、`Promise`、`Set/Map`、`Symbol`、`async/await`(ES6前使用`yield/next`) 和 `undefined`(ES6前使用`void 0`)等。


