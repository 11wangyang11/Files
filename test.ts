 class ConcurrentRequest {
    private maxCount;
    private queue;
    private running;
    constructor(maxCount) {
        this.maxCount = maxCount;
        this.queue = [];
        this.running = 0;
    }

    // 动态调整并发数
    setMaxCount(maxCount) {
        this.maxCount = maxCount;
    }
    async execute(task, resolve, reject, priority, retryCount) {
        this.running++;
        try {
            const result = await task()
            resolve(result)
        } catch (error) {
            if (retryCount > 0) {
                const position = this.queue.findIndex(item => item.priority < priority);
                this.queue.splice(position === -1 ? this.queue.length : position, 0, { task, resolve, reject, priority, retryCount: retryCount - 1 });
                this.next();
            } else {
                reject(error)
            }
        } finally {
            this.running--;
            this.next();
        }
    }
    next() {
        while(this.running < this.maxCount && this.queue.length) {
            const {task, resolve, reject, priority, retryCount} = this.queue.shift()
            this.execute(task, resolve, reject, priority, retryCount)
        }
    }
    add(url, priority = 0, retryCount = 0) {
        // 超时控制
        const task = () =>
            Promise.race([
                fetch(url),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 10000)
                ),
            ]);
        return new Promise((resolve, reject) => {
            const position = this.queue.findIndex(item => item.priority < priority);
            this.queue.splice(position === -1 ? this.queue.length : position, 0, { task, resolve, reject, priority, retryCount });
            this.next();
        })
    }
}

const concurrentRequest = new ConcurrentRequest(3)
concurrentRequest.add('https://jsonplaceholder.typicode.com/posts/1', 3, 2).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})
concurrentRequest.add('https://jsonplaceholder.typicode.com/posts/2', 1, 2).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})