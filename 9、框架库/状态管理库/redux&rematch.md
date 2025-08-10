首先，先提供一段代码，比较一下redux和rematch的实现差异，如下：
## 1、redux原生实现
```js
// actions.js
export const addToCart = (item) => ({
  type: 'ADD_TO_CART',
  payload: item
})

// reducer.js(纯函数，输入action，返回新的state对象)
const cartReducer = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TO_CART':
      return [...state, action.payload];
    default:
      return state;
  }
}

// store.js
import { createStore } from 'redux';
const store = createStore(cartReducer);

// 组件中使用
dispatch(addToCart(product))
```

## 2、rematch实现
```js
// models/cart.js
export const cart = {
  state: [],
  reducers: { // 直接定义reducers，看上去像是直接操作reducer更新store，但其实也是经过了action
    addToCart(state, item) {
      return [...state, item];
    }
  },
  effects: (dispatch) => ({
    async addAsync(item) {
      await api.save(item); // 直接使用异步
      dispatch.cart.addToCart(item);
    }
  })
}

// store.js
import { init } from '@rematch/core';
init({ models: { cart } });

// 组件中使用
dispatch.cart.addToCart(product)
```

### 一、核心三要素的作用
## 1、 dispatch - 状态更新的触发器
1. 唯一合法修改 store 的方式
2. 发送 action（描述发生了什么的对象）

```js
// 同步 action（action是一个带有type、payload属性的普通对象）
dispatch({ type: 'ADD_ITEM', payload: item })

// Rematch 的 dispatch
dispatch.cart.addToCart(item)
```
本质上，rematch的dispatch也是通过 action 修改store（action是修改store的唯一途径，action是redux故意设计的，看起来很多余，但是有其设计的意义在，比如状态管理的可预测性、中间件的拦截等）。如下所示：
```js
// 您写的简洁调用
dispatch.cart.addToCart(product)

// 实际执行的底层代码
dispatch({
  type: 'cart/addToCart',  // 自动生成的 action type
  payload: product       // 传入的参数
})

// → 触发 reducer 生成新状态
const newCartState = cart.reducers.addToCart(
  currentState, 
  product // = action.payload
);

// → 用新状态更新 store

```

所以，dispatch更新store，其过程是**dispatch(action) → reducer(action) → store**，这个过程无论是redux、rematch都是一样的。rematch的reducers中的addToCart看着像dispatch直接触发reducer返回新对象更新store，但其实也是经过了action操作。

reducer就是一个纯函数，它接收输入：(currentState, action)，输出全新的状态对象 newState。reducer更新store的原理是`const store = createStore(cartReducer);`或者`init({ models: { cart } });`这个过程将 reducer 注册到 store 内部。store则是持有当前状态的引用，当 reducer 返回新状态时，store会替换自己的状态引用。所以，记住，reducer的目的是返回**新的状态对象**，来替换原来的store的状态对象。错误理解如下：
```js
// 错误理解：reducer 直接修改 store
function reducer(state, action) {
  state.cart.push(action.payload); // ❌ 直接修改
  return state; // ❌ 返回相同引用
}
```


## 2、 useSelector/connect - 精准更新的守门人
1. 负责组件与 store 的连接
2. 通过浅比较/引用比较决定是否重渲染

```js
// useSelector 示例
const items = useSelector(state => state.cart.items)

// connect 示例
const mapState = state => ({ items: state.cart.items })
connect(mapState)(Component)
```

你可能会有疑问，store的整个根状态对象都变了，为什么useSelector/connect还能进行浅比较来判断是否重新渲染呢？岂不是一定变了！其实不然，reducer返回的新对象如下所示，原始状态state展开后，内部的状态引用是不变的，只有更新的地方"user"被覆盖了，创建了新的user：
```js
return {
  ...state,       // 1. 创建新的根状态对象（引用改变）
  user: {          // 2. 创建新的 user 对象（引用改变）
    ...state.user, // 3. 复制原 user 属性
    name: 'Amy'    // 4. 只修改 name 属性
  }
  // cart: state.cart → 5. 保持原引用不变 ❗
}
```

# (1) useSelector
React-Redux最开始提供了connect，后面又提供了useSelector/useDispatch可取代connect，用于桥接组件。
```js
import { useSelector } from 'react-redux'

// 精准订阅特定状态
const cartItems = useSelector(state => state.cart.items)

// 当且仅当 cart.items 变化时组件重渲染
return <div>{cartItems.length} items</div>
```

# （2）connect
当 store 更新时，connect 内部会进行浅比较。
```js
const mapStateToProps = (state) => ({
  // 显式声明组件需要的状态片段
  items: state.cart.items,
  total: state.cart.total,
  user: state.user.name
})
```
1. 核心作用：定义组件依赖的 store 中的精确状态片段
2. 类比`useSelector`：相当于多个 `useSelector` 的集合


## 3、Effect - 副作用的处理器
1. 处理异步操作（API 请求、定时器等）
2. 不直接修改状态，而是 dispatch 同步 action

Rematch 可以直接在 effects 中使用 async/await，而redux则需要中间件。

# （1）redux
```js
// store.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

// action.js
export const fetchUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: 'USER_REQUEST' });
  
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    dispatch({ type: 'USER_SUCCESS', payload: user });
  } catch (error) {
    dispatch({ type: 'USER_FAILURE', error });
  }
};

// 组件中使用
dispatch(fetchUser(123));
```

# （2）rematch
```js
// models/userModel.js
export const user = {
  state: {},
  reducers: {
    setUser(state, payload) {
      return { ...state, ...payload };
    }
  },
  effects: (dispatch) => ({
    // 异步 effect
    async fetchUser(payload, rootState) {
      try {
        const response = await fetch(`/api/users/${payload}`);
        const user = await response.json();
        dispatch.user.setUser(user); // 调用同模型的 reducer
        
        // 可以调用其他模型的 action
        dispatch.notification.show('User loaded!');
      } catch (error) {
        dispatch.notification.showError(error.message);
      }
    }
  })
};

// 组件中使用
dispatch.user.fetchUser(userId);
```