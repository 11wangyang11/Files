**应用场景：浮层滚动条的设置。当浮层内容大于maxHeight，就调整`内容容器`的样式，比如设置margin-right由原来的24px改为18px，因为滚动条为6px宽度，而margi-left是24px，左右均衡。其中，maxHeight会受到是否有bottom的影响。所以逻辑是：**    

1. `内容容器`渲染，并在useEffect中根据bottom的改变重新渲染;
2. 父组件在`内容容器`渲染完成后，拿到最终的`maxHeight`，并设置`内容容器`的样式，比如margin-right由原来的24px改为18px。

**存在的问题：父组件如何拿到子组件渲染完成后的样式。。。。。**


## 代码1   
先说一下父组件、子组件的渲染顺序问题。。。    

```js
const MyPop = () => {
    useEffect(() => {
        const contentComponent = document.getElementById('pop-content-id') as HTMLElement;
        const styles = window.getComputedStyle(contentComponent);
    },[]);

    return (
        <Pop contentClassName="my-pop-content">
            {children}
        </Pop>
    )
}

const Pop = () => {
    return (
        <div className="pop-container">
            <div className={`pop-content ${contentClassName}`} id="pop-content-id">
                {children}
            </div>
        </div>
    )
}
```
从渲染顺序来说，父组件先渲染，然后子组件渲染，如下：
1. 父组件的 `render` 方法被调用，生成父组件的虚拟 DOM。
2. React 比较新的父组件虚拟 DOM 和旧的父组件虚拟 DOM，找出差异。
3. React 将差异应用到实际的 DOM 上，更新父组件在页面上的显示。(会触发useEffect)
4. React 递归地更新所有子组件，重复上述步骤。   

所以，是父组件`MyPop`先加载完毕并触发`useEffect`，然后子组件`Pop`渲染并触发`useEffect`。所以，如果useEffect调用顺序和渲染顺序是一致的（*后面会进一步分析对错*），父组件想在`useEffect`中直接拿到子组件**渲染后**的`css样式`可能会有问题，因为父组件渲染时机早于子组件。  


## 代码2   
既然父组件不好直接获取子组件的渲染完成时机，就考虑在`内容容器`中使用useEffect获取到容器组件的渲染时机，如下：   

```js
interface IProps {
    children: ReactNode;
    bottom?: ReactNode | null;
}
const PopBox = (props: IProps) => {
    const { children, bottom } = props;
    const [hasBottom, setHasBottom] = useState(false);
    useEffect(() => {
        const bottomContent = document.querySelector('.pop-bottom') as HTMLElement;
        if (!bottomContent?.innerHTML) {
            bottomContent.style.display = 'none';
            setHasBottom(false);
        } else {
            bottomContent.style.display = '';
            setHasBottom(true);
        }
    }, [bottom]);

    return (
        <div className="pop-overlay">
            <div className="pop-container">
                <PopContent hasbottom={hasbottom}>{children}</PopContent>
                <div className="pop-bottom">{bottom}</div>
            </div>
        </div>
    );
};

const PopContent = (props: { hasbottom: boolean; children?: ReactNode | null }) => {
    const { hasbottom, children } = props;
    useEffect(() => {
        const contentComponent = document.getElementById('content-wrapper-id') as HTMLElement;
        const styles = window.getComputedStyle(contentComponent);
        const maxHeight = parseInt(styles.maxHeight);
        const scrollHeight = contentComponent.scrollHeight;
        if (scrollHeight > maxHeight) {
            contentComponent.style.paddingRight = `18px`;
        }
    }, []);
    return (
        <div className={`content-wrapper content-wrapper-${hasbottom}`} id="content-wrapper-id">
            {children}
        </div>
    );
};

export default PopBox;
```

*代码2* 是将`内容容器`抽出来单独作为一个组件，目的是便于使用`useEffect`来获取`内容容器`渲染后的触发时机。但是，为什么这段代码，会先调用`PopContent`的`useEffect`，然后再调用`PopBox`的`useEffect`。这个如何解释?? 后面会解释。
这段代码无法实现目标，所以我就考虑使用在PopContent的useEffect增加触发时机，加了`hasBottom`和`children`。这样当`hasBottom`和`children`改变时会多触发一次PopContent的`useEffect`。注意，别忘了children也是props，不过很少作为useEffect的参数，因为内容很容易变动，所以不想频繁触发useEffect。    

