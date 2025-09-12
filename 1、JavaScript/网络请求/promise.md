Promise不是网络请求，放在这里是因为网络请求往往是异步的，特别是原生fetch方法会与promise紧密联系。Promise本身不是异步，而是解决异步的构造函数，new Promise创建Promise对象。(文档：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

## 一、Promise介绍

Promise只有一个参数那就是excutor执行器 (resolve, reject) => {}，excutor是同步执行的，而Promise的实例方法`promise.prototype.then`、`promise.prototype.catch`和`promise.prototype.finally`都是异步的，而且这三者都会立即**返回一个新的Promise对象**，可让你可以使用链式继续调用其他Promise方法。所以，我们经常看到的是.then、.catch和.finally采用链式调用，而不是一个一个单独调用。
```js
const promise = new Promise((resolve, reject) => {
    console.log('1'); // 同步代码
    resolve('success');
    // reject('error');
})
```

Promise对象的.then方法接收两个函数，如下:
```js
promise.then((res) => {
    // 第一个函数是resolve执行后调用的，函数参数是reject(res)提供的，
    console.log(res)
}, (error) => {
    // 第二个函数是reject执行后调用的，函数参数是reject(error)提供的
    console.log(error)
})
```
Promise对象的.finally方法接收一个函数，且该函数不带任何参数。如下:
```js
promise.finally(() => {
    // excutor无论执行了resolve或者reject，都会调用finally
    console.log('finally')
})
```
采用链式调用的方式，和分开调用的结果是一样的。通常我们喜欢将.finally放在链式最后调用，如下：
```js
promise.catch((err) => {
    console.log(err)
}).then((res) => {
    // 第一个函数是resolve执行后调用的，函数参数是reject(res)提供的，
    console.log(res)
}, (error) => {
    // 第二个函数是reject执行后调用的，函数参数是reject(error)提供的
    console.log(error)
}).finally(() => {
    // excutor无论执行了resolve或者reject，都会调用finally
    console.log('finally')
})
```

## 二、Promise链式调用
接下来，我们看这个例子：
```js
getData() {
    return new Promise((resolve, reject) => {
        fetch('http://nihao.com')
        .then(res => {resolve(res)})
        .catch(err => reject(err))
    })
}
```
前面提到，fetch会返回一个Promise对象，然后.then处理resolve,.catch处理reject，他们都会返回一个Promise对象，所以上面代码其实不需要额外创建新的Promise对象返回，可以如下所示：
```js
getData() {
  return fetch('http://nihao.com')
    .then(res => res) // .then会返回一个fulfilled状态的Promise对象，值传入res
    .catch(err => {
      throw err // .catch处理reject。注意，.catch默认返回的是fulfiled状态。这里不能return err，return err则是返回一个fulfilled状态的Promise对象了
    })
}
```
你可能疑惑，.then默认返回fulfilled状态可以理解，为什么.catch也是？Promise 设计者认为：错误处理应该能完全恢复程序状态，如下：
```js
getUserData()
  .catch(err => {
    // 尝试从缓存恢复
    return cachedUserData; // ✅ 返回备用值
  })
  .then(renderUser) // 无论原始成功或恢复成功都执行
```

.finally还有一个特别的地方，默认返回原始状态，如下所示：
```js
const promise = new Promise((resolve, reject) => {
    console.log('1'); // 同步代码
    resolve('success');
    // reject('error');
})
promise.then((res) => {
    console.log(res)
    return res
}, (error) => {
    console.log(error)
    throw error
}).catch((err) => {
    console.log('catch')
}).finally(() => {
    // excutor无论执行了resolve或者reject，都会调用finally
    console.log('finally')
}).then((data) => {
    console.log(data)
})
```
1. resolve('success'): .then返回一个状态fulfilled、值为success的Promise对象 ==》.catch直接跳过 ==》.finally执行，由于没有return也没有抛异常，所以返回上个原始状态success，结果如下：
`1 success finally success`

2. reject('error'): .then执行(error) => {console.log(error)}，由于抛了异常，所以返回的是一个状态rejected、值为error的Promise对象 ==> .catch执行，返回一个状态fulfilled、值undefined的Promise对象 ==> .finally执行，由于没有return也没有抛异常，所以返回上个原始状态error，结果如下：
`1 error catch finally undefined`

## 三、await
`await` 是 JavaScript 中用于处理 Promise 的关键字，它只能在 `async` 函数内部使用。`await` 会暂停 `async` 函数的执行，等待 Promise 的状态变为 resolved（fulfilled）或 rejected，然后恢复函数的执行。当 Promise 被 resolve 时，`await` 会返回 resolve 的值；当 Promise 被 reject 时，`await` 会抛出 reject 的值（通常是一个错误）。
```javascript
async function example() {
  try {
    const result = await somePromise; // 等待 Promise 完成
    console.log(result); // 输出 Promise resolve 的值
  } catch (error) {
    console.error(error); // 处理 Promise reject 的值
  }
}
```

所以，await相当于是Promise链式调用的替代方案：
```js
// Promise链
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// 使用await的等效写法
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

总的来说，Promise 和 async/await 不是异步处理的必要条件(没有他们也能处理异步方法)，而是工程优化的必然选择。他们标准化异步流程，大大降低了异步方法的处理难度和可读性。