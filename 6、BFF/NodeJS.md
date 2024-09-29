todo。。。
Node.js 是一个基于 Chrome V8 JavaScript 引擎的 JavaScript 运行时环境。它允许开发者在服务器端运行 JavaScript 代码，从而使用同一种语言编写前端和后端代码。Node.js 的非阻塞 I/O 和事件驱动架构使其非常适合构建高性能、可扩展的网络应用。

### 一、Node.js 的主要特点
# 1、非阻塞 I/O：
 - Node.js 使用事件驱动、非阻塞 I/O 模型，使其非常适合处理高并发请求。
 - Node.js的I/O操作（如文件读写、网络请求）都是非阻塞的，这意味着I/O操作不会阻塞主线程。相反，I/O操作会被异步执行，当操作完成时，相关的回调函数会被放入事件队列中等待执行。这种模型不会阻塞其他操作，提示性能和响应速度。

# 2、事件驱动架构：
 - Node.js 的核心是一个事件循环，通过事件和回调机制来处理异步操作。
 - 这种架构使得 Node.js 可以高效地处理大量并发连接，而不会因为等待 I/O 操作而阻塞。

# 3、单线程：
 - Node.js 运行在单个线程中，但通过事件循环和异步 I/O 操作，可以有效地管理多个并发连接。
 - 这种设计简化了开发过程，因为开发者不需要担心线程同步问题。传统的多线程模型是通过为每个请求创建一个新的线程来实现并发处理的。这种方法确实可以提高系统的并发能力，但也有一些缺点：
 1. 资源消耗大：每个线程都需要占用一定的系统资源（内存、CPU等），在高并发情况下，创建和管理大量线程会导致资源消耗巨大。
 2. 线程切换开销：操作系统在不同线程之间切换时需要进行上下文切换，这会带来额外的开销，影响系统性能。
 3. 复杂性：多线程编程需要处理线程同步、死锁等问题，这增加了开发和维护的复杂性。
 而Node.js是单线程，通过事件循环来管理并发请求。事件循环不断检查事件队列，如果有事件（如I/O操作完成）需要处理，就调用相应的回调函数。

# 4、跨平台：
 - Node.js 可以在多个操作系统上运行，包括 Windows、Linux 和 macOS。
 - 这种跨平台的特性使得开发者可以在不同环境中轻松部署和运行 Node.js 应用。

# 5、丰富的生态系统：
 - Node.js 拥有一个庞大的包管理器（npm），提供了丰富的第三方模块和库，简化了开发过程。
 - 开发者可以通过 npm 轻松安装和管理依赖项，快速构建功能强大的应用。

## Node.js 的应用场景

# 1、Web 应用：
 - Node.js 非常适合构建高性能的 Web 应用，如实时聊天应用、社交网络、内容管理系统等。
 - 通过 Express.js 等框架，可以快速构建和部署 Web 应用。

# API 服务：
 - Node.js 可以用来构建 RESTful API 和 GraphQL API，提供高效的数据接口。
 - 由于其非阻塞 I/O 特性，Node.js 可以高效处理大量并发请求，非常适合构建 API 服务。

# 实时应用：
 - Node.js 非常适合构建实时应用，如在线游戏、实时协作工具、实时数据分析等。
 - 通过 WebSocket 等技术，可以实现低延迟的实时通信。

# 微服务架构：
 - Node.js 可以用于构建微服务架构，通过拆分单一应用为多个独立的服务，提高系统的可扩展性和可维护性。
 - 通过 Docker 等容器技术，可以轻松部署和管理 Node.js 微服务。

## 结论
Node.js 是一个强大的 JavaScript 运行时环境，通过非阻塞 I/O 和事件驱动架构，提供了高性能和高并发处理能力。它的丰富生态系统和跨平台特性，使得开发者可以轻松构建和部署各种类型的应用，包括 Web 应用、API 服务、实时应用和微服务架构。Node.js 的出现，使得 JavaScript 不再局限于前端开发，成为全栈开发的重要工具。

### 二、NodeJS内置模块
Node.js 提供了一系列内置模块，这些模块涵盖了文件系统操作、网络通信、数据处理等多种功能，帮助开发者快速构建高效的服务器端应用。以下是一些常用的内置模块：

## 1、文件系统模块 (fs)
- 功能：用于文件系统操作，如读取、写入、删除文件和目录等。
- 示例： 

```js
const fs = require('fs');

// 读取文件
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// 写入文件
fs.writeFile('example.txt', 'Hello, Node.js!', (err) => {
  if (err) throw err;
  console.log('File has been saved!');
});
```
## 2、HTTP 模块 (http)
- 功能：用于创建 HTTP 服务器和客户端，处理 HTTP 请求和响应。
- 示例： 

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
```

## 3、 路径模块 (path)
- 功能：用于处理和转换文件路径。
- 示例： 

```js
const path = require('path');

// 获取文件名
console.log(path.basename('/foo/bar/baz/asdf/quux.html')); // 输出: 'quux.html'

// 获取目录名
console.log(path.dirname('/foo/bar/baz/asdf/quux.html')); // 输出: '/foo/bar/baz/asdf'

// 解析路径
console.log(path.parse('/foo/bar/baz/asdf/quux.html'));
```

## 4、 URL 模块 (url)
- 功能：用于解析和格式化 URL。
- 示例：
```js
const url = require('url');

const myURL = new URL('https://example.org:8080/foo/bar?name=abc#hash');
console.log(myURL.hostname); // 输出: 'example.org'
console.log(myURL.pathname); // 输出: '/foo/bar'
console.log(myURL.searchParams.get('name')); // 输出: 'abc'
```

## 5、 事件模块 (events)
- 功能：提供事件驱动编程的支持，可以创建和处理自定义事件。
- 示例：
```js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

// 监听事件
myEmitter.on('event', () => {
  console.log('An event occurred!');
});

// 触发事件
myEmitter.emit('event');
```

## 6、 流模块 (stream)
- 功能：用于处理流数据，如读取和写入文件流、网络流等。
- 示例：

```js
const fs = require('fs');

// 创建可读流
const readableStream = fs.createReadStream('example.txt', 'utf8');

// 处理数据
readableStream.on('data', (chunk) => {
  console.log(chunk);
});
```

## 7、 缓冲区模块 (buffer)
- 功能：用于处理二进制数据。
- 示例：
```js
const buf = Buffer.from('Hello, World!', 'utf8');

console.log(buf.toString('hex')); // 输出: '48656c6c6f2c20576f726c6421'
console.log(buf.toString('base64')); // 输出: 'SGVsbG8sIFdvcmxkIQ=='
```
## 8、 加密模块 (crypto)
- 功能：提供加密功能，如生成哈希、加密和解密数据等。
- 示例：
```js
const crypto = require('crypto');

// 生成哈希
const hash = crypto.createHash('sha256').update('Hello, World!').digest('hex');
console.log(hash); // 输出: 哈希值
```

## 9、 操作系统模块 (os)
- 功能：提供与操作系统相关的信息和功能，如获取系统内存、CPU 信息等。
- 示例：
```js
const os = require('os');

console.log(os.platform()); // 输出: 操作系统平台
console.log(os.cpus()); // 输出: CPU 信息
console.log(os.totalmem()); // 输出: 总内存
```

## 10、 子进程模块 (child_process)
- 功能：用于创建和控制子进程，执行系统命令。
- 示例：
```js
const { exec } = require('child_process');

exec('ls -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

