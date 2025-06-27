### 一、nextjs和react的关系
```bash
React（核心库）
├── React Router（客户端路由库）
└── Next.js（全栈框架，内置路由系统）
```

## 1、React 是什么？
定位：JavaScript UI 构建库（不是框架）
核心功能：
1. 组件化开发
2. 声明式渲染
3. 状态管理( 还有redux工具也可以进一步进行状态管理)
不包含路由、数据获取等完整应用能力，需要组合其他库才能构建完整应用。

## 2、React Router 是什么？
定位：专为 React 设计的客户端路由库
功能：
1. 实现 SPA（单页应用）的前端路由
2. 管理 URL 与组件的映射关系
3. 提供 <Link>, <Routes>, useNavigate() 等 API。
```jsx
// 使用 create-react-app 创建的项目中
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Link to="/about">关于</Link>
      <Routes>
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 3、Next.js 是什么？
定位：基于 React 的全栈框架
核心能力：
1. 内置文件系统路由（无需手动配置路由表）
2. 支持服务端渲染 (SSR)/静态生成 (SSG)
3. API 路由（Node.js 后端能力）
4. 自动代码分割/优化

```bash
# 文件结构即路由
src/pages/
  ├── index.tsx    →  /
  └── about.tsx    → /about
```
```jsx
// 内置的 <Link> 组件
import Link from 'next/link';

export default function Nav() {
  return <Link href="/about">关于</Link>;
}
```



### 二、为什么使用框架？
React 本身是一个用于构建用户界面的 JavaScript 库，它专注于视图层的渲染和组件化。在开发 Web 应用时，你可以选择只使用 React 而不使用任何框架，但随着项目复杂度增加，你通常需要引入其他库或框架来处理路由、状态管理、数据获取等问题。
## 1. **不使用框架（纯 React）**
   **适用场景**：
   - 小型项目或简单页面（如静态网站、简单的交互页面）
   - 学习 React 基础
   - 已有其他技术栈，仅需在部分页面使用 React
   **需要自行集成的功能**：
   - **路由**：使用 `react-router-dom`（最流行的路由库）
   - **状态管理**：使用 React 内置的 Context API 或引入 Redux/MobX 等
   - **数据获取**：使用 `fetch` 或 `axios` 自行封装
   - **构建工具**：使用 Webpack 或 Vite 自行配置
   - **样式方案**：CSS Modules、Styled Components 等
   **优点**：
   - 轻量，没有框架的约束
   - 完全掌控技术栈
   **缺点**：
   - 需要手动集成各种工具和库
   - 项目结构可能不够规范
   - 缺乏开箱即用的优化（如 SSR、静态导出等）


## 2. **Next.js（最流行的 React 框架）**
   **特点**：
   - **渲染方式灵活**：支持 SSR（服务端渲染）、SSG（静态生成）、CSR（客户端渲染）
   - **文件系统路由**：基于 `pages` 或 `app` 目录自动生成路由
   - **内置优化**：自动代码分割、图片优化、字体优化等
   - **API 路由**：在同一个项目中编写后端 API
   - **中间件支持**：请求处理中间件
   - **完善的插件生态**
   **适用场景**：
   - 需要 SEO 的网站（如博客、电商、营销页）
   - 全栈应用（前后端一体化）
   - 对性能要求高的项目
   **官方链接**：https://nextjs.org/



### 三、HMTL原生<a>和nextjs/React Router的<Link>
```bash
特性	   <a> 标签	                  <Link> 组件
页面刷新	整页刷新，状态丢失	         无刷新，状态保留
导航速度	较慢（重新加载所有资源）	  极快（仅加载差异部分）
预加载	    不支持	                   Next.js 自动预加载视口内链接
使用场景	外部链接 / 强制刷新	         应用内部导航
React状态   重置	                  保留
用户体验	传统页面跳转	            类似单页应用（SPA）的流畅体验
```

### 四、nextjs
前面提到了nextjs框架的优点，这里详细介绍一下。
## 1、路由
如果使用`纯react`的方式创建项目，一般使用react router实现路由，如下：
```jsx
// 安装：npm install react-router-dom
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

而使用nextjs，路由是根据文件路径自动生成的，如下：
```jsx
// 文件路径：pages/index.js
export default function Home() {
  return <h1>Home Page</h1>;
}
// 文件路径：pages/about.js
export default function About() {
  return <h1>About Page</h1>;
}
// 无需手动配置路由
```

