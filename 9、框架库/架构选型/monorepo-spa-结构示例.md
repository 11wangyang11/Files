# Monorepo + SPA 结构示例

> 配套阅读：[`前端项目架构与路由.md`](./前端项目架构与路由.md)（场景 B：单仓库 + SPA）。
>
> **一句话**：monorepo 只是"代码放一个 git 仓库"；SPA 的"多页面"全靠 React Router；要不要拆多个 package 是**可选项**，只有「跨 app 共享」时才回本。

---

## 一、先破三个误解

```text
误解                              真相
────────────────────────────────────────────────────────────────────────────
monorepo = 多个 package           monorepo 只定义"一个 git 仓库"，里面 1 个包也行
"多页面 SPA" = 多个 HTML           只有 1 个 HTML，多页面全靠 React Router 切组件
拆成 package = 单独打包            workspace 包通常不单独编译，build 时和 app 一起 bundle
```

---

## 二、最简单的形态：一个 package 就够了

只有一个应用、没有要共享的代码时，这就是最常见的起步形态，和"统一的一个 package"完全一致：

```text
my-app/                     ← 一个 git 仓库 = 已经是 monorepo
├─ package.json             ← 就一个 package.json
├─ vite.config.ts
├─ index.html               ← ⭐ 1 个 HTML 入口
└─ src/
   ├─ main.tsx              ← 挂载 React + Router
   ├─ App.tsx               ← 路由表（多页面 SPA 全靠它）
   └─ pages/
      ├─ Home.tsx
      ├─ About.tsx
      └─ User.tsx
```

**多页面 SPA 跟拆不拆 package 无关**——靠的是下面这个路由表。

`index.html`（整个 SPA 只有这一个 HTML）：

```html
<!doctype html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <title>SPA Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/main.tsx`（把整个 app 包进一个 `<BrowserRouter>`）：

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

`src/App.tsx`（每个 `<Route>` 就是一个"页面"）：

```tsx
import { Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { User } from "./pages/User";

export function App() {
  return (
    <div>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/user/42">用户 42</Link>
      </nav>

      {/* URL 变化时，只替换下面这块 DOM，不刷新页面 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </div>
  );
}
```

**它为什么是"SPA + 多页面"：**

```text
点击 <Link to="/about">
   → React Router 调 history.pushState 改地址栏（不请求新 HTML）
   → <Routes> 匹配 /about，卸载 <Home/>、挂载 <About/>
   → 浏览器没刷新，只换了 #root 里的一块 DOM
```

- **为什么是 SPA**：`vite build` 只产出 **1 个 `index.html`**。
- **为什么有多页面**：`<Routes>` 里多个 `<Route>`，切 URL 就换组件，零刷新。

---

## 三、共享组件：先用别名，别急着拆包

同一个 app 内复用组件，**直接 import 就行**，不需要任何 package：

```tsx
import { Button } from "../../components/Button";  // 相对路径
```

嫌 `../../` 丑，配个路径别名即可（依然不拆包）：

```ts
// vite.config.ts
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
});
```

```tsx
import { Button } from "@/components/Button";  // 干净，且零额外结构
```

这是绝大多数单应用项目的真实写法。

---

## 四、什么时候才拆成多个 package

只有当**直接 import 开始别扭或不安全**时，拆包才回本：

```text
触发场景                理由
────────────────────────────────────────────────────────────────────────
1. 跨 app 共享          web 和 admin 都要用 Button；跨 app 写相对路径又脏又脆
                        → 用包名 @demo/ui 才稳定
2. 想强约束边界          package.json 显式声明"ui 只依赖 react"
                        → 防止组件库偷偷 import 业务代码、把依赖搞乱
3. 要独立发布/独立版本    这个库要发到 npm 给别的团队/仓库用
                        → 必须是个有 name、version 的正经 package
```

> 关键：**workspace 包通常不单独编译**——build 时 Vite 会把它的源码和 app 一起 bundle。真正"单独打包"只在发布到 npm 时才发生。

### 多 package 的目录结构（pnpm workspace）

```text
my-monorepo/
├─ pnpm-workspace.yaml        ← 声明哪些目录是 workspace 包
├─ package.json               ← 根包：公共脚本，private: true
│
├─ packages/                  ← "库"：不单独部署，被 apps 引用
│  └─ ui/
│     ├─ package.json         ←   name: @demo/ui
│     └─ src/
│        ├─ Button.tsx
│        └─ index.ts
│
└─ apps/                      ← "应用"：可独立部署
   └─ web/                    ←   一个 SPA（产物只有 1 个 HTML）
      ├─ package.json         ←   name: @demo/web，依赖 @demo/ui
      ├─ vite.config.ts
      ├─ index.html
      └─ src/ ...
```

### 核心配置

`pnpm-workspace.yaml`：它是整个 monorepo 的**「成员花名册」**——告诉 pnpm「这个仓库是工作区，本地包散落在 `apps/*` 和 `packages/*` 这些目录下」。pnpm 只在 `pnpm install` 时读它一次，读完就知道哪些目录算"本地包"。

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

> ⚠️ `packages:` 是 pnpm 规定死的字段名，意思是"工作区成员的位置列表"；列表里同时有 `apps/*` 和 `packages/*`，是因为对 pnpm 来说两者都只是"装着包的目录"，一视同仁——只要目录里有 `package.json` 就当成一个工作区包。`apps`/`packages` 的区分纯属给人看的命名习惯，换成 `services/*`、`libs/*` 也行。

