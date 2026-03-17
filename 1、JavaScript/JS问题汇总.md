## 1、问题：JavaScript的Array有哪些方法不会修改原数组？
## 回答：
在 JavaScript 中，数组方法可以按“是否修改原数组”分两类。下面把**是否修改**与**返回值**写清楚：

### 修改原数组（mutating）
1. `push(...items)`：末尾添加元素；**返回值**：新长度（number）
2. `pop()`：移除末尾元素；**返回值**：被移除的元素（或空数组时为 `undefined`）
3. `shift()`：移除开头元素；**返回值**：被移除的元素（或空数组时为 `undefined`）
4. `unshift(...items)`：开头添加元素；**返回值**：新长度（number）
5. `splice(start, deleteCount?, ...items)`：删除/插入；**返回值**：由“被删除元素”组成的新数组（Array）
6. `sort(compareFn?)`：原地排序；**返回值**：排序后的**原数组引用**（Array，即返回 `this`）
7. `reverse()`：原地反转；**返回值**：反转后的**原数组引用**（Array，即返回 `this`）
8. `fill(value, start?, end?)`：原地填充；**返回值**：填充后的**原数组引用**（Array，即返回 `this`）
9. `copyWithin(target, start?, end?)`：原地复制覆盖；**返回值**：修改后的**原数组引用**（Array，即返回 `this`）

### 不修改原数组（non-mutating）
1. `concat(...items)`：合并；**返回值**：新数组（Array）
2. `slice(start?, end?)`：截取；**返回值**：新数组（Array）
3. `map(fn, thisArg?)`：映射；**返回值**：新数组（Array）
4. `filter(fn, thisArg?)`：过滤；**返回值**：新数组（Array）
5. `flat(depth?)`：拍平；**返回值**：新数组（Array）
6. `flatMap(fn, thisArg?)`：map 后拍平一层；**返回值**：新数组（Array）
7. `reduce(fn, initialValue?)`：归约；**返回值**：累计结果（任意类型）
8. `reduceRight(fn, initialValue?)`：从右归约；**返回值**：累计结果（任意类型）
9. `join(separator?)`：拼接为字符串；**返回值**：string
10. `includes(searchElement, fromIndex?)`：是否包含；**返回值**：boolean
11. `indexOf(searchElement, fromIndex?)`：首次索引；**返回值**：number（找不到为 -1）
12. `lastIndexOf(searchElement, fromIndex?)`：末次索引；**返回值**：number（找不到为 -1）
13. `find(fn, thisArg?)`：找元素；**返回值**：匹配的第一个元素（找不到为 `undefined`）
14. `findIndex(fn, thisArg?)`：找索引；**返回值**：number（找不到为 -1）
15. `every(fn, thisArg?)`：是否全满足；**返回值**：boolean
16. `some(fn, thisArg?)`：是否至少一个满足；**返回值**：boolean
17. `forEach(fn, thisArg?)`：遍历执行副作用；**返回值**：`undefined`

总的来说，修改原数组的多是“增删改/排序/反转”类操作。值得注意的是 `sort()` 会修改原数组；而较新的 `toSorted()`（以及 `toReversed()`、`toSpliced()`）会返回新数组，不改原数组。需要注意的是，map/filter等上面说的不会修改原数组”的含义是：它们自己不会主动改数组结构（不做 push/splice/sort 之类）。
但你在回调里手动修改原数组（回调里会有原array作为参数），任何方法都拦不住，都会改到原数组。

## 2、map和forEach比较
## 回答：
先区分两个概念：
- 方法本身是否“修改原数组”（`map/filter` 本身不会改；`forEach` 也不会主动改，只是它的典型用途是做副作用）
- 你在回调里是否“手动修改原数组/元素”（这会影响原数组，和用哪个方法无关）

1、**map 有返回值**：会生成一个新数组，长度与原数组一致（稀疏数组的空位也会保留空位）。`map` 本身不会修改原数组；但如果你在回调里通过 `array` 或元素引用去改原数组，那原数组仍然会被改。
```js
const newArray = originArray.map((element, index, array) => {
  // 这里的 array 是原数组（同一个引用）
  return newElement;
});
```

