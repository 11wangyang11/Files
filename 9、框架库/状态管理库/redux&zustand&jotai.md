核心问题： 在 React 应用中，如何跨组件（尤其是非父子关系的组件）高效、可预测地共享和管理状态？
## 1、Redux (经典/主流)：
核心理念：
1. 单一数据源 (Store)： 整个应用的状态存储在一个 JavaScript 对象树中。
2. 状态是只读的： 唯一改变状态的方法是触发一个 Action（描述发生了什么事件的普通对象）。
3. 使用纯函数 (Reducer) 执行修改： 编写 Reducer 函数接收当前 State 和 Action，返回新的 State（不可变更新）。

关键概念： Store, Action, Reducer, Dispatch, Selector.

现代工具 (Redux Toolkit - RTK)： 强烈推荐使用！ 极大简化 Redux 开发（configureStore, createSlice, createAsyncThunk, createEntityAdapter, RTK Query）。

优势： 严格的架构、强大的中间件支持（如 Redux Thunk, Saga）、优秀的 DevTools、庞大的生态系统和社区。适合大型复杂应用，需要强一致性和可追溯性的场景。

## 2、Zustand (轻量/灵活)：

核心理念： 基于 Hook 的极简状态管理。创建一个 Store（包含状态和更新状态的方法）。组件使用 Hook (useStore) 订阅 Store 或其部分状态。

特点：
1. 无样板： API 极其简洁。
2. 不可变性： 更新状态时返回新对象（或使用 Immer 简化）。
3. 细粒度订阅： 组件只订阅其实际使用的状态片段，避免不必要的渲染。
4. 脱离 Context： 不依赖 React Context，避免 Provider 嵌套问题。

优势： 学习曲线平缓，代码简洁，性能优异（细粒度订阅），非常灵活。适合中小型应用或作为大型应用中局部状态管理方案。
劣势： 生态系统和中间件不如 Redux 丰富（但够用），架构约束较少，大型项目需自行组织。

## 3、Jotai (原子化/Reactish)：
核心理念： 受 Recoil 启发，采用 原子 (Atom) 的概念。原子是最小的状态单位。通过组合原子（atom）和派生原子（derived atom）构建状态图。使用 Hook (useAtom) 读取和写入原子状态。

特点：
1. 真正的 React 风格： 完全拥抱 React Hooks 和 Suspense。
2. 原子化： 状态被分解成细粒度的原子，组件只订阅它们依赖的原子。
3. 派生状态： 轻松创建基于其他原子的计算值。
4. 无全局 Store： 状态通过原子定义和组合隐式存在。
5. 极简 API： 核心 API (atom, useAtom) 非常小。

优势： 与 React 心智模型高度契合，自动优化渲染（依赖跟踪），非常适合管理细粒度、派生状态多的场景。学习曲线低（如果熟悉 React Hooks）。

劣势： 相对较新，生态系统和工具链还在发展中。调试可能不如 Redux 直观。