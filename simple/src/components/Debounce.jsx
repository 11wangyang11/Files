import { useState, useRef, useCallback } from "react";
/** 防抖 */
function debounce(fn, delay) {
  let timer = null;
  return function (...args) { //...args 是 JavaScript 的 剩余参数语法（Rest Parameters）。它会将传入函数的所有参数收集到一个名为 args 的数组中。
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/** 节流 */
function throttle(fn, delay){
  let timer = null;
  var start = Date.now()
  return function (...args) {
    let now = Date.now()
    clearTimeout(timer);
    if (now - start >= delay) {
      fn.apply(this, args);
      start = now // 闭包是引用外部start，可以更改
    } else { // 这个看需求，有的要求不延期执行最后一次触发
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

/**
 * 防抖：
 * 1. 核心思想：事件触发后等待一段时间再执行，若在等待期内再次触发则重新计时
 * 2. 效果：只执行最后一次触发
 * 3. 比喻：电梯关门（最后一个人进入后等待几秒才关门，如果有人再进则重新等待）
 * 
 * 截流：
 * 1. 核心思想：固定时间间隔内只执行一次，在冷却期内（时间间隔内），所有后续触发都会被忽略
 * 2. 效果：稀释执行频率，保证周期性执行
 * 3. 比喻：机枪冷却（无论多快扣动扳机，子弹都按固定频率射出）
 */
