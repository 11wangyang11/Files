import * as http from "http";
import axios from "axios";
import { resolve } from "path";
import { rejects } from "assert";

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    // 修正：使用 === 而非 =
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      let data;
      try {
        data = JSON.parse(body); // 尝试解析JSON
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Data received", data })); // 返回解析后的数据
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" }); // 解析失败返回400
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  } else {
    res.writeHead(405, { "Content-Type": "application/json" }); // 非POST方法返回405
    res.end(JSON.stringify({ error: "Method not allowed" }));
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Server running on http://localhost:3000");
});

async function postRequest() {
  try {
    const response = await axios.post("http://127.0.0.1:3000/", {
      title: "nihao",
    });
    return response;
  } catch (err) {}
}

class Controller {
  private maxCount; // 最大运行任务数目
  private queue; // 总任务
  private running; // 当前运行的任务
  constructor(maxCount) {
    this.maxCount = maxCount;
  }

  async excute(task, resolve, reject) {
    try {
      const response = await task();
      resolve(response);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.next();
    }
  }
  next() {
    while (this.running.lenth < this.maxCount && this.queue.length) {
      const { task, resolve, reject } = this.queue.shift();
      this.excute(task, resolve, reject);
    }
  }
  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push(task, resolve, reject);
      this.next();
    });
  }
}

function request(count) {
  const controller = new Controller(count);
  return (url) => {
    const task = new Promise((resolve) => {
      setTimeout(() => {
        console.log(url);
        resolve({});
      }, 100);
    });
    return controller.add(task);
  };
}

const req = request(3);
req("https://www.baidu.com").then(() => {
  console.log("11111");
});
req("https://www.baidu.com").then(() => {
  console.log("22222");
});
req("https://www.baidu.com").then(() => {
  console.log("33333");
});
req("https://www.baidu.com").then(() => {
  console.log("44444");
});

Promise.newAll = function (promises) {
  const result = [];
  let size = promises.length || promises.size;
  return new Promise((resolve, reject) => {
    let index = 0;
    for (let item of promises) {
      let currentIndex = index;
      currentIndex++;
      // Promise.resolve(item).then((data) => {
      //     result[currentIndex] = data;
      //     if (result.length === size) {
      //         resolve(result)
      //     }
      // }, reject)
      (async () => {
        try {
          const response = await Promise.resolve(item);
          result[currentIndex] = response;
          if (result.length === size) {
            resolve(result);
          }
        } catch (err) {
          reject(err);
        }
      })();
    }
  });
};
