### 一、appRouter 是什么
## 1. 概念定位
`appRouter` 是 React Router v6.4+ 推出的 **Data Router（数据路由）API**，核心入口是 `createBrowserRouter` + `RouterProvider`。它把"路由配置"从 JSX 树搬到 **路由对象数组** 里，并把 **数据加载（loader）、数据变更（action）、错误边界（errorElement）、导航状态（useNavigation）** 全部下沉到路由层，由路由统一调度。

简单一句话：
 - `BrowserRouter`（旧版） = 路由 + 视图渲染
 - `appRouter`（新版） = 路由 + 视图 + 数据 + 错误 + 状态机

> 说明：Next.js 的 App Router 是另一套基于文件系统的服务端路由方案，本文聚焦的是 React Router 自身的 `createBrowserRouter` 这条 "App Router" 路线。

## 2. 与 reactRouter（BrowserRouter）的本质区别
```bash
维度              BrowserRouter（旧）            createBrowserRouter（新）
-----------------------------------------------------------------------------
配置方式          JSX 嵌套 <Route>               JS 对象数组 / createRoutesFromElements
数据获取          组件内 useEffect/useSWR        路由层 loader，跳转前先取数
数据变更          手写 fetch + 状态管理          路由层 action + <Form>
错误处理          手动 try/catch + 错误边界      路由级 errorElement + useRouteError
导航中状态        需要自行维护 loading           内置 useNavigation().state
跳转时机          先渲染→后取数（瀑布）          先取数→再渲染（并行预取）
代码分割          React.lazy + Suspense          路由对象 lazy 字段，按需加载组件+loader+action
SSR              需自行处理 matchPath           官方 createStaticHandler/createStaticRouter
```

*核心收益*：
✅ 消除"渲染→useEffect→fetch→loading 闪烁"瀑布
✅ 路由跳转 = 数据准备好再切视图
✅ 错误/加载/重定向语义统一，组件聚焦 UI


### 二、最小可运行示例
## 1. 基本结构
```jsx
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'products/:id',
        element: <ProductDetail />,
        loader: async ({ params }) => {
          const res = await fetch(`/api/products/${params.id}`);
          if (!res.ok) throw new Response('Not Found', { status: 404 });
          return res.json();
        },
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

function Root() {
  return (
    <div>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/products/1">产品 1</Link>
      </nav>
      {/* 子路由出口 */}
      <Outlet />
    </div>
  );
}
```

1. `createBrowserRouter`：基于 History API 创建一个**路由实例对象**，参数是路由配置数组。
2. `RouterProvider`：把路由实例注入 React，**替代** 旧版 `<BrowserRouter><Routes>...</Routes></BrowserRouter>` 这一整层。
3. `element`：当前路由匹配时渲染的组件，子路由通过父组件里的 `<Outlet />` 渲染。
4. `index: true`：父路径默认子路由（相当于父路径"自身"匹配时显示什么）。
5. `errorElement`：该层抛出的错误（loader/action/render 抛错、404 等）会冒泡到最近的 `errorElement`，避免整页白屏。

## 2. 也支持 JSX 写法（迁移友好）
```jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<RootError />}>
      <Route index element={<Home />} />
      <Route
        path="products/:id"
        element={<ProductDetail />}
        loader={productLoader}
      />
    </Route>
  )
);
```
> 这种写法只是语法糖，底层依然是路由对象数组。它让从 `BrowserRouter` 迁移过来的项目几乎"零改动"。


### 三、核心 API 详解
## 1. loader：路由级数据加载
*作用*：在路由组件渲染**之前**执行，返回的数据通过 `useLoaderData()` 在组件里读取。

```jsx
import { useLoaderData } from 'react-router-dom';

const productLoader = async ({ params, request }) => {
  // request.signal 用于取消请求（用户快速跳走时自动 abort）
  const res = await fetch(`/api/products/${params.id}`, {
    signal: request.signal,
  });
  if (!res.ok) throw new Response('加载失败', { status: res.status });
  return res.json();
};

function ProductDetail() {
  const product = useLoaderData(); // 数据已就绪，无需 loading 态
  return <h1>{product.name}</h1>;
}
```

*优势*：
 - **避免请求瀑布**：父子路由的 loader **并行**执行
 - **跳转即取数**：URL 一变就开始 fetch，组件还没挂载请求已发出
 - **天然支持取消**：`request.signal` 配合 fetch 自动取消过期请求

## 2. action：路由级数据变更（写操作）
*作用*：处理表单提交 / 数据修改，提交完成后**自动重新执行当前路由的 loader 刷新数据**。

```jsx
import { Form, useActionData, redirect } from 'react-router-dom';

const createProductAction = async ({ request }) => {
  const formData = await request.formData();
  const res = await fetch('/api/products', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    // 返回错误数据，组件用 useActionData 拿到（不跳转）
    return { error: '创建失败' };
  }
  // 重定向到新页面（也可以 return null 留在当前页）
  return redirect(`/products/${(await res.json()).id}`);
};

function NewProduct() {
  const actionData = useActionData();
  return (
    <Form method="post">
      <input name="name" />
      <button type="submit">创建</button>
      {actionData?.error && <p>{actionData.error}</p>}
    </Form>
  );
}
```