类似的，许多数组方法接受一个回调函数作为参数。回调函数按顺序为数组中的每个元素调用，且最多调用一次，并且回调函数的返回值用于确定方法的返回值。它们都具有相同的方法签名：
```js
method(callbackFn, thisArg)
```
callbackFn方法的参数如下：element, index, array。还有，thisArg很少用到，下面会解释。比如，以filter为例，下面代码：
```js
// 修改每个单词
let words = ["spray", "limit", "exuberant", "destruction", "elite", "present"];

const modifiedWords = words.filter((word, index, arr) => {
  arr[index + 1] += " extra";
  return word.length < 6;
});

console.log(modifiedWords);
console.log(words);
// 注意，在长度为 6 以下有三个单词，但是由于它们已经被修改，所以返回一个单词
// ["spray"]
// ['spray', 'limit extra', 'exuberant extra', 'destruction extra', 'elite extra', 'present extra', 'undefined extra']
```
注意：`filter` 本身不会修改原数组，但上面回调里手动修改了 `arr`，所以**原数组会被改变**。这属于“回调副作用”，不是 `filter` 的特性。

2、**forEach是没有返回值的**，所以就是单纯的用来执行副操作的，比如:
```js
const numbers = [1,2,3];
numbers.forEach(num => {
    console.log(num*2);
})
```
这里需要注意：`forEach` 的回调同样能拿到 `array`（原数组引用）。如果你在回调里修改它，原数组当然会被修改，但一般不建议把“遍历”和“结构性修改（push/splice 等）”混在一起。
```js
// 修改元素
const arr = [1,2,3];
arr.forEach((value, index, array) => {
  array[index] = value * 2;
});
console.log(arr); // [2,4,6]

// 新增元素
arr.forEach((value, index, array) => {
  array.push(value + 3);
});
console.log(arr); // [2, 4, 6, 5, 7, 9]
// 注意：forEach 遍历的 length 通常在开始时就确定了；push 不会“死循环”，但会让逻辑非常混乱（不建议）

// 删除元素
arr.forEach((value, index, array) => {
  if (value === 2) {
    delete array[index]; // delete 会制造“空洞(hole)”，不会改变 length
  }
});
console.log(arr); // [1, empty, 3]（控制台一般会显示 empty slot；读取该位置值为 undefined）
```

## 3、method(callbackFn, thisArg)的thisArg
## 回答：
thisArg 是用来指定回调函数的 this。如果没有 thisArg，回调函数中 this 在严格模式下为 `undefined`，非严格模式下可能指向全局对象。举个例子。
1、不指定thisArg的情况(默认，this的值由上下文决定)
```js
const arr = [1,2,3];
arr.map(function (element) {
  console.log(this); // 严格模式下为 undefined；非严格模式下为 window/global
  return element * 2;
});
```

2、使用thisArg
通过thisArg传递一个对象，供回调函数使用
```js
const multiplier = {
    value: 2,
};

const arr = [1,2,3];
const result = arr.map(function (element) {
    return element * this.value; // 使用this.value
}, multiplier); // multiplier作为thisArg
```

3、箭头函数
需要注意的是，箭头函数是词法绑定的：它的 `this` 继承自定义时的外层作用域，而不是像普通函数那样由调用方式动态绑定。因此，`map/filter/forEach` 等方法传入的 `thisArg` **对箭头函数无效**（this 绑定不会被改变）。
```js
const multiplier = {
  value: 2,
};

const arr = [1, 2, 3];

// 普通函数：thisArg 生效
const result1 = arr.map(function (element) {
  return element * this.value;
}, multiplier);
console.log(result1); // [2, 4, 6]

// 箭头函数：thisArg 无效（this 来自外层作用域）
const result2 = arr.map((element) => element * this.value, multiplier);
// 在模块/严格模式下外层 this 通常是 undefined，这里可能会报错；
// 在某些非严格脚本环境下外层 this 可能是全局对象，这里可能得到 [NaN, NaN, NaN]。
console.log(result2);
```

## 4、Array和Set比较
## 回答：
1、Set是集合，没有重复值，是无序的。它提供了快速的元素查找和去重的功能。创建Set的方式如下：
```ts
const mySet = new Set([1,2,2,3]);
console.log(mySet); // Set {1,2,3}
```
常用方法如下：
1. add(value): 添加元素；
2. delete(value): 删除指定元素；
3. has(value): 查找元素是否存在；
4. clear(): 清空元素；
5. size: 返回集合大小

Set是一种**可迭代对象**，可以使用forEach和for...of的方式进行遍历。

