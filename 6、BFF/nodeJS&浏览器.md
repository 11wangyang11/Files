我们有一张浏览器&NodeJS的对比图，其实浏览器和 Node.js 都依赖 JavaScript 引擎（如 V8）执行代码，这是它们能运行 JS 的基础。所以，nodeJS章节我们讨论的nodeJS能力本质上就是如下三点：
1. 主线程为单线程；
2. 事件循环+异步非阻塞I/O；
3. 模块化

是不是听着很熟悉？浏览器运行JS代码也是如此啊，不满足的话怎么运行js语言呢！本质上，nodeJS就是将 JavaScript 引擎迁移到C语言上，来支持JS的。那浏览器和nodeJS在事件循环和各自的API差异，本质上就是各自所以环境带来的必然差异。下面简单比较一下：

## 1、事件循环的底层实现不同
```bash
对比维度	         浏览器中的事件循环	                        Node.js 的事件循环(libuv)
--------------------------------------------------------------------------------------------
I/O 处理线程	       渲染线程管理	                            独立线程池（默认 4 线程）
驱动引擎	     浏览器内核（如 Chrome 的 Blink）	     libuv 库（专为异步 I/O 设计的跨平台库）
任务队列类型	       宏任务/微任务                       6 个阶段（如 timers、poll、check）    	           
优先级控制	         微任务优先于宏任务	                 分阶段按固定顺序执行（nextTick 微任务插队）
性能优化目标	     优先保证渲染流畅度	                             最大化 I/O 吞吐量
```

代码如下：
```js
// 浏览器：微任务优先
setTimeout(() => console.log(1), 0);
Promise.resolve().then(() => console.log(2));
// 输出：2 → 1
``` | ```js
// Node.js：阶段优先级
setTimeout(() => console.log(1), 0);
setImmediate(() => console.log(2));
// 输出可能：1 → 2 或 2 → 1（取决于事件循环启动耗时）
```

## 2、异步 I/O 的能力范围不同
```bash
能力	             浏览器中的异步 I/O	                   Node.js 的异步 I/O
----------------------------------------------------------------------------------------
文件操作	        ❌ 无法直接读写本地文件	          ✅ fs.readFile（基于 libuv 线程池）
网络协议	        仅限 HTTP/WebSocket	      ✅ 支持 TCP/UDP/HTTP/WebSocket 等全栈协议
系统资源访问	        ❌ 受沙盒限制	               ✅ 可操作进程、子进程、系统信号等
高并发设计	             为渲染优化	                  专为高吞吐 I/O 优化（如 10K+ 连接）
宿主API层	   提供环境专属能DOM、localStorage等	          fs、http、process
```

代码如下：
```js
// Node.js 独有能力（浏览器中抛出安全错误）
const fs = require('fs');
fs.readFile('/etc/hosts', (err, data) => {
  console.log(data); // 直接读取系统文件
});

// 创建 TCP 服务器（浏览器无此 API）
const net = require('net');
net.createServer(socket => {
  socket.end('Hello from Node.js!');
}).listen(8080);
```

## 3、模块化系统的设计差异
```bash
特性	          浏览器(ES Modules)	                   Node.js(CommonJS)
----------------------------------------------------------------------------------------
加载方式	    异步加载(<script type="module">)	          同步加载（阻塞式）
文件解析	           依赖预解析	                            运行时动态解析
作用域	            严格模式（默认）	                       非严格模式（默认）
循环引用处理	  静态分析，引用未初始化值	                   动态缓存，返回部分初始化对象
路径解析	           基于 URL	                        基于 node_modules 递归查找
核心模块	             无	                            fs/path/http 等 20+ 内置模块
```


