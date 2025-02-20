我们都知道，`react`是通过`新旧DOM`对比，进行局部的更新渲染的。这里我主要说一下`新旧DOM`的对比以及与`key`的关联性。

## 一、现象分析
1. 新的虚拟`DOM`是基于组件的最新`props`和`state`的值计算得出的，然后再和旧`DOM`进行比较。**这里我想强调的是新的`DOM`不是基于旧的`DOM`生成的**。虚拟DOM的结构如下：
```jsx
{
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: {
          children: 'Hello, World!'
        },
        key: null,
        ref: null,
        $$typeof: Symbol.for('react.element')
      },
      {
        type: 'p',
        props: {
          children: 'This is a paragraph.'
        },
        key: null,
        ref: null,
        $$typeof: Symbol.for('react.element')
      }
    ]
  },
  key: null,
  ref: null,
  $$typeof: Symbol.for('react.element')
}
```
2. `react`会给每一个`DOM`元素，优先使用开发自定义的`key`，没有的话会提供默认的`key`，这个`key`是基于该组件在父组件中的索引，比如第一个就是“0”，第二个就是“1”。所以，默认的`key`是和位置一一对应的。
3. 虽然`key`是`react`用来识别组件用的，但是`react`并不会把它作为唯一的标识。只有类型一致的节点，diff才会进行对比，否则没有继续对比的必要，直接重建。总的来说，判断前后是否为相同组件是**key+组件类型**。
```jsx
{isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
```
这种情况，`isFancy` 由`true`转为`false`的时候，不会复用，因为比较发现前后不是相同组件（一个是div，一个是section），即使提供给他们加上同一个`key`也没有用。
4. 组件的diff对比只进行同层对比。所以，`key`只在兄弟组件中有效，所以，如果一个父组件只有一个子组件，那怎么定义该子组件的`key`，都无所谓，因为不会出现复用导致的混乱。
5. 组件`A = () => {return null}` 和 `{show ? <A/> : null}` 不是一回事。前者不会销毁*组件A*，当前位置仍然是*组件A*的，一旦状态或者`props`发生变化，*组件A*会立刻更新的，直接销毁再创建肯定消耗大；后者`show=false`时直接销毁*组件A*，因为该位置的组件由*组件A*换成了`组件null`，这两者不是一个组件类型。所以，想要组件不显示的时候销毁避免再次显示时复用之前的`state`，可以通过`{show ? <A/> : null}` 。
6. 为什么列表中不能用`index`作为`key`或者不提供`key`（默认的`key`也相当于使用`index`）? 因为列表中组件类型一样，`index`如果也一样的话，就会复用，导致组件没有彻底刷新。*参考1* 可以看出，这种相同位置的复用，导致我们即使更换列表顺序也影响不了内容的顺序，这并不是列表组件想要的结果。
7. 复用是在同层中，去找相同`key`和相同组件类型的`DOM`元素，找到了就复用。*参考4* 提到了列表组件，`key`提升性能。示例如下：
```js
/**
 * 1、代码运行在https://codesandbox.io/s/gl9r8m?file=/src/App.js&utm_medium=sandpack，
 * 2、点击切换和点击li可以看到组件的复用情况。同时可以修改name、id和key观察组件复用情况!!
 */
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
    </div>
  );
}

function Counter() {
  const [change, setChange] = useState(false);
  return (
    <div className="container">
      <button onClick={() => setChange((pre) => !pre)}>切换</button>
      {change ? (
        <>
          <Item key="1" id="1" name="一" />
          <Item key="2" id="2" name="二" />
          <Item key="3" id="3" name="三" />
        </>
      ) : (
        <>
          <Item key="3" id="3" name="三" />
          <Item key="2" id="2" name="二" />
          <Item key="1" id="1" name="一" />
        </>
      )}
      {/** 更换key等进行尝试举例*/}
      {change ? (
        <>
          <Item key="1-a" id="1" name="一" />
          <Item key="2-a" id="2" name="二" />
          <Item key="3-a" id="3" name="三" />
        </>
      ) : (
        <>
          <Item key="3" id="3" name="三" />
          <Item key="2" id="2" name="二" />
          <Item key="1" id="1" name="一" />
        </>
      )}
    </div>
  );
}

/**
 * 提供一个状态，监测重新渲染后的状态是否保留
 * 注意，key 是 React 内部保留的一个特殊属性，不会传递给组件。
 * */

const Item = ({ id, name }) => {
  const [state, setState] = useState('');
  return (
    <div>
      <li key={id} onClick={() => setState(name)}>
        {name} - {state}
      </li>
    </div>
  );
};
```
8. 给一个组件固定一个`key`会怎么样？显然结果就是，只要组件还在，就会一直复用！！旧`DOM`在该层有这个`key`(比如key="XX")的组件，根据`props`和`state`生成的新`DOM`在该层也有这个`key`(因为节点同样用了这个组件提供的`key`)。那`react`对比发现前后有相同的`key`和相同的组件类型，那必然复用。好处就是前面说的列表组件，提供唯一的`key`提升性能，坏处就是会一直保留，除非父组件销毁过。
9. 组件实例是一个对象，存有组件的state，渲染后会存在于某个内存中。react要复用就直接使用该内存下的该组件对象实例。组件复用是复用整个组件实例。如果react不主动销毁，它可能被JavaScript的垃圾回收机制回收（没有其他引用指向该组件实例），否则它就会在内存中让你后面直接用。