2、Array是存储**有序数组**的集合，可包含重复值，功能更加全面。创建方式如下：
```js
const myArray = [1,2,3];
const youArray = new Array(5);// 创建一个长度为5的数组
```
常用方法上面如问题1所示。数组也是一个可迭代对象，可以使用for循环、map、for...of以及forEach遍历。

## 5、Set和Array的相互转换
1、Set转Array
（1）使用扩展运算符
```js
// Set转Array,常用扩展运算符的方式
const mySet = Set([1,2,3]);
const myArray = [...mySet];
```
（2）使用Array.from
Array.from是专门用于将类数组对象或者可迭代对象(如Set)转为数组的工具，比如：
```js
const mySet = new Set([1,2,3]);
const myArray = Array.from(mySet);
```
（3）使用 forEach或者for...of进行遍历，并逐步添加到数组中，比如：
```js
const mySet = new Set([1,2,3]);
const myArray = [];
mySet.forEach(value => {
    myArray.push(value);
});
```

2、Array转Set
```js
// Array转Set，可直接使用Set创建的方式
const myArray = [1,2,3];
const mySet = new Set(myArray);
```

## 6、JS可迭代对象有哪些？
## 回答：
在ES6中，可迭代对象是实现了Symbol.iterator接口的对象。这类对象可以使用for...of循环以及扩展运算符(...)等场景。以下是常见的可迭代对象：
1、内置可迭代对象
1. Array;
2. Set;
3. Map等

2、自定义可迭代对象
通过Symbol.iterator方法，可以定义可迭代对象。如下：
```js
const iterable = {
    [Symbol.iterator]() {
        let count = 0;
        return {
            next() {
                if (count < 3) {
                    return { value: count ++, done: false};
                }
                return {value: underfined, done: true};
            },
        };
    },
}

for (const value of iterable) {
    console.log(value); // 输出 0，1，2
}
```

## 7、Symbol
## 回答：
首先，Symbol是JS中的一种**原始数据类型**，在ES6中引入。主要作用是创建一个**独一无二的值**，用于避免对象属性名的冲突。Symbol的特点如下：
1. 唯一性；
2. 不可变性：Symbol是只读的；
3. 非字符串键：Symbol可以作为对象的属性键，与字符串键不同，不会出现属性名冲突。
用法如下：
1、基本用法
```js
const sym1 = Symbol();
const sym2 = Symbol('x'); // x仅仅是用于识别Symbol的，不影响唯一性
const sym3 = Symbol('x'); // sym3 !== sym2
```
2、作为对象属性键
```js
const symKey = Symbol('uniqueKey');
const obj = {
    [symKey]: 'hiddenValue',
    normalKey: 'visibleValue',
};
console.log(obj[symKey]); // 输出 hiddenValue
console.log(Object.keys(obj)); // 输出 visibleValue
```
值得注意的是，Symbol作为键的属性，不会出现在普通的对象迭代中(如for...in、Object.keys())，从而提供了一定的“保护”。

3、Symbol的全局注册表
Symbol提供了一个全局注册表，可以通过Symbol.for和Symbol.keyFor方法访问。比如：
```js
const sym1 = Symbol.for('globalKey');
const sym2 = Symbol.for('globalKey');
console.log(sym1 === sym2); // 输出 true，来自一个全局注册表
const key = Symbol.keyFor(sym1);
console.log(key); // 输出 globalKey
```

4、Symbol提供了iterator等内置方法，用于定义对象的特定行为。

## 8、Symbol.iterator怎么用？
## 回答：
Symbol.iterator是Symbol内置的用于为自定义对象，定义一个可迭代器：
```js
const iterableObj = {
    data: [1,2,3],
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                return index < this.data.length ? { value: this.data[index + 1], done: false} : { done: true}
            },
        };
    },
};

for (const value of iterableObj) {
    console.log(value); // 输出 1，2，3
}
```
**Symbol.iterator**提供可迭代器，规范如下：
1、要实现[Symbol.iterator]方法，该方法返回一个**迭代器对象**；
2、**迭代器对象**本身必须实现**迭代器协议**，即拥有next()方法，该方法每次调用都会返回一个具有以下结构的对象：
```
{
    value: <any>, // 当前迭代的值
    done: <boolean> // 布尔值，表示是否迭代完成
}
```

## 9、this
## 回答：
`this`是JS中一个关键字，表示当前执行上下文的**引用对象**。它的值在不同的调用场景中有所不同，取决于**函数的调用方式**。  