*关键点*：
 - `<Form>` 替代原生 `<form>`，提交不会刷新整页，而是触发 action
 - action 返回 `redirect()` 即触发跳转
 - action 执行完，**所有正在显示的路由的 loader 会自动重新执行**（数据自动同步）

## 3. errorElement + useRouteError：路由级错误边界
*作用*：loader / action / 渲染抛出的任何错误都会被路由捕获，渲染最近的 `errorElement`。

```jsx
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

function RootError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    // loader/action 中 throw new Response(...) 抛出的
    return <h1>{error.status} {error.statusText}</h1>;
  }
  // 普通 JS 错误
  return <h1>出错了：{error.message}</h1>;
}
```

*冒泡机制*：错误就近匹配 `errorElement`，没找到就一路向上冒泡到根。所以**只在根路由放一个兜底，再在关键页面放局部 errorElement** 就能实现"局部出错不影响整体"。

## 4. useNavigation：全局导航状态机
```jsx
import { useNavigation } from 'react-router-dom';

function Root() {
  const navigation = useNavigation();
  // navigation.state: 'idle' | 'loading' | 'submitting'
  return (
    <div>
      {navigation.state === 'loading' && <TopProgressBar />}
      <Outlet />
    </div>
  );
}
```
跳转时（loader 还在跑）`state === 'loading'`，提交表单时 `state === 'submitting'`。可以用它做**全局顶部进度条**或**禁用按钮**，无需自己维护 loading 状态。

## 5. useNavigate / Navigate：命令式与声明式跳转
和旧版用法一致，仍然可用：
```jsx
const navigate = useNavigate();
navigate('/login', { replace: true, state: { from: location } });

// 声明式
return <Navigate to="/login" replace />;
```


### 四、路由配置对象字段速查
```bash
字段             类型/含义                                  说明
---------------------------------------------------------------------------------------
path            string                                    匹配路径，支持 :param、*
index           boolean                                   父路径默认子路由（不可与 path 共用）
element         ReactElement                              匹配时渲染的 UI
errorElement    ReactElement                              本层错误兜底
loader          ({params,request}) => data                渲染前数据预取
action          ({params,request}) => data | Response     表单/写操作处理
shouldRevalidate ({...}) => boolean                       控制 loader 是否重新执行
children        RouteObject[]                             嵌套子路由（父组件需放 <Outlet />）
lazy            () => Promise<RouteObject>                懒加载整段路由（含 element/loader/action）
loader/action 中可 throw new Response(...)               触发 errorElement
loader/action 中可 return redirect('/x')                  触发跳转
handle          any                                       自定义元数据，可被 useMatches 读到（做面包屑等）
```


### 五、嵌套路由与布局
## 1. Outlet 与父子布局
```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,         // 共享布局
    loader: dashboardLoader,              // 父 loader 先跑
    children: [
      { index: true, element: <Overview /> },
      { path: 'orders', element: <Orders />, loader: ordersLoader },
      { path: 'orders/:id', element: <OrderDetail />, loader: orderLoader },
    ],
  },
]);

function DashboardLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <main>
        <Outlet /> {/* 子路由在这里渲染 */}
      </main>
    </div>
  );
}
```
*执行顺序*：URL 命中 `/orders/1` → `dashboardLoader` 和 `orderLoader` **并行执行** → 数据全部就绪后**一次性**渲染整棵树，避免逐层 loading。

## 2. useMatches + handle 做面包屑
```jsx
const routes = [
  {
    path: '/',
    handle: { crumb: () => <Link to="/">首页</Link> },
    children: [
      {
        path: 'products/:id',
        handle: { crumb: (data) => <span>{data.name}</span> },
        loader: productLoader,
        element: <ProductDetail />,
      },
    ],
  },
];

function Breadcrumbs() {
  const matches = useMatches();
  return (
    <nav>
      {matches
        .filter((m) => m.handle?.crumb)
        .map((m, i) => <span key={i}>{m.handle.crumb(m.data)}</span>)}
    </nav>
  );
}
```


### 六、代码分割：路由级 lazy
旧版只能 `lazy(() => import())` 拆 element，loader/action 还是同步加载。新版直接拆**整段路由**：

```jsx
const router = createBrowserRouter([
  {
    path: 'products/:id',
    lazy: async () => {
      // 这里返回的对象会与当前路由对象合并
      const { ProductDetail, productLoader, productAction } = await import(
        './pages/ProductDetail'
      );
      return {
        element: <ProductDetail />,
        loader: productLoader,
        action: productAction,
      };
    },
  },
]);
```
*收益*：
 - 路由文件没访问过就不打入主包
 - loader 和组件**一起**懒加载，首屏只下当前页代码
 - 切路由时网络层自动并行：下载 chunk + 跑 loader 同时进行