## 二、key对DOM的影响
上面已经基本介绍了各种场景了，我们对虚拟DOM对比以及Key的作用有了基本的认识，这里总结一下。React 在处理新旧 DOM 对比（即 Reconciliation 过程）时，对于 有 key 和 没有 key 的情况，对比方式确实不同。以下是具体差异：
# 1、没有 key 的情况
当元素列表没有显式声明 key 时，React 默认使用 索引（index） 作为隐式 key。此时对比逻辑如下：  

1. 逐位置对比：React 会按顺序比较新旧列表中相同位置的元素。
2. 类型相同：如果元素类型相同，会复用组件实例，仅更新变化的属性。
3. 类型不同：如果元素类型不同，会销毁旧组件，创建新组件。
4. 性能问题：如果列表顺序变化（如插入、删除、排序），会导致后续位置的元素全部触发不必要的更新或重建，性能较差。

**示例：**
```jsx
// 旧列表
<ul>
  <li>A</li>  // index=0
  <li>B</li>  // index=1
</ul>

// 新列表（在头部插入新元素）
<ul>
  <li>C</li>  // index=0 → 与旧列表 index=0 的 <li>A</li> 类型相同但内容不同，触发更新
  <li>A</li>  // index=1 → 与旧列表 index=1 的 <li>B</li> 类型相同但内容不同，触发更新
  <li>B</li>  // index=2 → 新增元素，触发创建
</ul>
```
所有元素都会触发更新，即使实际只有 C 是新增的。

# 2、有 key 的情况
当显式声明唯一且稳定的 key 时，React 会基于 key 进行匹配：

1. 跨位置匹配：React 会通过 key 匹配新旧列表中的相同元素，无论它们的位置是否变化。
2. 复用实例：匹配到相同 key 的元素会直接复用组件实例，避免不必要的销毁和重建。
3. 高效移动：仅对无法匹配的元素进行新增或删除，已有元素只需移动位置。

**示例**
```jsx
// 旧列表
<ul>
  <li key="A">A</li>
  <li key="B">B</li>
</ul>

// 新列表（在头部插入新元素）
<ul>
  <li key="C">C</li>  // 新增，触发创建
  <li key="A">A</li>  // key="A" 匹配到旧元素，直接复用，无需更新
  <li key="B">B</li>  // key="B" 匹配到旧元素，直接复用，无需更新
</ul>
```
只有 key="C" 的元素会触发创建，其他元素保持复用。


## 三、总结
# 1、Diff算法是同层对比；
# 2、类型一致的节点才有继续Diff的必要性；
# 3、key属性的设置，可以帮忙我们尽可能重用同一层级内的节点。

## 参考

1. [react的key详解](https://www.cnblogs.com/wonyun/p/6743988.html)
2. [react对state的保留和重置](https://react.docschina.org/learn/preserving-and-resetting-state)
3. [react渲染顺序和useEffect执行顺序](https://zhuanlan.zhihu.com/p/657865552)
4. [虚拟DOM的diff算法](https://juejin.cn/post/7288972176958603275)

*参考1* 可以验证，`DOM`对比根据**key+组件类型**，判断前后是否为相同组件。列表组件就是因为这二者一致导致每一项都被复用，状态保留，所以无论如何更换列表顺序，内容顺序没有发生变化；

*参考2* 是`react`官方资料，在强调相同位置的状态保留。由于没有指定`key`，所以默认提供的`key`就是索引，与位置一致，索引位置相同也意味着`key`相同，再加上相同组件类型相同，所以会复用组件实例。自己也可以尝试额外加`key`参数，不同的`key`会导致不再复用。

*参考3* 是`react`渲染顺序是从上到下。毕竟`react`的`props`传递也是由上到下的（`useContext`另说），父组件渲染后，子组件会根据父组件的一些条件比如根据父组件以及自身在父组件中索引位置判断是否复用，比如`props`确定渲染内容。在**所有组件都渲染完成后**，`React`会开始执行副作用和生命周期方法，这是从下到上的，子组件通常是父组件逻辑的一部分。

*参考4* 是*diff*算法，同层比较的方式，进行DOM更新。