1、全局作用域
在全局作用域(非严格模式)下，this指的是全局对象，浏览器指向window、Node.js指向global。严格模式下(函数开头添加"use strict")，this为underfined，需要明确指定this才能用。这里不针对严格模式进行详细说明了。

2、方法调用
当函数作为**对象的方法**调用时，`this`指向**调用该方法的对象**。
```js
const obj = {
    name: 'alice',
    greet: () => {
        console.log(this.name);
    }
}
obj.greet(); // alice
```
这里不够形象，下面例子创建两个对象实例：

3、构造函数调用
当使用`new`调用构造函数时，`this`指向新创建的对象。
示例1：
```js
function Person(name) {
    this.name = name;
}

const person = new Person('Alice'); // this指向对象实例person
console.log(person.name); // Alice
```
示例2：
```js
class Person {
    constructor(name) {
        this.name = name;
    }
    greet() {
        console.log(this.name);
    }
}

const alice = new Persion('alice');
const bob = new Persion('bob');
alice.greet(); // alice
bob.greet(); // bob
```

4、箭头函数
箭头函数中`this`是**词法绑定**的，它取决于定义箭头函数时的上下文，而不是调用方式。
```js
const obj = {
    name: 'alice',
    greet: () => {
        console.log(this.name);
    }
}
obj.greet(); // 输出underfined，因为箭头函数的this是当时所在作用域的this，是global或者window
```

5、显式绑定
使用`call、apply或者bind`显式指定`this`。这里不细说这三种绑定方法了。
```js
function greet() {
    console.log(this.name);
}

const person = {name: 'alice'};
greet.call(person); // 输出 alice
greet.apply(person); // 输出 alice
const boundGreet = greet.bind(person);
boundGreet(); // 输出 alice
```

6、对象原型中的方法
如果对象继承了另一个对象的方法，`this`指向**最终调用该方法的对象**。
```js
const parent = {
    greet() {
        console.log(this.name);
    }
}

const child = Object.create(parent);
child.name = 'alice';
child.greet(); // alice
```

## 10、在静态方法中，this 指向类本身？
## 回答：
其实很容易理解，静态方法的调用方是类本身（js中类也是对象），`this`自然指向调用该方法的对象。
```ts
export class PageManager {
    private static pageInstance: Page<IBasePageProps>;
    private static urlQuery = {
        orderId: 0,
    };

    static init(pageInstance: Page<IBasePageProps>) {
        this.pageInstance = pageInstance; // 保存实例
        this.initUrlQuery(this.pageInstance.getQuery()); // 假设从实例中提取查询参数
    }

    private static initUrlQuery(urlQuery: { [key: string]: string }) {
        const { orderId } = urlQuery || {};
        this.urlQuery = {
            orderId: Number(orderId) || 0,
        };
    }

    static getUrlQuery() {
        return this.urlQuery;
    }
}

const pageInstance = new Page<IBasePageProps>();
PageManager.init(pageInstance);
```

## 11、react类组件中的this
## 回答：
# (1) JavaScript的this指向
第一，首先，我们介绍一下JS中的this。我们知道，JS普通函数里的this由调用放决定。箭头函数里的this则会继承外层的this特性。其次，JS的事件处理函数内部的this会默认绑定到DOM元素（注意，是DOM元素，不是类实例）。

# (2) React的this指向
React本身就是一个JS库，遵守JS的this机制。在React类组件中，我们会在render中使用this、在函数中使用this、在constructor中使用this，这些this都指向哪里呢？如下所示：
```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    // this.handleClick = this.handleClick.bind(this); // 绑定 this
  }

  handleClick() {
    console.log(this);
  }

  render() {
    return <button onClick={this.handleClick}>点击</button>;
  }
}
```
**一，首先，在react类组件中，构造函数中的this是绑定到组件实例上的，在react使用new调用类的构造函数时创建组件实例时绑定；**
**二，其次，render方法是组件实例调用的，所以render中的this也指向组件实例。react所有生命周期方法（如componentDidMount、render）均由react主动调用，并明确其上下文为组件实例。**
```js
// React 内部伪代码
class Component {
  // 生命周期方法调用
  componentDidMount() {
    this.instance.componentDidMount(); // 通过实例调用
  }

  // render 方法调用
  render() {
    return this.instance.render(); // 通过实例调用
  }
}
```
**第三，react使用合成事件，事件处理函数不自动绑定this，也不会默认绑定到react元素上。不自动绑定this保留了灵活性，由开发者根据需要选择绑定对象。**。
该类组件从渲染到调用handleClick方法，react底层大致做了如下步骤(模拟行为)：
```js
// 1. 构造函数
const comp = new MyComponent(); // 创建类组建实例(此时，构造函数的this指向组件实例)

// 2. 渲染
comp.render(); // 渲染过程，render()是类组件的一个实例方法，所以调用者其实就是组件实例本身，所以onClick={this.handleClick}这里的this指向组件实例

// 3. 调用
const callback = this.handleClick; // this.handleClick 是从实例中提取的原型方法，handleClick里的this没有了指向
button.addEventListener('click', callback); // 直接传递函数引用
// 普通函数调用方式，而非方法调用。函数调用时没有上下文，导致严格模式下为underfined，非严格模式下指向window。
```

