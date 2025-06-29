Axios 是一个基于 Promise 的 HTTP 客户端，用于浏览器和 Node.js。它提供了简洁的 API 和强大的功能，成为现代 Web 开发中最受欢迎的 HTTP 请求库之一。

### 一、引入
**CDN 引入（最简单方式）：，适合模拟测试**
```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```
**引入axios依赖，企业生产使用**
```js
import axios from 'axios'; // ES 模块
// 或
const axios = require('axios'); // CommonJS
```


### 二、请求示例
```js
// GET 请求
axios.get('https://api.example.com/posts')
  .then(response => {
    console.log('获取数据成功:', response.data);
  })
  .catch(error => {
    console.error('请求失败:', error);
  });

// POST 请求
axios.post('https://api.example.com/users', {
    name: 'John Doe',
    email: 'john@example.com'
  })
  .then(response => {
    console.log('用户创建成功:', response.data);
  });
```

从这里可以看出，axios的请求方式有其对应的方法，不像fetch那样通过参数`method`来表示get还是post。Axios 为所有 HTTP 方法提供了别名：
```js
// 常用方法
axios.get(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
axios.delete(url[, config])

// 其他方法
axios.head(url[, config])
axios.options(url[, config])
axios.request(config)
```

### 三、功能
## 3.1 并发
使用 axios.all() 和 axios.spread() 处理并发请求：
```js
const getUser = axios.get('/user/123');
const getPosts = axios.get('/user/123/posts');

axios.all([getUser, getPosts])
  .then(axios.spread((userResponse, postsResponse) => {
    console.log('用户数据:', userResponse.data);
    console.log('帖子数据:', postsResponse.data);
  }))
  .catch(error => {
    console.error('并发请求失败:', error);
  });
```

## 3.2 创建实例与全局配置
```js
// 创建自定义实例
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {'X-Custom-Header': 'foobar'}
});

// 使用实例发送请求
api.get('/products')
  .then(response => console.log(response.data));

// 全局默认配置
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';
```

## 3.3 请求配置选项
Axios 支持丰富的配置选项：
```js
axios.get('/user', {
  params: { ID: 12345 }, // 查询参数
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  responseType: 'json', // 响应数据类型 (json, blob, arraybuffer, document)
  timeout: 1000, // 超时时间（毫秒）
  withCredentials: true, // 跨域请求时发送 cookies
  auth: { // HTTP 基本认证
    username: 'janedoe',
    password: 's00pers3cret'
  },
  onUploadProgress: progressEvent => { // 上传进度
    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    console.log(`上传进度: ${percent}%`);
  },
  onDownloadProgress: progressEvent => { // 下载进度
    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    console.log(`下载进度: ${percent}%`);
  }
});
```

这里不对axios做全面的介绍了，具体可以看官网。



### 四、fetch VS axios
```bash
特性	               Axios	                   Fetch
浏览器支持	        需要 polyfill	            现代浏览器原生支持
Node.js支持	          原生支持	        Node.js v17及以下需安装node-fetch
请求取消	           内置支持	               使用 AbortController
超时处理	           内置支持	                   需要手动实现
拦截器	           请求/响应拦截器	                  不支持
自动JSON转换	      自动处理	                需要手动调用 .json()
错误处理	       自动处理 HTTP 错误	         需手动检查响应状态
进度跟踪	           内置支持	                    有限支持
CSRF防护	          内置支持	                 需要手动实现
包大小	          ~4.5KB (gzipped)	            0KB (原生 API)
```
