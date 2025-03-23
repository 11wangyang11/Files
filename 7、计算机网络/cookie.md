### 一、Cookie简介
## 1、定义与作用
“Cookie”是一种由服务器发送并存储在客户端（通常是浏览器）上的小型数据文件，用于在 HTTP 请求之间保持状态和传递信息。由于 HTTP 协议是无状态的，服务器无法直接知道同一个用户在不同请求中的身份和状态。“Cookie”的引入解决了这一问题，使得服务器能够在不同请求之间保持用户状态。比如：

# 1.会话管理：
- **用户登录状态**：“Cookie”常用于保持用户的登录状态，避免用户每次访问页面都需要重新登录。
- **购物车信息**：在电子商务网站中，“Cookie”可以用于存储用户的购物车信息。
# 2、个性化设置：
- **用户偏好**：“Cookie”可以存储用户的语言选择、主题设置等偏好，使得用户在不同会话中保持一致的体验。
# 3、跟踪和分析：
- **用户行为分析**：“Cookie”可以用于跟踪用户在网站上的行为，帮助网站运营者了解用户的访问习惯和需求。
- **广告投放**：“Cookie”可以用于记录用户的浏览历史，提供个性化的广告投放。


## 2、Cookie的基本结构
一个典型的Cookie包含以下几个部分：
1. 名称（Name）：Cookie的名称。
2. 值（Value）：Cookie的值。
3. 域（Domain）：Cookie所属的域名。
4. 路径（Path）：Cookie的适用路径。
5. 过期时间（Expires）或最大存活时间（Max-Age）：Cookie的有效期。
6. 安全标志（Secure）：指定Cookie只能通过HTTPS传输。
7. HttpOnly标志：指定Cookie不能通过JavaScript访问，增加安全性。
8. SameSite标志：防止跨站请求伪造（CSRF）攻击。

**示例**
```http
Set-Cookie: sessionId=abc123; Domain=example.com; Path=/; Expires=Wed, 09 Jun 2023 10:18:14 GMT; Secure; HttpOnly; SameSite=Strict
```


## 3、Cookie的存储生命周期
“Cookie”的存储和生命周期取决于其类型和属性设置。主要有两种类型的“Cookie”：“会话Cookie”（Session Cookie）和“持久Cookie”（Persistent Cookie）。它们的行为在浏览器中有所不同。
# 1、会话Cookie（Session Cookie）
 - **存储位置**：会话Cookie存储在浏览器的内存中。
 - **生命周期**：会话Cookie在浏览器会话期间有效。当用户关闭浏览器或浏览器标签页时，这些Cookie会被删除。
 - **用途**：通常用于存储临时信息，如用户会话数据。
```http
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict 
```
这个“Cookie”没有设置“Expires”或“Max-Age”属性，因此它是一个会话“Cookie”。当用户关闭浏览器或浏览器标签页时，这个“Cookie”会被删除。

# 2、持久Cookie（Persistent Cookie）
 - **存储位置**：持久Cookie存储在浏览器的硬盘中。
 - **生命周期**：持久Cookie具有特定的过期时间（通过Expires或Max-Age属性设置）。在过期时间之前，这些Cookie会一直保留，即使用户关闭了浏览器或计算机。
 - **用途**：通常用于存储长期信息，如用户偏好设置、登录状态等。
 ```http
 Set-Cookie: userId=789xyz; Max-Age=3600; HttpOnly; Secure; SameSite=Strict
 ```
这个Cookie设置了Max-Age=3600，表示它将在3600秒（即1小时）后过期。即使用户关闭浏览器，这个Cookie在1小时内仍然有效，直到过期时间到达。

### 二、Cookie实例
这里以`nodejs`为例，具体介绍一下`http`请求中，如何使用“Cookie”。首先，Cookie的设置和使用涉及到服务器和客户端之间的交互，具体过程如下：

## 1、设置Cookie
**触发条件**：当用户首次访问网站或执行特定操作（如登录）时，服务器需要记录用户状态。Cookie是**服务器主动发送给浏览器**的，目的是让浏览器存储一段用于标识用户或记录状态的数据。
**操作流程**：
1. 服务器生成Cookie：服务器根据业务逻辑生成一个唯一的标识符（如 sessionId=abc123）；
2. 服务器发送Cookie：服务器在HTTP响应头中使用Set-Cookie字段来设置Cookie；
3. 浏览器存储Cookie：浏览器接收到响应后，会根据Set-Cookie字段的内容在客户端存储Cookie。

## 2、使用Cookie
**触发条件**：用户后续访问同一网站时，浏览器需要告知服务器用户身份。Cookie是**浏览器自动发送给服务器**的，目的是让服务器识别用户身份或恢复会话状态。
**操作流程**：
1. 浏览器检查Cookie：根据访问的 URL（如 https://example.com/profile），浏览器查找匹配的 Cookie（域名、路径一致）；
2. 自动附加Cookie：浏览器将匹配的 Cookie 添加到 HTTP 请求头的 Cookie 字段中；
3. 服务器读取 Cookie：服务器解析请求头中的 Cookie，识别用户身份（如根据 sessionId=abc123 查询用户数据）。

其次，这里额外提一点。在 Web 开发中，前端也是可以通过 JavaScript 直接调用 document.cookie 来设置 Cookie，但是仅针对当前域名下的Cookie，且无法设置 HttpOnly。后面，我们会在web网络安全中详细介绍cookie的安全相关配置。

**示例**

```js
const http = require('http');

// 创建服务器
const server = http.createServer((req, res) => {
  // 检查是否存在特定的Cookie
  const cookies = req.headers.cookie;
  const hasSessionCookie = cookies && cookies.includes('sessionId=abc123');

  if (!hasSessionCookie) {
    // 如果没有特定的Cookie，则设置Cookie
    res.setHeader('Set-Cookie', [
      'sessionId=abc123; HttpOnly; Secure; SameSite=Strict',
      'userId=789xyz; Max-Age=3600'
    ]);

    // 设置响应头和状态码
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<html><body><p>Cookie has been set! Please refresh the page or visit another path to check cookies.</p></body></html>');
  } else {
    // 如果存在特定的Cookie，则读取并显示
    console.log('Received cookies:', cookies);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<html><body><p>Received cookies: ${cookies}</p></body></html>`);
  }
});

// 监听端口3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```





