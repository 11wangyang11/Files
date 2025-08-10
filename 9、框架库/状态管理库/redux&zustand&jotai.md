核心问题： 在 React 应用中，如何跨组件（尤其是非父子关系的组件）高效、可预测地共享和管理状态？
首先，react提供的context是可以的，但是context存在一个问题，useContext是订阅整个state对象，只要 Provider 的 value 变化（新对象），所有 useContext 的子组件都会重新渲染。为了更加精准地更新组件，可以使用第三方的状态管理工具。
```js
function ChildA() {
  const { count } = useContext(MyContext); // 订阅整个state对象，并不是只有count改变才会引起ChildA的更新
  return <div>{count}</div>;
}
```

## 1、Redux (经典/主流)：
核心理念：
1. 单一数据源 (Store)： 整个应用的状态存储在一个 JavaScript 对象树中。
2. 状态是只读的： 唯一改变状态的方法是触发一个 Action（描述发生了什么事件的普通对象）。
3. 使用纯函数 (Reducer) 执行修改： 编写 Reducer 函数接收当前 State 和 Action，返回新的 State（不可变更新）。

关键概念： Store, Action, Reducer, Dispatch, Selector.

现代工具 (Redux Toolkit - RTK)： 强烈推荐使用！ 极大简化 Redux 开发（configureStore, createSlice, createAsyncThunk, createEntityAdapter, RTK Query）。

优势： 严格的架构、强大的中间件支持（如 Redux Thunk, Saga）、优秀的 DevTools、庞大的生态系统和社区。适合大型复杂应用，需要强一致性和可追溯性的场景。

```js
// store.js
import { createSlice, configureStore } from '@reduxjs/toolkit';
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: { increment: (state) => state + 1 }
});
export const { increment } = counterSlice.actions;
export default configureStore({ reducer: counterSlice.reducer });

// Component.js
import { useSelector, useDispatch } from 'react-redux';
import { increment } from './store';
const Component = () => {
  const count = useSelector(state => state);
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(increment())}>{count}</button>;
};
```

## 2、Zustand (轻量/灵活)：
核心理念： 基于 Hook 的极简状态管理。创建一个 Store（包含状态和更新状态的方法）。组件使用 Hook (useStore) 订阅 Store 或其部分状态。**Zustand 本质上就是一个高度简化的 Redux 思想实践**。Zustand可以创建多个store，彼此是完全独立的。

特点：
1. 无样板： API 极其简洁。
2. 不可变性： 更新状态时返回新对象（或使用 Immer 简化）。
3. 细粒度订阅： 组件只订阅其实际使用的状态片段，避免不必要的渲染。
4. 脱离 Context： 不依赖 React Context，避免 Provider 嵌套问题。

优势： 学习曲线平缓，代码简洁，性能优异（细粒度订阅），非常灵活。适合中小型应用或作为大型应用中局部状态管理方案。
劣势： 生态系统和中间件不如 Redux 丰富（但够用），架构约束较少，大型项目需自行组织。

**单一 Store 管理多个状态（推荐用于相关状态）**
```js
// store.js
import create from 'zustand';

// 创建包含多个状态的单一Store
const useStore = create((set) => ({
  // 计数器状态
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  
  // 用户名状态
  name: 'Guest',
  setName: (newName) => set({ name: newName }),
  
  // 其他状态...
}));

// CounterComponent.js
const CounterComponent = () => {
  // 只订阅需要的状态和方法
  const { count, increment } = useStore();
  return <button onClick={increment}>Count: {count}</button>;
};

// UserComponent.js
const UserComponent = () => {
  // 只订阅需要的状态和方法
  const { name, setName } = useStore();
  return (
    <div>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)} 
      />
      <p>Hello, {name}!</p>
    </div>
  );
};
```