## 2、SSG和SSR
1. SSG（静态生成）：getStaticProps
2. SSR（服务端渲染）：getServiceSideProps
3. ISR（增量静态再生）：revalidate参数
4. CRS（客户端渲染）：默认行为

Next.js 提供三种数据获取方法：
**getStaticProps (SSG - 静态生成)**
```js
// 构建时获取数据
export async function getStaticProps() {
  return {
    props: { /* 数据 */ }, 
    revalidate: 10, // 开启ISR
  };
}
```

**getServerSideProps (SSR - 服务端渲染)**
```js
// 每次请求时获取数据
export async function getServerSideProps(context) {
  // context包含请求参数、cookies等
  return {
    props: { /* 数据 */ },
  };
}
```

**getStaticPaths (动态路由SSG)**
```js
// 指定动态路由的预生成路径
export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    fallback: true, // 或 'blocking'
  };
}
```


例子：
**电商平台**
```js
// pages/products/[id].js
export async function getStaticPaths() {
  // 获取所有产品ID
  const res = await fetch('https://api.example.com/products');
  const products = await res.json();
  
  const paths = products.map(product => ({
    params: { id: product.id.toString() }
  }));
  
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // 根据ID获取产品数据
  const res = await fetch(`https://api.example.com/products/${params.id}`);
  const product = await res.json();
  
  return { 
    props: { product },
    revalidate: 60 // 60秒后刷新
   };
}
```
 在构建时（`next build`），Next.js 会执行以下步骤：
 1. 首先调用 `getStaticPaths` 函数，该函数返回一个对象，包含两个属性：
    - `paths`: 一个数组，指定哪些路径需要预渲染。数组中的每个元素是一个对象，包含 `params` 键，对应动态路由的参数（例如 `{ params: { id: '1' } }`）。
    - `fallback`: 布尔值或字符串，指定未在 `paths` 中返回的路径的处理方式。
 2. 对于 `paths` 数组中的每一个路径，Next.js 会调用 `getStaticProps` 函数，并将该路径的参数（即 `params` 对象）作为参数传入。
    - 在 `getStaticProps` 中，我们可以使用 `params.id` 来获取当前正在构建的产品ID，然后获取该产品的数据。
    - `getStaticProps` 返回 `props` 对象，这些数据将作为组件的 props。
 3. Next.js 会为每一个路径生成一个静态 HTML 文件。 因此，构建阶段：
   - `getStaticPaths` 先运行，确定有哪些路径需要生成页面。
   - 然后，对于每个路径，运行 `getStaticProps` 获取该页面的数据，并生成静态页面。


 **关于 `fallback` 的作用**：
   - 当 `fallback` 设置为 `false` 时：
        - 只有 `paths` 中指定的路径会被预渲染成静态页面。
        - 如果用户访问一个不在 `paths` 中的路径（例如 `/products/1000`），Next.js 会返回 404 页面。
        - 适用于：已知的、数量有限的静态页面。
   - 当 `fallback` 设置为 `true` 时：
        - `paths` 中指定的路径在构建时预渲染。
        - 未在 `paths` 中指定的路径不会返回 404，而是由 Next.js 在客户端请求时“按需”生成页面（在后台生成静态页面，并保存以便后续请求使用）。
        - 在页面生成期间，页面会显示一个“fallback”版本（例如，可以显示一个加载指示器）。
        - 当页面生成完成后，浏览器会接收到生成的页面。
        - 适用于：有大量静态页面，但不想在构建时全部生成（例如，有成千上万的产品，只预渲染一部分热门产品，其他产品按需生成）。
   - 当 `fallback` 设置为 `'blocking'` 时：
        - 与 `true` 类似，但不会立即返回 fallback 页面，而是等待页面生成完成（在服务器端生成）后再返回给客户端。
        - 用户不会看到加载状态，但需要等待更长时间（类似 SSR 的效果）。
        - 适用于：希望所有用户都看到完整页面，且可以接受首次访问稍慢的场景。


**关于 `revalidate`的作用**：
revalidate 是 Next.js 中实现增量静态再生 (Incremental Static Regeneration, ISR) 的核心配置项，它彻底改变了静态站点的更新机制。注意，**revalidate 的更新是关于服务端生成和提供 HTML 内容的更新机制，而不是指前端页面会自动刷新**。
下面用一个例子来说明：
 假设我们有一个新闻页面，设置 revalidate: 60（60秒）。
 - 用户A在 10:00:00 访问页面，服务器生成页面并缓存，同时记录生成时间。
 - 用户B在 10:00:30 访问页面，由于还在60秒内，直接返回缓存的页面。
 - 用户C在 10:01:05 访问页面（距离上次生成已经65秒，超过60秒），那么：
     1. 用户C立即得到的是缓存的旧页面（10:00:00生成的）。
     2. 同时，Next.js 在后台开始重新生成页面（调用 getStaticProps 获取最新数据，生成新的HTML）。
     3. 重新生成完成后（假设10:01:07完成），新的页面被缓存。
 - 用户D在10:01:08访问页面，将得到新生成的页面。
 注意：用户C在10:01:05看到的是旧页面，即使后台重新生成完成，他也不会自动看到新内容，除非他刷新页面（而刷新后，因为缓存已经更新，就会看到新内容）。



## 3、网络请求
网络请求并非next框架知识，这里也介绍一下，澄清他们之间的关系。fetch 不是特定框架的 API，而是一个现代浏览器原生提供的 JavaScript 网络请求接口，也是 Web 标准的一部分。使用方法如下：

# 3.1 原生fetch
1. 纯 JavaScript/浏览器环境
```js
// 浏览器中使用.then，IE11 等旧浏览器不支持 async/await
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