所以，首次加载的时候，如果`hasBottom`为`true`，触发3次 useEffect：先是`PopContent`的 useEffect，再是`PopBox`的 useEffect，由于`hasBottom`的改变再次触发`PopContent`的 useEffect；如果`hasBottom`为`false`，会触发前两次，即首先渲染的两次，不过由于`hasBottom`没变，所以第一次在`PopContent`的 useEffect 拿到的值就已经是本来就是没变的正确值。   
```js
    useEffect(() => {
        const contentComponent = document.getElementById('content-wrapper-id') as HTMLElement;
        const styles = window.getComputedStyle(contentComponent);
        const maxHeight = parseInt(styles.maxHeight);
        const scrollHeight = contentComponent.scrollHeight;
        if (scrollHeight > maxHeight) {
            contentComponent.style.paddingRight = `18px`;
        }
    }, [hasbottom, children]);
```   

**附：**   

**`useEffect`只要组件渲染后，就可以触发的，增加 **[]*、*[xx,yy]*就是提供约束条件，只在首次渲染或者xx，yy变化导致的重新渲染后，才触发。useEffect通常是异步，比如`[show, setShow] = useState(false)`在`useEffect`中先`setShow`然后直接获取`show`，发现`show`是没变的。**



## 代码3   

```js
const PopBox = (props: IProps) => {
    const { title, iconUrl, children, topView, bottom, onClose } = props;
    const [hasBottom, setHasBottom] = useState(false);
    useEffect(() => {
        const bottomContent = document.querySelector('.pop-bottom') as HTMLElement;
        if (!bottomContent?.innerHTML) {
            bottomContent.style.display = 'none';
            setHasBottom(false);
        } else {
            bottomContent.style.display = '';
            setHasBottom(true);
        }
    }, [bottom]);
    useEffect(() => {
        const contentComponent = document.getElementById('content-wrapper-id') as HTMLElement;
        const styles = window.getComputedStyle(contentComponent);
        const maxHeight = parseInt(styles.maxHeight);
        const scrollHeight = contentComponent.scrollHeight;
        if (scrollHeight > maxHeight) {
            contentComponent.style.paddingRight = `18px`;
        }
    }, [hasBottom, children]);

    return (
        <div className="pop-overlay">
            <div className="pop-container">
                <div className={`content-wrapper content-wrapper-${hasbottom}`} id="content-wrapper-id">
                    {children}
                </div>
                <div className="pop-bottom">{bottom}</div>
            </div>
        </div>
    );
};
export default PopBox;
```
既然**内容组件首次渲染触发的useEffect，拿到的本身就是未变的正确styles**。所以，我们其实并不需要把`内容容器`抽出来单独作为组件，因为我们不需要知道**内容容器首次渲染后的时机** 和其 **父容器首次渲染后的时机** 前后顺序。只需要知道`内容容器`的重新渲染的完成时机即可，所以只需要知道`内容容器`**样式改变**的因素有哪些即可，因为影响因素变了，渲染完后就会触发`useEffect`。而影响`内容容器`重新渲染的就是`hasBottom`和`children`。所以我们触发时机上就加上`hasBottom`和`children`即可。

## 结论   

因为`内容容器`的变化影响因素就两个：
1. 一是`hasBottom`影响`maxHeight`;
2. 另一个是`children`影响`内容长度`。  

这两者共同决定滚动条是否出现，影响`内容容器`的重新渲染，这里比较特殊的地方是`children`本身就是`内容容器`样式的影响因素，所以useEffect中使用了`children`。**`useEffect` 是渲染后执行，也就是`hasBottom`或者`children`改变了，组件重新渲染后触发useEffect。所以不用担心`haBottom`或者`children`改变了，但是调用`useEffect`的时候，`内容容器`的 *styles* 还没变。**  

**附：**   
**1. 从上面可以看出，children也是组件的props，所以子组件的改变会导致父组件也重新渲染；而父组件的重新渲染又会导致子组件的重新渲染。可以在各个级别的组件上加入`useEffect(() => {})`试一试。所以这存在性能问题，React 引入了虚拟 DOM 的概念，可以在组件重新渲染时，通过比较前后两次渲染的差异，只更新发生变化的部分，来减少不必要的 DOM 操作，从而提高性能。**    

**想知道组件渲染完成后触发时机，就一定要知道该组件的渲染受到哪些因素的影响，否则没法知道这个触发时机。影响一个组件渲染的就是props和state。**

