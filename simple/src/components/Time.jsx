import React, { useRef, useState } from "react";
export const Time = () => {
  const timer = useRef();
  const [time, setTime] = useState(0);
  let count = 0; // Time每次更新都会创建新的count(新的地址)

  /**
   * 核心：
   * 1、每次 Time 组件渲染时，都会创建一个 全新的作用域，每个作用域有自己的 time 状态、start 函数等；
   * 2、自己的time状态，指的是“快照”，hook里的time和setTime在组件生命周期中始终是同一个，但是组件内使用的time只是“快照”；
   * 3、虽然闭包捕获是“引用”的方式，但是setTime(time + 1)组件里的time只是“快照”，所以Time更新后callback没有更新的话，里面的time永远指向第一次的time地址，而不是最新Time组件的快照地址。
   * 所以，time永远是0，setTime(time + 1)的效果永远是setTime(1)。
   */
  // 函数式更新
  const start = () => {
    const callback = () => {
      count += 1;
      console.log(count); // 这里会递增，因为callback没有更新，count始终指向第一次Time里的count地址。
      setTime(time => time + 1); // 函数式更新拿到的从自己的内部状态存储中获取最新的 time 值，将这个最新值作为 prev 参数传入，执行函数得到新状态更新组件
    };
    timer.current = setInterval(callback, 1000);
  };

  // 也使用Date.now()获取最新值或者useRef
  // const start = () => {
  //   const now = Date.now();
  //   const callback = () => {
  //     let current = Date.now();
  //     setTime(Math.floor((current - now) / 1000));
  //     timer.current = setTimeout(callback, 1000);
  //   };
  //   timer.current = setTimeout(callback, 1000);
  // };

  // const start = () => {
  //   let startTime = Date.now();
  //   let expectTime = Date.now() + 1000; // 下个更新时间
  //   const callback = () => {
  //     const now = Date.now();
  //     setTime(Math.floor((now - startTime) / 1000));

  //     const interval = Math.max(0, 1000 - (now - expectTime));
  //     expectTime += 1000;
  //     timer.current = setTimeout(callback, interval);
  //   };
  //   timer.current = setTimeout(callback, 1000);
  // };

  const pause = () => {
    clearInterval(timer.current);
  };

  const clean = () => {
    setTime(0);
  };

  return (
    <div>
      <div>定时器</div>
      <div>{time}</div>
      <div>{count}</div>
      <div onClick={start}>start</div>
      <div onClick={pause}>pause</div>
      <div onClick={clean}>clean</div>
    </div>
  );
};
