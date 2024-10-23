提到语言的运行机制，往往离不开 CPU 、线程、异步等概念。这里我们抛开“进程”不谈。CPU 使用“时间片轮转调度算法”来实现同时运行多个进程，而且进程之间也是独立的。所以对于一个进程来说，只需要关注 CPU 对该进程内部的运行过程，其他进程无非就是分走了该进程的一部分 CPU 运行时间，不会影响该进程的整体运行机制。  

我们知道，CPU 有轮询机制，会轮流运行多个线程，但是 JavaScript 是单线程语言，所以 JavaScript 代码的运行机制与 CPU 轮询机制无关，它是通过自身的事件循环来管理异步操作，协调调用栈、宏任务队列和微任务队列，来确保任务按照正确的顺序执行。

1、宏任务&微任务队列


1、javaScript 代码块

2、事件循环和代码块

3、异步机制

4、nodejs原理和javascript运行机制的关联性和区别

5、react框架和javascript运行机制的关系：
我的理解：react更多的是状态管理，程序本身还是完全依赖javascript运行机制。

1. 同步代码：同步代码按顺序执行，从上到下，一行接一行。
2. 微任务队列：同步代码执行完毕后，事件循环会检查并执行微任务队列中的任务。
3. 宏任务队列：微任务队列处理完毕后，事件循环会检查并执行宏任务队列中的任务。

```js
console.log('Start');

process.nextTick(() => {
  console.log('Next Tick');
});

setTimeout(() => {
  console.log('Timeout 0');
}, 0);

console.log('End');
console.log('Start');

process.nextTick(() => {
  console.log('Next Tick');
});

setTimeout(() => {
  console.log('Timeout 0');
}, 0);

console.log('End');
```
同步代码：

console.log('Start')：立即执行，输出Start。
process.nextTick()：将回调函数添加到微任务队列。
setTimeout()：将回调函数添加到宏任务队列。
console.log('End')：立即执行，输出End。
微任务队列：

执行process.nextTick()的回调，输出Next Tick。
宏任务队列：

执行setTimeout()的回调，输出Timeout 0。
输出结果
```
Start
End
Next Tick
Timeout 0
```

