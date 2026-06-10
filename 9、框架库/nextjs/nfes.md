# NFES 框架架构与执行流程

NFES 是基于 Next.js 封装的前端框架。trip-online 的运行模型可以概括为：

```text
Node 入口 (index.js)
  → NFES 核心 (@ctrip/nfes-core) 启动 Express + Next.js
  → Express 中间件链（请求预处理，往 req 挂数据）
  → 路由匹配 (nfes.config.js routerConfig)
  → Next.js SSR 渲染 (pages/_document → _app → 页面)
  → 返回 HTML + __NEXT_DATA__
  → 浏览器 hydration + 客户端逻辑
```

---

## 一、整体架构

### 与纯 Next.js 的主要差异

| 维度 | Next.js | NFES (trip-online) |
|------|---------|-------------------|
| 服务端入口 | `next start` | `nfes start` → `@ctrip/nfes-core` |
| 配置文件 | `next.config.js` | `nfes.config.js` + `app.config.js` |
| 服务端中间件 | `middleware.ts` (Edge) | `trip-online/middleware/*.js` (Express) |
| 路由 | 文件路由 | 文件路由 + `routerConfig` URL 映射 |
| 部署 | Vercel 等 | Captain + Ares CDN |

---

## 二、关键文件说明

| 文件 | 作用 |
|------|------|
| `trip-online/index.js` | 应用入口，调用 `nfesRun()` |
| `trip-online/app.config.js` | 应用身份：AppID、环境 Env、QConfig 声明 |
| `trip-online/nfes.config.js` | 构建与运行时主配置：端口、路由映射、Shark、Captain 等 |
| `trip-online/middleware/` | 项目自定义 Express 中间件（约定目录，自动扫描） |
| `trip-online/pages/_document.tsx` | HTML 文档壳，仅服务端执行 |
| `trip-online/pages/_app.tsx` | 全局 App 壳，SSR + 客户端均执行 |
| `trip-online/pages/*/index.tsx` | 业务页面，通常导出 `getServerSideProps` |

---

## 三、Express 中间件机制

### 3.1 约定与加载方式

中间件放在 `trip-online/middleware/`，不需要手动 import。NFES 启动时由 `@ctrip/nfes-core` 的 `handleBUMiddleware` 自动扫描并注册。

**必须满足的约定：**

- 目录固定：`trip-online/middleware/`
- 仅扫描 `.js` 文件（`.ts` 不会被加载）
- 文件名以 `.` 开头会被忽略
- 文件名首字母决定 `server.use` 执行顺序（因此使用 `00_`、`10_`、`20_` 等前缀）
- 文件名以 `get` / `post` 开头，或在 `get/` / `post/` 子目录下 → 注册为路由，而非中间件

**标准导出格式（工厂函数）：**

```js
module.exports = function (appConfig, env, dev, next_app) {
    // 启动时执行：初始化、拉配置等
    return function (req, res, next) {
        // 每次请求执行：往 req 挂数据
        req.xxx = ...
        next()
    }
}
```

### 3.2 两次执行（核心概念）

中间件是高阶函数（返回函数），分两个阶段：
1. 第一次：服务启动，`handleBUMiddleware` 注册`qconfigMiddleware`，返回 per-request 函数；
2. 第二次：每个 HTTP 请求，执行返回的函数，从闭包读取已缓存的数据，挂到 `req` 上，调用 `next()`

以 `qconfigMiddleware.js` 为例：

```js
async function qconfigMiddleware(appConfig, env, dev) {
    const _qconfig = qconfig.getConfig('100033333:res.properties')
    let qconfigData = await _qconfig.get()           // ① 启动时：拉配置，存入闭包
    _qconfig.on('change', (data) => {
        qconfigData = data && data.configData        // 热更新闭包变量
    })
    return function (req, res, next) {               // ② 返回 per-request 函数
        req.selfQconfigData = qconfigData           // ③ 每次请求：赋值，不再远程拉取
        next()
    }
}
```

### 3.3 中间件数据如何到页面

```text
Express 中间件往 req 挂数据
  → getServerSideProps(ctx) 通过 ctx.req 读取
  → _app.getInitialProps({ ctx }) 通过 ctx.req 读取并合 Object.assign(pageProps, { qconfigData: req.selfQconfigData })并进 pageProps
  → _app.render 通过 Context.Provider / <Component {...pageProps} /> 下发给组件
```

**页面组件消费方式：**

- **直接 props**：`<Component {...pageProps} />` → `this.props.xxx`
- **全局 Context**：`_app` 注入 → `useContext(Context).qconfigData`

---

## 四、两种「中间件」的区别（易混淆）