我们举个例子，观察验证一下：
```jsx
import React, { Component } from 'react';

class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { count: 0};
        // 注意，bind是绑定this，call/apply会直接执行方法
        this.handleClick = this.handleClick.bind(this); // 手动绑定`this`
    }

    // bind绑定this
    handleClick() {
        this.setState({ count: this.state.count + 1});
    }

    // 箭头函数
    handleClick2 = () => {
        this.setState({ count: this.state.count + 2});
    }

    // 普通函数，未绑定this
    handleClick3() {
        this.setState({ count: this.state.count + 3});
    }

    render() {
        return (
            <div>
                <p>Count: {this.state.count}</p>
                <button id = 'button1' onClick={() => this.handleClick()}>Increment</button>
                <button id = 'button2' onClick={this.handleClick2}>Increment2</button>
                <button id = 'button3' onClick={this.handleClick3}>Increment3</button>
            </div>
        );
    }
}
```
在React类组件中，组件可以通过`<>`的方式创建。本质上，与上面说的类对象通过`new`的方式创建一样。其次，`button1`和`button2`其实都是箭头函数调用方式，但是不一样。下面具体说明：
1、`() => this.handleClick()`箭头函数定义在`render`中，会继承`render`的`this`(**`render`的`this`是直接绑定到类组件实例上的**)。所以箭头函数内使用的`this`就是该组件实例。箭头函数`() => this.handleClick()`内是直接调用了`this.handleClick`，由于这里的`this`指向的就是实例。所以，`handleClick`绑定了调用方，也就是该组件实例。普通方法`handleClick`内部`this.setState`的`this`就是该组件实例了。路线如下：
```
1. () => this.handleClick() 箭头函数，定义时就绑定到render中的this了，即绑定了组件实例(该箭头函数每次render都会重新创建)
      ⬇️
2. this.handleClick()，因为调用方this就是组件实例，所以点击事件执行this.handleClick()时，handleClick动态绑定了调用方，即组件实例
      ⬇️
3. this.setState({ count: this.state.count + 1});，因为handleClick绑定了组件实例，所以内部的this.setState的this就是组件实例
```

2、`handleClick2`箭头函数是定义在类的属性中的，它会**继承**定义时的外部作用域`this`。这里解释一点，类有两种方法，一种是静态方法，定义在类本身上，`this`指向类本身，与实例无关；另一种是实例方法。箭头属性方法的`this`永远指向类组件实例。在类定义阶段，JavaScript引擎就已经知道箭头函数会在类实例化时的this，它通过词法作用域来进行绑定。路线如下：
```
1. handleClick2，因为是类组件的箭头函数属性，所以会自动绑定到该类组件的实例上，所以handleClick2不用额外绑定，已经指向了组件实例。那为什么还要使用this.handleClick呢？因为React类组件内定义的方法都要使用this调用，与handleClick2内部的this与使用this.handleClick2调用无关。
```

总结一下，类组件的几种`this`：
1. `render`中`this`，是绑定到类组件实例中的，所以`render`中可以直接通过`this`访问对象的属性、方法等。如果我`handleClick`直接放到`render`里面，则可以直接绑定到render的`this`，比如：
```jsx
<button onClick={() => {
    console.log(this);
    this.setState({count: this.state.count + 1})
}}>
    InCrement
</button>
```
2. 构造函数`constructor`中的`this`，同样是指向创建的类实例。
3. 组件的非箭头方法中的`this`，如果不主动绑定的话，则表示全局对象或者，并不会指向组件实例本身。
4. 组件箭头方法的`this`，绑定的也是组件实例。