# 还没有解释的问题是useEffect和渲染时机是否一致？？？？
答案是一致的。useEffect是hook，hook就是与渲染时机挂钩的。但是，是整体渲染完后依次执行useEffect还是渲染一个组件就执行当前useEffect？？？首先，渲染和useEffect不是一回事。可以在return前log，在useEffect中log。会发现父组件在前和子组件在后的return顺序（理解，毕竟父组件return的时候，才用到子组件。需要理解的地方是，错误的思维是父组件是子组件构建的，所以不知道子组件什么样子，父组件没法渲染。实际上我们要理解成渲染树，树枝由上到下分叉，而不是搭积木，又零件到整体。还有这里即使是渲染树也是虚拟Dom，整个树构建完成后才会真正、整体渲染出来到整个页面上（这一点也需要再证实一下）。），以及先调用子组件useEffect，后调用父组件的useEffect的顺序。 

# 上面问题，给出一个结论：
在 React 中，`useEffect` 的执行时机是组件渲染并挂载到 DOM 后。对于包含子组件的情况，React 会按照组件树的深度优先顺序来渲染组件，并在“整个组件树”渲染完成后，再依次执行各个组件的 `useEffect` 钩子。如下：   

1. **渲染顺序**：React 会先渲染父组件，然后再渲染子组件。渲染是一个同步过程，即父组件和子组件会在一次渲染周期内完成渲染。
2. **`useEffect` 执行顺序**：在整个组件树渲染完成后，React 会依次执行每个组件的 `useEffect` 钩子。具体来说，React 会先渲染完所有组件，然后再执行这些组件的 `useEffect`。

### 示例
以下是一个示例，展示了父组件和子组件中 `useEffect` 的执行顺序：

```javascript
import React, { useEffect } from 'react';

const ChildComponent = () => {
  useEffect(() => {
    console.log('ChildComponent useEffect');
    return () => {
      console.log('ChildComponent cleanup');
    };
  }, []);

  return <div>Child Component</div>;
};

const ParentComponent = () => {
  useEffect(() => {
    console.log('ParentComponent useEffect');
    return () => {
      console.log('ParentComponent cleanup');
    };
  }, []);

  return (
    <div>
      Parent Component
      <ChildComponent />
    </div>
  );
};

const App = () => {
  return (
    <div>
      <ParentComponent />
    </div>
  );
};

export default App;
```

在这个示例中，当 `App` 组件首次渲染时，React 会按照以下顺序执行：

1. 渲染 `App` 组件。
2. 渲染 `ParentComponent` 组件。
3. 渲染 `ChildComponent` 组件。

渲染完成后，React 会依次执行 `useEffect` 钩子：

1. 执行 `ChildComponent` 的 `useEffect`。
2. 执行 `ParentComponent` 的 `useEffect`。

控制台输出将会是：

```
ChildComponent useEffect
ParentComponent useEffect
```

### 原因
这种行为的原因是为了确保子组件的副作用在父组件的副作用之前完成。这样可以避免父组件的副作用依赖于子组件的状态，而子组件的状态还没有更新的情况。实际上在 React 中，`useEffect` 的执行顺序是从子组件到父组件。这是因为 React 在完成所有组件的渲染之后，会按照组件的销毁顺序来执行 `useEffect` 钩子，这个顺序恰好是从最内层的子组件到最外层的父组件。

### 具体执行顺序
1. **渲染顺序**：React 会先渲染父组件，然后再渲染子组件。
2. **`useEffect` 执行顺序**：在组件渲染完成后，React 会按照组件树的深度优先顺序，从内到外执行 `useEffect` 钩子。

### 总结
- React 会先渲染父组件，然后再渲染子组件。
- 在渲染完成后，React 会按照组件树的深度优先顺序，从内到外执行 `useEffect` 钩子。
- 这种顺序确保了子组件的副作用在父组件的副作用之前完成，从而避免潜在的依赖问题。 


**所以，父组件useEffect中获取子组件渲染后样式是可行的，所以上面几个代码，又是担心父组件拿不到子组件渲染后样式；又是拆分出子组件，为了使用它的useEffect，全都是瞎整。只要父组件能知道且可以拿到子组件渲染影响因素，直接使用useEffect就行了。本例中，父组件可以拿到子组件重新渲染的所有影响因素。**

最后再提一下useEffect的清理函数。但这里需要明确区分两个概念：**挂载（mount）** 和 **卸载（unmount）**。

### 挂载顺序
当组件首次渲染时，React 会按照组件树的深度优先顺序进行挂载，并在挂载完成后依次执行 `useEffect` 钩子。这个顺序是从最内层的子组件到最外层的父组件。

### 卸载顺序
当组件被卸载时，React 会按照组件树的深度优先顺序进行卸载，并在卸载之前依次执行 `useEffect` 的清理函数（如果有）。这个顺序是从最外层的父组件到最内层的子组件。



