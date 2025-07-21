import React, { useRef, useState } from "react";

export const Time = () => {
  const timer = useRef();
  const [time, setTime] = useState(0);

  // 使用Date.now()获取最新值
  //   const start = () => {
  //     const now = Date.now();
  //     const callback = () => {
  //       let current = Date.now();
  //       setTime(Math.floor((current - now) / 1000));
  //       timer.current = setTimeout(callback, 1000);
  //     };
  //     timer.current = setTimeout(callback, 1000);
  //   };

  const start = () => {
    let startTime = Date.now();
    let expectTime = Date.now() + 1000; // 下个更新时间
    const callback = () => {
      const now = Date.now();
      setTime(Math.floor((now - startTime) / 1000));

      const interval = Math.max(0, 1000 - (now - expectTime));
      expectTime += 1000;
      timer.current = setTimeout(callback, interval);
    };
    timer.current = setTimeout(callback, 1000);
  };

  const pause = () => {
    clearInterval(timer.current);
  };

  const clean = () => {
    setTime(0);
  };

  return (
    <div>
      <div>{time}</div>
      <div onClick={start}>start</div>
      <div onClick={pause}>pause</div>
      <div onClick={clean}>clean</div>
    </div>
  );
};