2. React或者Node.js 环境
```js
// Node.js v18+ 原生支持
const res = await fetch('https://api.example.com/data');
const data = await res.json();

// Node.js v17 及以下需要安装 node-fetch
import fetch from 'node-fetch';
```

# 3.2 nextjs增强fetch
Next.js 对 `fetch()` 的增强主要体现在它扩展了原生的 Web API `fetch`，添加了一些与静态生成（SSG）和服务端渲染（SSR）相关的特殊功能。这些增强功能在 Next.js 的服务端组件和渲染函数（如 `getStaticProps`、`getServerSideProps`）中特别有用。具体如下：

1. 自动缓存与去重
```js
// 原生 fetch 在多个组件中调用相同 API 时一个一个请求，Next.js 自动去重相同请求
const res1 = await fetch('https://api.example.com/data'); // 发送请求
const res2 = await fetch('https://api.example.com/data'); // 返回缓存结果
```
```js
// 组件A
const dataA = await fetch('/api/products');
// 组件B
const dataB = await fetch('/api/products'); // 使用缓存结果
// 即使在不同组件中，相同请求也只发送一次
```

2. 增量静态再生 (ISR) 集成
```js
// nextjs增加了revalidate、cache、tags等功能
const res = await fetch('https://api.example.com/products', {
  next: { 
    revalidate: 60 // 每60秒重新验证
  }
});
```

3. 相对路径自动解析
```js
// 自动解析为绝对路径，原fetch会报错
fetch('/api/data'); // => https://yourdomain.com/api/data

// 在 getStaticProps 中
export async function getStaticProps() {
  const res = await fetch('/api/data'); // 正确解析
  // ...
}
```

4. 缓存标签管理
```js
// 设置缓存标签，原生 fetch 无法按需更新特定缓存。
const res = await fetch('https://api.example.com/products', {
  next: { tags: ['products'] }
});

// 在API路由中按需更新
import { revalidateTag } from 'next/cache';

export async function POST(request) {
  // 更新数据库...
  revalidateTag('products'); // 使所有带此标签的缓存失效
  return Response.json({ success: true });
}
```

5. 高级缓存控制
```js
const res = await fetch('https://api.example.com/data', {
  cache: 'force-cache', // 强制缓存，这是原生的
  next: {
    cacheControl: 'public, max-age=3600, stale-while-revalidate=86400' // nextjs提供的
  }
});
```

6. 智能重试机制
```js
const res = await fetch('https://api.example.com/data', {
  next: {
    retry: {
      attempts: 3,    // 最大重试次数
      delay: 1000,    // 重试间隔(ms)
      factor: 2       // 指数退避因子 (1000, 2000, 4000)
    }
  }
});
```
[nextjs-fetch](/Users/code/Files/images/nextjs-fetch.png)
这里不全部列举了，总之nextjs在服务端调用fetch时会使用增强的fetch，在客户端则使用原生fetch。实现的方式是编译时AST 转换修改代码，构建时注入优化逻辑，来实现对fetch的增强。
