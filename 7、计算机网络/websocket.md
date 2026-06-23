### 一、WebSocket 简介
## 1、定义与作用
WebSocket 是一种在**单个 TCP 连接上进行全双工（双向）通信**的网络协议，由 RFC 6455 定义。它解决了传统 HTTP "请求-响应" 模式的根本限制：HTTP 下客户端不主动请求，服务器就无法主动推送数据。而 WebSocket 在连接建立后，**客户端与服务器可以随时互相发送消息**，非常适合实时场景。

# 1、典型应用场景
- **即时通讯**：聊天 / IM。
- **实时协作**：弹幕、在线文档协同编辑。
- **实时推送**：股票行情、体育比分、消息通知。
- **实时交互**：在线游戏。

## 2、与 HTTP / HTTPS 的协议族关系
WebSocket 与 HTTP/HTTPS 都建立在 TCP 之上，是应用层的"同辈"协议：

```
        应用层
   ┌──────────────┬──────────────┐
   │  HTTP/HTTPS  │  WebSocket   │
   └──────────────┴──────────────┘
              TCP（传输层）
              IP（网络层）
```

WebSocket 复用了 HTTP 的安全模型，URL 协议头一一对应：

| 明文 / 加密 | HTTP 系 | WebSocket 系 | 默认端口 |
|------------|---------|-------------|---------|
| 明文 | `http://`  | `ws://`  | 80 |
| 加密（TLS） | `https://` | `wss://` | 443 |

`wss` 即 "WebSocket Secure"，相当于 `ws + TLS`，与 `https = http + TLS` 同理。**生产环境建议一律使用 `wss://`**：除安全外，加密流量在中间代理 / 防火墙中的穿透性也更好。

### 二、连接的建立（握手过程）
WebSocket 连接的第一步其实是一个**普通的 HTTP 请求**，通过特殊请求头请求"协议升级"（Upgrade）。

## 1、客户端发起（HTTP 请求）
```http
GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

## 2、服务器同意（HTTP 101 响应）
```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

服务器返回状态码 **101 Switching Protocols** 后，这条 TCP 连接就从 HTTP 协议"切换"为 WebSocket 协议。之后双方收发的就是 WebSocket 数据帧，不再是 HTTP 报文。

> 注意：**握手成功（101）只代表"通道建立成功"，并不等于"实时功能可用"。** 还需要服务端支持 + 链路配置 + 一整套稳定性工程（见第四、五节）。

### 三、与 HTTP / HTTPS 的核心区别
| 维度 | HTTP / HTTPS | WebSocket |
|------|-------------|-----------|
| 通信模式 | 半双工，请求-响应 | 全双工，双向随时收发 |
| 连接 | 默认短连接（用完即断） | 长连接（持续保持） |
| 服务器主动推送 | 不能（需轮询 / SSE 变通） | 可以 |
| 头部开销 | 每次请求都带完整头部 | 握手一次，之后帧头极小 |
| 建立方式 | 直接请求 | 借 HTTP 握手后升级（101） |
| 状态 | 无状态 | 有状态（连接保持期间） |

### 四、支持情况：并非"默认全都支持"
握手（101）只是"连上了线"。要让 WebSocket 真正可用、稳定运行，**前端、服务端、以及中间网络设施三方都需要满足条件**。

## 1、浏览器端（前端）：基本可认为"原生支持"
现代浏览器都内置了全局 `WebSocket` 对象，**无需安装任何库**。IE10+ 及所有主流浏览器都支持，浏览器会**自动完成 101 握手**，开发者只需 `new WebSocket()`。

```js
const ws = new WebSocket('wss://example.com/chat');

ws.onopen    = () => ws.send('hello');
ws.onmessage = (e) => console.log('收到:', e.data);
ws.onclose   = () => console.log('断开');
ws.onerror   = (e) => console.error('出错', e);
```

> 浏览器原生 `WebSocket` API 比较"裸"，**不会自动做断线重连、心跳、消息确认**，这些需自行实现（见第五节）。

## 2、服务端：默认**不支持**，必须显式启用
这是最常见的误区。一个普通 HTTP 服务器（如默认的 Nginx、只写了 REST 接口的后端）**不会自动响应 `Upgrade` 请求**，会把它当普通 HTTP 处理，导致握手失败。服务端必须使用支持 WebSocket 的库 / 框架来识别 `Upgrade` 头并完成 101 响应。

| 语言 / 平台 | 常用方案 |
|------------|---------|
| Node.js | `ws`、`socket.io` |
| Java | Spring WebSocket、Netty |
| Python | `websockets`、Django Channels |
| Go | `gorilla/websocket` |

Node.js 示例（`ws` 库）：

```js
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (msg) => ws.send('echo: ' + msg));
});
```

## 3、中间链路：最容易被忽略的"拦路虎"
即使前后端都支持，连接仍可能被中间设施掐断：

# (1) 反向代理 / 负载均衡（Nginx 等）
默认配置常会丢弃 `Upgrade` 头，需专门配置透传：

