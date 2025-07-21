## 一、背景
iOS系统键盘，中文输入法下，点击输入框字母键，输入的字母会直接作为输入框内容，导致无法输入中文。

代码如下：
```js
// 正确代码（示例一）
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

const GuestModifyView = (props: StateProps & DispatchProps) => {
    const {
        testInput,
        onFocus,
        onBlur,
        onChangeTestText,
    } = props;
    const theme = useContext(ThemeContext);
    const styles = dynamicStyles(theme);
    const renderTestInput = () => {
        return (
            <TextInput
                placeholder={getShark(SHARK_KEY.modifyGuestNameEnterName)}
                value={testInput}
                onFocus={() => onFocus()}
                onChangeText={(text: string) => {
                    onChangeTestText(text);
                }}
                onBlur={() => onBlur()}
            />
        );
    };
    return renderTestInput();
};

const mapStateToProps = (state: RootState) => {
    const { testInput } = state.GuestModifyModel;
    return {
        testInput,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    const { onFocus, onBlur, onChangeTestText } = dispatch.GuestModifyModel;
    return {
        onFocus,
        onBlur,
        onChangeTestText,
    };
};
```

```js
// 问题代码（示例二）
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

const GuestModifyView = (props: StateProps & DispatchProps) => {
    const {
        testInput,
        title, // 其他数据，这里简化了代码，取消了其他页面内容
        onFocus,
        onBlur,
        onChangeTestText,
    } = props;
    return <TextInputTest />;
};
const mapStateToProps = (state: RootState) => {
    const { testInput, title } = state.GuestModifyModel;
    return {
        testInput, // testInput是错误原因，testInput改变会更新GuestModifyView
        title,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    const { onFocus, onBlur, onChangeTestText } = dispatch.GuestModifyModel;
    return {
        onFocus,
        onBlur,
        onChangeTestText,
    };
};

// 子组件（TextTextInputTest）
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

const TextInputTest = (props: StateProps & DispatchProps) => {
    const { testInput, onChangeTestText, onFocus, onBlur } = props;
    return (
        <TextInput
            placeholder={getShark(SHARK_KEY.modifyGuestNameEnterName)}
            value={testInput}
            onFocus={() => onFocus()}
            onChangeText={(text: string) => {
                onChangeTestText(text);
            }}
            onBlur={() => onBlur()}
        />
    );
};

const mapStateToProps = (state: RootState) => {
    const { testInput } = state.GuestModifyModel;
    return {
        testInput,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    const { onFocus, onBlur, onChangeTestText } = dispatch.GuestModifyModel;
    return {
        onFocus,
        onBlur,
        onChangeTestText,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TextInputTest);
```
## 二、分析
# 1、iOS系统键盘特点分析：
点击键盘先调用onChangeText，**键盘输入的字母会放在输入框中，并处在选中状态（键盘进行联想），但是此时输入框文本已经是包含该字母的文本了**。选择联想的文本后，会将选中的字母替换为选择的文本。这是iOS系统键盘与第三方键盘或者android键盘的本质区别，iOS系统键盘与输入框的关联性过于密切，输入框的渲染会影响到键盘的联想状态，而第三方键盘或者android键盘相对独立，不受影响。第三方键盘或者android键盘在中文输入框情况下，不会将键盘输入的字母会放在输入框中，在没有选择文本前，输入框文本不会改变。所以，对于iOS系统键盘来说，如果组件刷新导致丢失联想状态，那该字母自然就留在了文本框中了。
# 2、什么情况下，会丢失联想状态？
以上述代码为例，```export default connect(mapStateToProps, {})(GuestModifyView);```将 mapStateToProps 的返回值（即 { testInput }）作为`props` 传递给 GuestModifyView 组件。父组件 GuestModifyView 会受到`testInput`的变化而重新渲染。子组件也会因为`testInput`的变化而重新渲染。**个人认为，iOS系统键盘联想状态与TextInput组件关系密切，键盘状态应该与TextInput组件所在的组件状态同级（示例一是GuestModifyView，示例二是TextInputTest）。通过测试发现，TextInput所在组件实例的父组件“通过redux”刷新，就会导致TextInput组件丢失联想状态**。注意，这里是redux的刷新导致的父组件刷新（props引起的父组件刷新不会引起这个问题）。


## 三、解决方案
**`TextInput`的输入框影响的状态，不要同时在父组件通过redux传入作为父组件的`props`**。
```js
// 正确写法
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

const GuestModifyView = () => {
    const {
        title,
        onFocus,
        onBlur,
        onChangeTestText,
    } = props;
    return <TextInputTest />;
};
const mapStateToProps = (state: RootState) => {
    const { title } = state.GuestModifyModel; // 去掉了没有用到的testInput
    return {
        title,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    const { onFocus, onBlur, onChangeTestText } = dispatch.GuestModifyModel;
    return {
        onFocus,
        onBlur,
        onChangeTestText,
    };
};

// 子组件
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

const TextInputTest = (props: StateProps & DispatchProps) => {
    const { testInput, onChangeTestText, onFocus, onBlur } = props;
    return (
        <TextInput
            placeholder={getShark(SHARK_KEY.modifyGuestNameEnterName)}
            value={testInput}
            onFocus={() => onFocus()}
            onChangeText={(text: string) => {
                onChangeTestText(text);
            }}
            onBlur={() => onBlur()}
        />
    );
};

const mapStateToProps = (state: RootState) => {
    const { testInput } = state.GuestModifyModel;
    return {
        testInput,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    const { onFocus, onBlur, onChangeTestText } = dispatch.GuestModifyModel;
    return {
        onFocus,
        onBlur,
        onChangeTestText,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TextInputTest);
```

## 四、感悟
mapStateToProps、mapDispatchToProps中没有用到的就不要放在里面，考虑eslint配置来提示（"react/no-unused-prop-types": 1）。


## 附加
还有，测试发现，TextInput的multiline对组件的渲染也有影响，会造成额外触发onChangeText，且回调的text是上一次的输入框文本。如果再加上上面提到的父组件渲染问题，会陷入死循环。