### 七、数据变更进阶：useFetcher
`<Form>` + action 适合"提交后跳转"的场景。如果想**不跳转地**异步操作（如点赞、加购），用 `useFetcher`：

```jsx
import { useFetcher } from 'react-router-dom';

function LikeButton({ id }) {
  const fetcher = useFetcher();
  const liked = fetcher.formData
    ? fetcher.formData.get('liked') === 'true'   // 乐观 UI
    : data.liked;

  return (
    <fetcher.Form method="post" action={`/products/${id}/like`}>
      <button name="liked" value={!liked}>
        {liked ? '取消点赞' : '点赞'}
      </button>
    </fetcher.Form>
  );
}
```
特点：
 - 不影响当前页面的 navigation 状态
 - `fetcher.formData` 可读，天然支持**乐观更新**
 - 提交完成自动 revalidate 当前页 loader


### 八、defer：流式加载（边出 UI 边等数据）
对**慢接口**包一层 `defer`，让快数据先渲染，慢数据出 loading：

```jsx
import { defer, Await, useLoaderData } from 'react-router-dom';
import { Suspense } from 'react';

const productLoader = ({ params }) => {
  const fast = fetch(`/api/products/${params.id}`).then((r) => r.json()); // 等
  const slow = fetch(`/api/products/${params.id}/reviews`).then((r) => r.json()); // 不等
  return defer({
    product: await fast,    // 关键数据，等
    reviews: slow,          // 非关键，是个 Promise
  });
};

function ProductDetail() {
  const { product, reviews } = useLoaderData();
  return (
    <>
      <h1>{product.name}</h1>
      <Suspense fallback={<ReviewsSkeleton />}>
        <Await resolve={reviews} errorElement={<p>评论加载失败</p>}>
          {(reviews) => <ReviewList items={reviews} />}
        </Await>
      </Suspense>
    </>
  );
}
```


### 九、SSR 支持：createStaticHandler / createStaticRouter
官方为 SSR 提供了配套 API，解决了旧版 `BrowserRouter` 时代要自己拼 `matchPath` 的痛点：

```javascript
// 服务端
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';
import { routes } from './shared/routes'; // 与客户端共用

app.get('*', async (req, res) => {
  const handler = createStaticHandler(routes);
  // 自动跑匹配路由的 loader/action,得到 context
  const context = await handler.query(
    new Request(`http://x${req.url}`, { method: req.method })
  );
  if (context instanceof Response) {
    return res.redirect(context.headers.get('Location'));
  }
  const router = createStaticRouter(handler.dataRoutes, context);
  const html = renderToString(
    <StaticRouterProvider router={router} context={context} />
  );
  res.send(`<!DOCTYPE html>${html}`);
});

// 客户端 hydrate
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});
hydrateRoot(root, <RouterProvider router={router} />);
```
*关键点*：
 - **路由配置一份**，服务端、客户端共用同一个 `routes` 数组
 - loader 在服务端先跑，结果通过 `hydrationData` 注水到客户端，避免双端重复请求
 - 这也是 Remix 框架的底层路由机制


### 十、与旧版（BrowserRouter）的迁移建议
## 1. 渐进迁移路径
```bash
阶段             改动                                     收益
-------------------------------------------------------------------------
阶段一    入口换成 createBrowserRouter +              获得 errorElement、useNavigation
         createRoutesFromElements（JSX 不变）         几乎零改动
阶段二    把 useEffect 里的 fetch 抽到 loader         消除请求瀑布、自动取消
阶段三    表单 fetch 改用 <Form> + action            数据自动 revalidate
阶段四    React.lazy 改为路由 lazy 字段              组件+loader 一起懒加载
```

## 2. 不要混用的两个坑
```bash
错误用法                                            正确用法
-----------------------------------------------------------------------------
RouterProvider 内再套 BrowserRouter               只能有一个路由器
loader 里 throw 普通字符串/数字                    throw new Error 或 new Response
组件内 useEffect 里再发一遍 loader 已经请求的数据   直接用 useLoaderData
```


### 十一、什么时候选 appRouter
```bash
场景                                       推荐
-----------------------------------------------------------
中后台 / 表单密集型应用                    ✅ 强烈推荐 appRouter（loader/action 收益巨大）
SSR / 同构应用                            ✅ appRouter（官方 createStaticHandler）
极简 SPA、几乎没有数据请求                  ☑️ BrowserRouter 也够用
项目用了 Remix / Next.js                   直接用框架内置路由
存量老项目，短期无重构计划                  ☑️ 保留 BrowserRouter，新增模块用 appRouter
```

*一句话总结*：`appRouter`（Data Router）把"路由 + 数据 + 错误 + 加载状态"做成统一状态机，让组件回归"纯 UI"，是 React 路由从"渲染库"走向"应用框架"的关键一步。
