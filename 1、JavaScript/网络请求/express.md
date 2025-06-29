fetch和axios是发起网络请求，而express则是在nodejs后端接收和处理网络请求。我们首先看看使用原生nodejs响应服务请求。

## 1. 原生 Node.js HTTP 处理
原生http处理使用`createService`来创建 HTTP 服务器，
```js
// Node.js 自带了一些核心模块，比如 `http`、`url`、`fs`、`path`等，可以直接通过 `require` 引入
const http = require('http');
const url = require('url');

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  
  // 1. 处理 GET 请求
  if (req.method === 'GET') {
    if (pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Home Page');
    } 
    else if (pathname === '/about') {
      // 处理查询参数
      const name = query.name || 'Guest';
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `Hello ${name}` }));
    }
    else {
      res.writeHead(404);
      res.end('Not Found');
    }
  }
  
  // 2. 处理 POST 请求
  else if (req.method === 'POST') {
    if (pathname === '/echo') {
      let body = '';
      
      // 手动收集请求体数据流
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      // 数据接收完毕
      req.on('end', () => {
        try {
          // 尝试解析 JSON
          const data = JSON.parse(body);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            received: true, 
            data 
          }));
        } catch (error) {
          res.writeHead(400);
          res.end('Invalid JSON');
        }
      });
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  }
  
  // 3. 处理其他 HTTP 方法
  else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
});

// 启动服务器
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## 2、Express.js 实现（使用框架）
```js
// express 是一个第三方包，需要额外安装依赖
const express = require('express');
const app = express();

// 中间件：自动解析 JSON 请求体
app.use(express.json());

// 1. 处理 GET 请求
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/about', (req, res) => {
  // 自动处理查询参数
  const name = req.query.name || 'Guest';
  res.json({ message: `Hello ${name}` });
});

// 2. 处理 POST 请求
app.post('/echo', (req, res) => {
  // 自动解析的请求体数据
  res.json({ 
    received: true, 
    data: req.body 
  });
});

// 3. 处理未匹配路由 (404)
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// 4. 统一错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// 启动服务器
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

**关键对比分析：**
```bash
功能	           原生 Node.js	                           Express.js
路由处理	   手动解析 URL 和 method	               声明式路由 (app.get(), app.post())
查询参数	   手动解析 url.parse()	                   自动解析 (req.query)
请求体解析	   手动处理数据流 + JSON 解析	             一行中间件 (express.json())
响应处理	   手动设置 headers + res.end()	           智能方法 (res.send(), res.json())
404处理	      在每个分支手动判断	                    统一中间件处理
错误处理	   需要 try/catch 包裹	                   统一错误处理中间件
```