**多个独立 Store（推荐用于完全独立的状态）**
```js
// counterStore.js
export const useCounterStore = create((set, get) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 }))

  // 复杂操作（使用 get 访问当前状态）
  complexAction: () => {
    const currentState = get(); // 获取整个状态
    // 计算新状态...
    set({ /* 更新部分状态 */ });
  }
}));

// userStore.js
export const useUserStore = create(set => ({
  name: 'Guest',
  setName: (newName) => set({ name: newName }),
}));

// CounterComponent.js
import { useCounterStore } from './counterStore';

const CounterComponent = () => {
  const { count, increment } = useCounterStore();
  return <button onClick={increment}>Count: {count}</button>;
};

// UserComponent.js
import { useUserStore } from './userStore';

const UserComponent = () => {
  const { name, setName } = useUserStore();
  return (
    <div>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)} 
      />
      <p>Hello, {name}!</p>
    </div>
  );
};

// components/UserDashboard.jsx
import { useCounterStore } from '../stores/counterStore';
import { useUserStore } from '../stores/userStore';

const UserDashboard = () => {
  const { name } = useUserStore();
  const { count } = useCounterStore();
  
  return (
    <div>
      <h2>{name}'s Dashboard</h2>
      <p>Interaction Count: {count}</p>
    </div>
  );
};
```

**注意，在Zustand中，默认情况下，当你在组件中使用`useStore`钩子时，它会订阅整个store的状态变化。这意味着，无论store中的哪个状态发生变化，任何使用了`useStore`的组件都会重新渲染，即使该组件只使用了store中未发生变化的部分。**可以理解为，useStore中是一个大的状态对象，和useState一样，当state值变化时，组件重新渲染。但是，如果这样的话，zustand会造成许多不必要的渲染。
**但是，Zustand提供了一种优化方式：你可以通过传递一个选择器函数给`useStore`来指定组件只关心store中的哪一部分状态。这样，只有当选择器返回的部分状态发生变化时，组件才会重新渲染。**
```jsx
import shallow from 'zustand/shallow' // 引入浅层比较工具

// 只订阅 count 和 increment
const Counter = () => {
  const { count, increment } = useStore(
    state => ({ count: state.count, increment: state.increment }),
    shallow // 浅层比较防止无关更新
  )
  return <button onClick={increment}>{count}</button>
}

// 只订阅 name 和 setName
const NameEditor = () => {
  const { name, setName } = useStore(
    state => ({ name: state.name, setName: state.setName }),
    shallow
  )
  return <input value={name} onChange={e => setName(e.target.value)} />
}
```


## 3、Jotai (原子化/Reactish)：
前面提到，zustand最大的问题我认为就是store中任何状态的改变都会导致所有引用useStore()的组件的重新渲染。虽然可以使用选择器函数来解决，但是感觉整个页面会处处用到。要是能够做到比如`const { name, setName } = useUserStore();`渲染就只依赖我用到的状态那就最好了。这里就得提Jotai了。

核心理念： 受 Recoil 启发，采用 原子 (Atom) 的概念。原子是最小的状态单位。通过组合原子（atom）和派生原子（derived atom）构建状态图。使用 Hook (useAtom) 读取和写入原子状态。

特点：
1. 真正的 React 风格： 完全拥抱 React Hooks 和 Suspense。
2. 原子化： 状态被分解成细粒度的原子，**组件只订阅它们依赖的原子**。
3. 派生状态： 轻松创建基于其他原子的计算值。
4. 无全局 Store： 状态通过原子定义和组合隐式存在。
5. 极简 API： 核心 API (atom, useAtom) 非常小。

优势： 与 React 心智模型高度契合，自动优化渲染（依赖跟踪），非常适合管理细粒度、派生状态多的场景。学习曲线低（如果熟悉 React Hooks）。

劣势： 相对较新，生态系统和工具链还在发展中。调试可能不如 Redux 直观。

```js
// atoms.js (全局共享的基础原子)
import { atom } from 'jotai';

// 基础原子 - 真正全局共享的状态
export const countAtom = atom(0);
export const nameAtom = atom('Guest');

// 操作原子 - 全局可用的操作
export const incrementAtom = atom(null, (get, set) => {
  set(countAtom, get(countAtom) + 1); // 这里不像zustand那样set(state =>({count: xxx}))设置整个store
});

export const setNameAtom = atom(null, (_, set, newName) => {
  set(nameAtom, newName);
});
```

```jsx
// components/UserDashboard.jsx
import { useAtomValue, atom } from 'jotai';
import { nameAtom, countAtom } from '../atoms';

const UserDashboard = () => {
  // 使用组件特定的派生原子
  const name = useAtomValue(nameAtom);
  const count = useAtomValue(countAtom);
  
  return (
    <div>
      <h2>{`${name}'s Dashboard`}</h2>
      <p>Interaction Count: {count}</p>
    </div>
  );
};

export default UserDashboard;
```