```nginx
location /chat {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

# (2) 企业防火墙 / 代理
有些只放行标准 HTTP，会拦截 WebSocket。这也是生产环境强烈建议用 `wss://`（443 + 加密）的原因——穿透性更好、更不易被中间设备干扰。

# (3) 云服务 / 网关超时
许多网关对空闲连接设有超时（如 60s），不发数据就会被断开——由此引出心跳保活需求。

### 五、"连上了" ≠ "能用了"：握手之后的工程问题
握手成功只是起点，真实项目还须处理以下问题：

| 问题 | 说明 |
|------|------|
| **心跳保活** | 长时间不通信，连接会被代理 / 网关静默断开，需定时发 ping / pong |
| **断线重连** | 网络抖动、切换 WiFi / 4G 会断连，需自动重连并恢复状态 |
| **消息可靠性** | WebSocket 不保证业务层"送达"，重连后可能丢消息，需自做确认 / 补偿 |
| **鉴权** | 浏览器握手时不便携带自定义 header，常用 URL 带 token 或连接后首条消息鉴权 |
| **数据格式** | 仅传字符串 / 二进制，业务协议（JSON 结构、消息类型）需自行定义 |

正因这些都需自行处理，实际开发中常不直接用原生 API，而用 **Socket.IO** 等库——它在 WebSocket 之上封装了自动重连、心跳、房间、降级（不支持时回退到 HTTP 轮询）等能力。

### 六、页面销毁与重连
连接对象（`new WebSocket()`、进行中的 `fetch`/`XHR`）都存在于**页面的 JS 运行时（内存）**中。页面一旦销毁（关闭、刷新、SPA 路由卸载组件），内存里的连接对象就被回收，连接随之断开。**所以重新进入页面，都要重新发起连接 / 请求。** 但 HTTP 与 WebSocket "重新建立"的含义和代价并不一样。

## 1、WebSocket：必须重连 + 恢复状态
WebSocket 是长连接，且**有状态**。页面销毁后：

- JS 上下文销毁 → `WebSocket` 实例被回收 → 浏览器发 close 帧关闭 TCP 连接。
- 重新进页面必须重新 `new WebSocket()`，**重新走 101 握手**。
- 应用层状态也全没了：订阅了哪些频道、鉴权信息、消息读取位置等，**重连后都需重新同步**。

因此 WebSocket 应用通常要自行实现：
- **断线重连**（监听 `onclose` 后按退避策略重连）；
- 重连后的**重新鉴权 / 重新订阅**；
- 必要时的**消息补偿**（拉取重连期间漏掉的消息）。

## 2、HTTP：只是"重新发请求"，底层 TCP 可能复用
HTTP 无状态，本身没有"页面级持久连接"，要分两层看：

- **应用层（请求）**：页面销毁时进行中的请求会被取消；重新进页面自然要重新发请求拿数据——业务视角下的"重新建立"指的就是这个。
- **传输层（TCP 连接）**：**不一定**重连。浏览器有连接池（HTTP/1.1 keep-alive、HTTP/2 多路复用），底层 TCP/TLS 连接在多个页面 / 请求间复用，不随单个页面销毁立刻关闭。新页面发请求时可能直接复用，省去握手开销。

## 3、对比小结
| | 页面销毁后 | 重新进入 |
|---|---|---|
| WebSocket | 连接断开，应用状态丢失 | 必须重连 + 重新同步状态 |
| HTTP 请求（应用层） | 进行中的请求被取消 | 重新发请求 |
| HTTP 底层 TCP | 浏览器可能保留复用 | 可能复用，不一定重连 |

> 一句话：从**页面 / 业务角度**看，重新进去都要重新发起连接 / 请求；区别在于 WebSocket 是真正的"重建长连接 + 恢复状态"，而 HTTP 只是"重新发请求"，底层 TCP 还可能被浏览器悄悄复用。

### 七、总结
| 层面 | 是否默认支持 | 说明 |
|------|------------|------|
| 浏览器前端 | ✅ 原生支持 | `new WebSocket()` 即可，自动握手 |
| 服务端 | ❌ 需显式启用 | 必须用支持 WS 的库 / 框架 |
| 中间代理 / 网关 | ⚠️ 需配置 | 默认常丢弃 Upgrade 头 |
| 连接稳定运行 | ❌ 需自己实现 | 心跳、重连、鉴权、可靠性 |

- WebSocket 是与 HTTP **平级**的应用层协议，二者都跑在 TCP 上。
- 它**依赖 HTTP 完成一次握手**（返回 101 升级），之后脱离 HTTP 独立工作。
- `ws://` 对应 `http://`，`wss://` 对应 `https://`，加密机制完全复用 TLS。
- 选型上：需要**服务器主动、实时、双向**推送数据时用 WebSocket；普通的请求拉取数据用 HTTP 即可。
- **101 握手成功 = 通道建立成功，但离"可用的实时功能"还差：服务端支持 + 链路配置 + 一整套稳定性工程。**
