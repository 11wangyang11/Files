import { useState, useRef, useCallback } from "react";
/** 防抖 */
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/** 截流 */
function throttle(fn, delay){
  let timer = null;
  var start = Date.now()
  return function (...args) {
    let now = Date.now()
    clearTimeout(timer);
    if (now - start >= delay) {
      fn.apply(this, args);
      start = now // 闭包是引用外部start，可以更改
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
}

export const Debounce = () => {
  const [tips, setTips] = useState();
  const [count, setCount] = useState(0);

  const check = (value) => {
    if (value.length < 5) {
      setTips("less than 5");
    } else {
      setTips("good");
    }
  };

  const add = () => {
    setCount((pre) => pre + 1);
  };

  // 使用 useRef 保存稳定的防抖截流函数实例
  const myRef = useRef({
    check: debounce(check, 1000),
    add: throttle(add, 3000),
  });

  const onKeyUp = useCallback((e) => {
    console.log('11111') // 每次click都会执行，useCallback对防抖截流没什么用
    myRef.current.check(e.target.value)
  }, []) // 生命周期内稳定不变

  const onClick = useCallback(() => {
    console.log('22222') // 每次click都会执行，useCallback对防抖截流没什么用
    myRef.current.add()
  }, [])

  return (
    <div>
      <div>防抖</div>
      <input onKeyUp={onKeyUp} />
      <div>{tips}</div>
      <div onClick={onClick}>增加</div>
      <div>{count}</div>
    </div>
  );
};
