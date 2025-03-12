### 一、图文混排问题
## 1、react-native
我们经常遇到比如一段描述文案，后面紧跟着一个按钮，并跟随文本流动。这种就是图文混排。react-native没有什么好的解决方案，都是采用Text组件嵌套View的方式，但是很不稳定，且样式会走样。比如Text内容变长，里面的View位置可能不会动，仅仅是文本变长，导致样式出问题。
第一，如果按钮是复杂的样式（必须使用View组件），那确实没什么好的方法；
第二，如果按钮就是一个文本，或者本身就是一个文本但是视觉希望这个文本是永远绑定在一起的，那其实有一个解决方法，就是使用**连字符(\u2060)**，比如：
```jsx
// 我们希望roomNights是完整的不会从中间断开，做法：newRoomNight = roomNights?.split('').join('\u2060');每个字符都连起来。当然，如果roomNights本身就超过一行了，那连字符也没有，还是会换行。
<Text>
    <Text>{roomName}</HText>
    <HText>{roomNights}</HText>
</Text>
```

## 2、react
react中可以使用`display: inline-block` 适用于图文混排，这一点是react-native不具备的。React Native 没有 display: inline-block 的原因是它的布局引擎基于 Flexbox，所有元素的默认 display 属性为 flex（没有 block/inline-block 等 Web 概念）。
```js
function InlineTextButton({ text }) {
  return (
    <div style={{
      display: 'inline-block',
      maxWidth: '100%',
      whiteSpace: 'normal',
      verticalAlign: 'bottom'
    }}>
      <span style={{ 
        display: 'inline',
        whiteSpace: 'pre-wrap',
        marginRight: 8
      }}>
        {text}
      </span>
      <button style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        verticalAlign: 'bottom',
        padding: '6px 12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer'
      }}>
        点击按钮
      </button>
    </div>
  );
}

function App() {
  return (
    <div style={{ width: 300, border: '1px solid #ccc', padding: 16 }}>
      <h3>示例：</h3>
      <InlineTextButton text="这是一段可能会换行的长文本内容，当容器宽度不足时，文本会自动换行，而按钮始终保持在文本流的末尾位置。" />
    </div>
  );
}
```

## 二、其他