我们都知道，`react`是通过`新旧DOM`对比，进行更新渲染的。这样一方面可以积累多次更新到一次渲染中，减少渲染次数；另一方面通过`新旧DOM`的对比，尽可能复用之前的`组件实例`，提示性能。这里我主要说一下`新旧DOM`的对比以及与`key`的关联性。

1. 新的虚拟`DOM`是基于组件的最新`props`和`state`的值计算得出的，然后再和旧`DOM`进行比较。**这里我想强调的是新的`DOM`不是基于旧的`DOM`生成的**。
2. `react`会给每一个`DOM`元素，优先使用开发自定义的`key`，没有的话会提供默认的`key`，这个`key`是基于该组件在父组件中的索引，比如第一个就是“0”，第二个就是“1”。所以，默认的`key`是和位置一一对应的。
3. 虽然`key`是`react`用来识别组件用的，但是`react`并不会把它作为唯一的标识。比如即使父组件`Father`下第一个索引位置，第一次渲染的是*组件A*，第二次渲染的是*组件B*。这两个组件不是同一个组件类型，那即使他们都处于同一个索引下，即使给他们定义了同一个`key`，`react`也不会认为是同一个组件。总的来说，判断前后是否为相同组件是**key+组件类型**。下面刚好有几个例子论证了这个观点。
4. `showB`为`false`时没有第二个节点，`showB`为`true`时，由于当前位置原本没有节点，只能重建，而不会复用同层`key`为"1"的组件实例（不同位置上）。
```js
<div>
    <Counter key="1"/>
    {showB && <Counter key="1"/>} 
</div>
```
5. `key`只在兄弟组件中有效，所以，如果一个父组件只有一个子组件，那怎么定义该子组件的`key`，都无所谓，因为不会出现复用导致的混乱(列表组件容易出现)。
6. 组件`A = () => {return null}` 和 `{show ? <A/> : null}` 不是一回事。前者不会销毁*组件A*，当前位置仍然是*组件A*的，一旦状态或者`props`发生变化，*组件A*会立刻更新的，直接销毁再创建肯定消耗大；后者`show=false`时直接销毁*组件A*，因为该位置的组件由*组件A*换成了`组件null`，这两者不是一个组件类型。所以，想要组件不显示的时候销毁避免再次显示时复用之前的`state`，可以通过`{show ? <A/> : null}` 。
7. 相同位置(意味着相同的默认`key`)的相同组件，就会复用，比如下面示例：
```js
{isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
```
这种情况，`isFancy`由`true`转为`false`的时候，会复用第一个，因为比较发现前后是相同组件。如果给他们加上不同的`key`，就不会复用了。

8. 相同位置的不同组件，所以不会复用，比如下面示例：
```js
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

9. 为什么列表中不能用`index`作为`key`或者不提供`key`（默认的`key`也相当于使用`index`）? 因为列表中组件类型一样，`index`如果也一样的话，就会复用，导致组件没有彻底刷新。*参考1* 可以看出，这种相同位置的复用，导致我们即使更换列表顺序也影响不了内容的顺序，这并不是列表组件想要的结果。
10. 复用是在同层中，去找相同`key`和相同组件类型的`DOM`元素，找到了就复用。*参考4* 提到了列表组件，`key`提升性能。示例如下：
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
11. 给一个组件固定一个`key`会怎么样？显然结果就是，只要组件还在，就会一直复用！！旧`DOM`在该层有这个`key`(比如key="XX")的组件，根据`props`和`state`生成的新`DOM`在该层也有这个`key`(因为节点同样用了这个组件提供的`key`)。那`react`对比发现前后有相同的`key`和相同的组件类型，那必然复用。好处就是前面说的列表组件，提供唯一的`key`提升性能，坏处就是会一直保留，除非父组件销毁过。
12. 组件实例是一个对象，存有组件的state，渲染后会存在于某个内存中。react要复用就直接使用该内存下的该组件对象实例。组件复用是复用整个组件实例。如果react不主动销毁，它可能被JavaScript的垃圾回收机制回收（没有其他引用指向该组件实例），否则它就会在内存中让你后面直接用。

总结下来，react复用组件的依据：**key+组件类型**。不一定准确，但至少在我遇到的场景中是得到验证的！

## 参考

1. [react的key详解](https://www.cnblogs.com/wonyun/p/6743988.html)
2. [react对state的保留和重置](https://react.docschina.org/learn/preserving-and-resetting-state)
3. [react渲染顺序和useEffect执行顺序](https://zhuanlan.zhihu.com/p/657865552)
4. [虚拟DOM的diff算法](https://juejin.cn/post/7288972176958603275)

*参考1* 可以验证，`DOM`对比根据**key+组件类型**，判断前后是否为相同组件。列表组件就是因为这二者一致导致每一项都被复用，状态保留，所以无论如何更换列表顺序，内容顺序没有发生变化；

*参考2* 是`react`官方资料，在强调相同位置的状态保留。由于没有指定`key`，所以默认提供的`key`就是索引，与位置一致，索引位置相同也意味着`key`相同，再加上相同组件类型相同，所以会复用组件实例。自己也可以尝试额外加`key`参数，不同的`key`会导致不再复用。

*参考3* 是`react`渲染顺序是从上到下。毕竟`react`的`props`传递也是由上到下的（`useContext`另说），父组件渲染后，子组件会根据父组件的一些条件比如根据父组件以及自身在父组件中索引位置判断是否复用，比如`props`确定渲染内容。在**所有组件都渲染完成后**，`React`会开始执行副作用和生命周期方法，这是从下到上的，子组件通常是父组件逻辑的一部分。

*参考4* 是*diff*算法，同层比较的方式，进行DOM更新。