| | Express 中间件 (`trip-online/middleware/`) | HTTP 请求中间件 (`use(tripWebMiddleware)`) |
|---|-------------------------------------------|-------------------------------------------|
| 注册位置 | NFES 自动扫描 | `_app.componentDidMount` 或页面 `getServerSideProps` |
| 执行时机 | 每次 HTTP 请求，页面渲染前 | 业务代码调用 `fetch()` 时 |
| 操作对象 | Node.js `req` / `res` | 请求上下文 `ctx.options` |
| 目的 | 准备页面环境数据 | 改写 BFF/SOA 请求的 header、URL、响应 |
| 是否到页面 | 是（经 `req` → `pageProps`） | 否（只影响 `fetch` 行为） |

`use(tripWebMiddleware)` 注册在 `@ctrip/trip-web-request-infrastructures` 的全局数组中，`fetch()` 时通过 `compose(middleware)` 洋葱模型执行。与 Express 中间件完全无关。

---

## 五、总览时序图
### 1. 流程
```text
═══════════════════════════════════════════════════════════════
 阶段0: 服务启动（一次）                    nfesRun()

 读配置 → 编译 Next → 创建 Express
 → 中间件工厂执行 + server.use 注册 → router.init → listen(8080)
═══════════════════════════════════════════════════════════════
 阶段1: 每次请求：GET /hotels/testpage?orderid=123

 [A] Express 中间件链
      10_shark → req.state.cargo
      30_ares  → req.quickAccountJs ...
      40_qconfig → req.selfQconfigData
           ↓
 [B] 路由匹配 → next_app.render('/testpage')
           ↓
 [C] Next.js SSR
      _document.getInitialProps()
           └─ ctx.renderPage()
                 ├─ ① 页面 getServerSideProps    → 页面 props
                 ├─ ② _app.getInitialProps       → 全局 props
                 └─ ③ React render App + Page    → HTML 片段
      _document.render() → 完整 HTML + __NEXT_DATA__

    服务器返回第一个响应：Content-Type: text/html
    - <body> 里已有 SSR 渲染的页面 DOM（首屏可见内容）
    - <script id="__NEXT_DATA__">       序列化的 pageProps
    - <script src="/_next/static/chunks/...">  ← 由 <NextScript /> 自动生成，非手写
    - <link href="...css">               样式引用
═══════════════════════════════════════════════════════════════
 阶段2: 浏览器解析 HTML — 自动发起后续请求（下载 chunk）
 
    浏览器不会按「项目里几千个 .ts 文件」逐个下载。
    构建时 webpack 已打包成少量 chunk（通常约 5～15 个 JS + 若干 CSS）。
    解析 HTML 后，对其中每个 <script src="...">、<link href="..."> 自动请求：
        GET /_next/static/chunks/main-xxxxx.js
        GET /_next/static/chunks/framework-xxxxx.js
        GET /_next/static/chunks/pages/orderdetail-xxxxx.js
        GET /_next/static/css/...
        ...
    这些静态资源仍由同一 Express/Next 服务（或线上 CDN，比如图片、字体、构建产物：JS\CSS等）提供。
═══════════════════════════════════════════════════════════════
 阶段3: 浏览器执行 JS — hydration，页面可交互

    chunk 下载完成 → 执行 React 代码
    → 读取 __NEXT_DATA__ 恢复 props
    → hydration：给已有 DOM 绑定事件（不是从零重画整页）
    → _app.componentDidMount：gtm、use(tripWebMiddleware) 等
    → 页面.componentDidMount：必要时客户端 fetch 补数据
 此后用户点击按钮等 → 已下载的 JS 处理逻辑 → fetch BFF API
═══════════════════════════════════════════════════════════════
```

---
#### 2. Express
Express 是 Node.js 的 HTTP 服务框架。NFES 用它接收浏览器请求，在调用 React 渲染之前完成环境准备。
```js
index.js → nfesRun() → nfes-core → const server = express()
```
一次页面请求始终先进入 Express，再进入 Next.js。Express 里有两类环节，构成一条管道（请求依次流过，每环可往 req 挂数据，再 next() 交给下一环。
```bash
【本地开发】
浏览器: http://localhost:8080/hotels/checkinvoucher?orderid=123
              │
              ▼
        本机 8080 端口（pnpm dev 启动的 Node 进程）
              │
              ▼
        trip-online/index.js → nfesRun() → Express
              │
    ┌─────────┴─────────┐
    ▼                   ▼
 Express 中间件      routerConfig 匹配
 (shark/qconfig...)   /hotels/checkinvoucher → /checkinvoucher
                            │
                            ▼
                    next_app.render()  (Next.js SSR)
                            │
                            ▼
                      HTML 返回浏览器


【线上】
浏览器: https://www.trip.com/hotels/ctorderdetail?...
              │
              ▼
        DNS + 网关/SLB（按域名和路径路由到 AppID 100048493）
              │
              ▼
        Captain 容器内 Node 进程（同样 index.js → Express）
              │
              ▼
        （之后与本地完全相同）
```