**这份花名册不是摆设，下面三处都依赖它才能工作：**

```text
用途              依赖它做什么                               没有它会怎样
──────────────────────────────────────────────────────────────────────────────
workspace:* 解析   apps/web 写 "@demo/ui": "workspace:*"   pnpm 不知道 @demo/ui 是本地的，
（最关键）         pnpm 在花名册里扫到 packages/ui 才         跑去 npm 下载 → 报 404 ❌
                  能软链过去 ✅
pnpm --filter     pnpm --filter @demo/web dev             找不到叫 @demo/web 的目标包
                  从花名册里定位到 apps/web
pnpm install      一次装好所有子包的依赖                     得进每个目录各装一遍
```

所以它是**整个 workspace 机制的总开关**：登记了哪些目录是本地包，"本地引用、过滤命令、批量安装"这一整套才成立。单包项目（第二节那种）没有跨包引用，自然就不需要这个文件。

1. 根 `package.json`：

```json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @demo/web dev",
    "build": "pnpm --filter @demo/web build"
  }
}
```

2. `packages/ui/package.json`（`main` 直接指向源码）：

```json
{
  "name": "@demo/ui",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "peerDependencies": { "react": "^18.0.0" }
}
```

3. `apps/web/package.json`（⭐ 用 `workspace:*` 引用本地共享包）：

```json
{
  "name": "@demo/web",
  "private": true,
  "scripts": { "dev": "vite", "build": "vite build" },
  "dependencies": {
    "@demo/ui": "workspace:*",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.23.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.2.0"
  }
}
```

`workspace:*` 的含义：依赖来自本仓库工作区，pnpm 把 `node_modules/@demo/ui` 软链到 `packages/ui`，**改库源码 app 里立刻生效，无需发包**。

应用里照常用包名引用：

```tsx
import { Button } from "@demo/ui";
```

### 为什么 `apps/` 要单独打包，`packages/` 却不用？

很多人会问：`apps/web` 跑 `vite build` 产出成品，那 `packages/ui` 为什么没有自己的 build 步骤？

一句话：**apps 是"终点"要拿去部署，必须产出成品；packages 是"原材料"，会被 app 吃进去一起打包，自己不单独出成品。**

```text
apps/web    ──vite build──▶  dist/（index.html + js/css）──▶ 部署上线
packages/ui ──不单独 build──▶  被 web 的 vite build 顺手一起 bundle 进 dist
```

关键在 `packages/ui/package.json` 的 `main` 指向**源码**而非 `dist`：

```text
"main": "./src/index.ts"
   → web 执行 vite build 时，遇到 import { Button } from "@demo/ui"
   → 顺着 main 找到 packages/ui/src（源码）
   → 把 ui 的源码和 web 自己的代码一起编译、一起 bundle
```

所以不是"packages 没被打包"，而是**它被 app 顺手一起打了**。这么设计的好处：

```text
├─ 改 ui 源码 → web 立刻热更新，不用先 build ui
├─ 类型/跳转能一路点进 ui 源码，调试方便
└─ 少维护一条构建流水线，不会出现"忘了 rebuild ui 用到旧版"
```

只有当这个库要**走出本仓库、给看不到它源码的人用**时，才需要自己先编译成成品：

```text
触发场景                         为什么必须单独 build
──────────────────────────────────────────────────────────────────
1. 发布到 npm 给外部团队/别的仓库   外部拿不到 .tsx 源码，得给编译好的 js + .d.ts
2. 消费方构建工具不处理 TS/JSX     得先把 ts 编译成 js 它才认
3. 超大仓库要构建提速             预编译 + 缓存（turborepo/nx），避免每次重编源码
```

这时 `main` 才会从 `./src/index.ts` 改成 `./dist/index.js`，并加一个自己的 build 脚本。

```text
            角色          要不要单独 build       main 指向
──────────────────────────────────────────────────────────────
apps/web    部署成品       ✅ 必须（产出 dist）    —（自己就是终点）
packages/ui 被引用的原料    ❌ 不用（跟 app 一起打）  ./src/index.ts（源码）
                          ⚠️ 除非要发 npm/给外部    （那时才改指 ./dist）
```

---

## 五、顺带：同一个 monorepo 也能做成 MPA（场景 D）

把 Vite 配成多入口，产出多个 `.html`，它们之间跳转就是整页刷新：

```ts
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin.html"),
      },
    },
  },
});
```

```text
SPA（场景 B）：1 个 html，多个 Route    →  切页不刷新、状态可共享
MPA（场景 D）：N 个 html，各自独立入口   →  切 html 整页刷新、状态不互通
```

印证核心结论：**代码组织（单仓/多仓）和部署形态（SPA/MPA）是正交的——同一个 monorepo，配 1 个 HTML 就是 SPA，配多入口就是 MPA。**

---

## 六、决策标尺

```text
只有 1 个应用、没东西要共享       →  单 package + 路径别名，别拆，最省事
共享代码只在 1 个 app 内用        →  直接 import（相对路径 / 别名）
共享代码要给 2+ app / 外部用      →  才拆成 apps/* + packages/* + workspace
```

| 你的情况 | 推荐结构 | 复杂度 |
| --- | --- | --- |
| 一个 SPA，自己用 | 单 `package.json` + 别名 | 几乎为 0 |
| 多个 SPA / 要抽公共组件库 | `apps/*` + `packages/*` + pnpm workspace | 中等，但省维护 |

**起步用单 package 最划算，等真出现"第二个 app / 要抽公共库"时再拆 `packages/` 也不迟。**
