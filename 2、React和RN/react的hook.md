### useEffect介绍

在React中，`useCallback` 是一个用于优化性能的钩子，它返回一个记忆（memoized）的回调函数。`useCallback` 接受两个参数：第一个参数是你希望记忆的回调函数，第二个参数是一个依赖项数组。基本用法如下：

```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b], // 依赖项
);
```

在上述代码中，`useCallback` 会返回一个缓存的回调函数，只有当依赖项 `a` 或 `b` 发生变化时，才会生成新的回调函数。


### `useCallback` 的问题

1. **依赖项管理复杂**：当依赖项较多时，管理依赖项列表会变得复杂，容易遗漏或错误添加依赖项。
2. **闭包陷阱**：由于 JavaScript 的闭包特性，回调函数内部可能会捕获旧的状态或属性值，导致意外的行为。
3. **性能开销**：在某些情况下，使用 `useCallback` 并不会显著提升性能，反而会增加代码复杂度和维护成本。

第一点，这里不做介绍；
第二点，针对闭包陷阱问题，比如：   

```javascript
import React, { useState, useCallback } from 'react';

const MyComponent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log(count); // 捕获旧的 count 值
  }, []); // 依赖项为空数组

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={handleClick}>Log Count</button>
    </div>
  );
};

export default MyComponent;
```

在这个例子中，由于 `handleClick` 的依赖项为空数组，它只会在初次渲染时创建一次，因此 `handleClick` 中的 `count` 值始终是初始值 `0`。

第三点，针对性能问题，在某些情况下，使用 `useCallback` 并不会显著提升性能，反而会增加代码复杂度和维护成本。

```javascript
import React, { useState, useCallback } from 'react';

const MyComponent = () => {
  const [count, setCount] = useState(0);

  // 使用 useCallback 缓存函数
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={handleClick}>Log Message</button>
    </div>
  );
};

export default MyComponent;
```

在这个例子中，`handleClick` 函数并不依赖于任何状态或属性，因此它的引用不会改变。即使不使用 `useCallback`，性能也不会受到影响。使用 `useCallback` 反而增加了代码的复杂度和维护成本。

**核心观点：useCallback不应该用来缓存函数用的，函数创建很简单；而应该与memo来避免很重的子组件进行不必要更新的问题。**

### useEventCallback
通过自定义 `useEventCallback`，可以简化依赖项的管理，避免闭包陷阱，并保持代码的简洁性。

```js
export default function Index() {
    const [text, updateText] = useState('Initial value');
    const handleSubmit = useEventCallback(() => {
        console.log(`Text: ${text}`);
    });
    return (
        <>
            <input value={text} onChange={(e) => updateText(e.target.value)} />
            <ExpensiveTree onClick={handleSubmit} />
        </>
    )
}
function useEventCallback(fn, dependencies) {
    const ref = useRef(null);
    useEffect(() => {
        ref.current = fn;
    }, [fn, ...dependencies])
    return useCallback(() => {
        ref.current && ref.current(); // 通过ref.current访问最新的回调函数
    }, [ref])
}
```
上述代码存在优化空间。在 `useEventCallback` 中，`useCallback` 的依赖项应该是空数组 `[]`，而不是 `[ref]`。因为 `ref` 对象本身是稳定的，不需要作为依赖项。优化后代码如下：
```js
import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function Index() {
    const [text, updateText] = useState('Initial value');
    const handleSubmit = useEventCallback(() => {
        console.log(`Text: ${text}`);
    });
    return (
        <>
            <input value={text} onChange={(e) => updateText(e.target.value)} />
            <ExpensiveTree onClick={handleSubmit} />
        </>
    );
}

function useEventCallback(fn, dependencies) {
    const ref = useRef(fn);

    useEffect(() => {
        ref.current = fn;
    });

    return useCallback(() => {
        if (ref.current) {
            ref.current();
        }
    }, []);
}
```

这段代码大家可能会有疑问。。。
1. 这里useEventCallback方法在组件Index外部，并使用了ref，这是什么用法？  

在 React 中，`useRef` 和其他 React Hooks（如 `useEffect`、`useCallback` 等）可以在自定义 Hook 中使用，而不一定要在组件内部。自定义 Hook 是一种封装逻辑的方式，可以在多个组件中复用逻辑。自定义 Hook 的名字以 `use` 开头，这是遵循 React Hooks 的规则，这样就不会有estlint报错，同时提示代码可读性。**值得注意的是，自定义hook本身就是一个普通的函数。在组件中调用自定义hook就相当于把函数的逻辑放到代码中是一样的。** 

2. 这里的ref生命周期是什么？跟着自定义的hook方法一起销毁，那不就会出问题？   

首先，React 中的 Hook 本身并没有独立的生命周期，它们是与组件的生命周期紧密关联的。当一个组件被创建、更新或销毁时，Hook 会随之执行相应的操作。在 React 中，自定义 Hook 中的 `useRef` 与调用该 Hook 的组件的生命周期绑定。当你在一个组件中调用自定义 Hook 时，该 Hook 内部的所有状态和副作用（包括 `useRef` 创建的 `ref` 对象）都与调用它的组件实例绑定。每次组件重新渲染时，自定义 Hook 会重新执行，但 `useRef` 创建的 `ref` 对象在整个组件生命周期内保持不变。

### useEffect防止重复触发
（详见官网：https://react.docschina.org/reference/react/useCallback）
有时，你想要在 Effect 内部调用函数：
```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
  })
}
```
这会产生一个问题，每一个响应值都必须声明为 Effect 的依赖。但是如果将 createOptions 声明为依赖，它会导致 Effect 不断重新连接到聊天室：
```jsx
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 问题：这个依赖在每一次渲染中都会发生改变
  // ...
```
为了解决这个问题，需要在 Effect 中将要调用的函数包裹在 useCallback 中：
```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ 仅当 roomId 更改时更改

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ 仅当 createOptions 更改时更改
  // ...
}
```
这将确保如果 roomId 相同，createOptions 在多次渲染中会是同一个函数。但是，最好消除对函数依赖项的需求。将你的函数移入 Effect 内部：
```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ 无需使用回调或函数依赖！
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 仅当 roomId 更改时更改
  // ...
}
```

你可能疑惑，为什么eslint设置函数也需要加到依赖项中？因为在 JavaScript 中，函数也是值（一等公民）。如果 getHotelNearbyInfo 是在组件内部定义的，每次组件渲染时都会创建一个新的函数实例。**如果函数依赖组件内的状态或属性，可能会产生闭包问题**。

### 优化自定义 Hook

**如果你正在编写一个 自定义 Hook，建议将它返回的任何函数包裹在 useCallback 中**：
```jsx
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```
**这确保了 Hook 的使用者在需要时能够优化自己的代码**。

### useCallback & useMemo
1. useMemo是缓存结果，所以使用useMemo的函数必须要有返回值，否则没有意义；
2. useCallback是缓存函数实例。


### 参考文献：
1. [官方指南](https://zh-hans.react.dev/reference/react/useCallback#every-time-my-component-renders-usecallback-returns-a-different-function)

2. [自定义函数缓存的hook](https://github.com/yaofly2012/note/issues/144)

3. [useCallback问题](https://juejin.cn/post/7019989729148059656)
