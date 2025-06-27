在 JavaScript 中，fetch() 是现代浏览器提供的用于发起网络请求的 API。（fetch官网：https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch）

### 一、fetch() 核心功能
1. 发起异步网络请求（支持 GET/POST/PUT/DELETE 等）
2. 返回 Promise 对象，可使用 .then() 链式处理或 async/await
3. 灵活配置：支持设置请求头、请求体、超时控制等
4. 响应处理：提供 JSON/text/blob 等多种数据解析方式
5. 跨域控制：通过 mode 和 credentials 管理 CORS 行为


### 二、fetch的Get和Post请求
## 1、GET 请求示例
```js
// 基础 GET 请求
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) throw new Error('请求失败');
    return response.json(); // 解析为 JSON
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// 带参数的 GET 请求
const params = new URLSearchParams({ id: 123, type: 'test' });
fetch(`https://api.example.com/data?${params}`)
  .then(/* 处理同上 */)
```

## 2、POST请求示例
```js
// 发送 JSON 数据
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token' // 身份验证示例
  },
  body: JSON.stringify({ // 必须字符串化
    name: 'John',
    age: 30
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));

// 发送 FormData (文件上传等)
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('comment', 'Hello!');

fetch('https://api.example.com/upload', {
  method: 'POST',
  body: formData // 自动设置 Content-Type
})
```