## 12、对象字面量的this
## 回答：
大家可能会疑惑，为什么不像之前的这段代码，这里的`this`绑定的是全局作用域。
```js
const obj = {
    name: 'alice',
    greet: () => {
        console.log(this.name);
    }
}
obj.greet(); // 输出underfined，因为箭头函数的this是当时所在作用域的this，是global或者window
```
原因是**作用域**。类本身会创建一个作用域，方法中的`this`默认绑定到类实例，而对象字面量(Object literals)没有自己的作用域，`this`就绑定到全局对象了。

## 13、组件回调方法，如何选择箭头函数和普通函数？
## 回答：
第一，普通函数需要手动绑定`this`，箭头函数会自动绑定当前实例的`this`。
```jsx
class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {count: 0};
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState({count: this.state.count + 1});
    }

    handleClick2 = () => {
        this.setState({count: this.state.count + 1});
    }
    
    render() {
        return (
            <button onClick={this.handleClick}>click</button>
        )
    }
}
```

第二，函数组件中的选择（箭头函数 vs 普通函数）
1、语义差异（JS 层面）  
（1）this：函数组件没有组件实例的 this，二者在 this 上没有实际区别；  
（2）arguments：普通函数有 arguments；箭头函数没有，需要用`...args`；  
（3）提升：函数声明会提升；`const fn = () => {}`不会提升；  
（4）构造/原型：普通函数有 prototype、可 new（在函数组件里基本不用）；箭头函数没有。

2、什么时候用箭头函数  
（1）作为“回调/事件处理器”且需要稳定引用时，常配合`useCallback`：  
```jsx
const handleClick = useCallback(() => setCount(c => c + 1), []);
```
理由：团队常规写法统一、不可被提前调用（避免提升）、与`useCallback`搭配自然。  
（2）不依赖`arguments`、不需要 hoisting 的普通工具函数，也可用箭头函数提升一致性。

3、什么时候用普通函数（函数声明）  
（1）需要 hoisting（在同一渲染中先使用再定义）的场景：  
```jsx
handleA(); // 可先调用
function handleA() {}
```
（2）需要`arguments`且不想改成`...args`。  
（3）偏好具名函数声明提高可读性/调试堆栈时（个人或团队风格）。

4、避免不必要的重渲染  
无论箭头/普通函数，函数组件每次渲染都会创建新函数；若将回调传给`React.memo`的子组件或放入其他 hook 依赖中，应使用`useCallback`稳定引用：  
```jsx
const onSelect = useCallback(function onSelect(id) {
  setSelectedId(prev => (prev === id ? null : id));
}, []);
```

5、实用建议（落地规则）  
（1）对外传递/被依赖的回调：使用`useCallback`；函数写法随团队约定（箭头或普通都行）；  
（2）仅在当前组件内部使用的纯工具函数：随意；若性能敏感可提到组件外定义以避免每次重建；  
（3）若需要 hoisting 或想保留`arguments`：用普通函数声明；  
（4）其他情况按团队风格选择，保持一致性即可。  
性能层面二者没有本质差异，关键在于“引用是否稳定”而非“箭头或普通”。

## 14、如何通过异步的方式，让代码运行过程中，去执行其他内容，然后完成后才回到当前代码继续执行？
## 回答：
使用`await`等待，这样只有执行`resolve`后，`await`才结束。将`resolve/reject`传递到这期间要执行的代码处。代码执行完毕后，执行`resolve`，完成异步等待，这样就可以继续后面的步骤了。
```ts
export class NameCheck {
    static passed = false;
    static async nameCheckPromise() {
        return new Promise(resolve => {
            // 已通过姓名鉴权不弹窗
            if (this.passed) {
                resolve(true);
            } else {
                DeviceEventEmitter.emit('showNameCheckModal', resolve);
            }
        });
    }
    static async validPermission(permission?: string | null): Promise<boolean> {
        if (permission === 'read') {
            const result = await NameCheck.nameCheckPromise();
            if (!result) {
                return false;
            }
        }
        return true;
    }
}
```

```ts
// 执行拦截,执行完鉴权后，继续执行下面代码
const onPressActionButton = async (button, permission) => {
    if (!(await NameCheck.validPermission(permission))) {
        return;
    }
    switch(button.action) {
        case '':
            console.log('button');
            break;
        default:
            break;
    }
};
```