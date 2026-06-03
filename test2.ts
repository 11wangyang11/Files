class EventEmitter {
    private events;
    constructor() {
        this.events = {} // 事件集合
    }

    // 添加监听器
    on(event, listener) {
        if(!this.events[event]) {
            this.events[event] = []
        }
        this.events[event].push(listener)
    }
    // 触发
    emit(event, ...args) {
        if(this.events[event]) {
            this.events[event].forEach(listener => listener(...args))
        }
    }
    // 触发一次
    once(event, listener) {
        const onceListener = (...args) => {
            this.off(event, onceListener)
            listener(...args)
        }
        this.on(event, onceListener)
    }
    // 移出监听
    off(event, listener) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(l => l !== listener)
        }
    }
}

const emitter = new EventEmitter()

const onClick = (s: string) => console.log('onClick:', s)
const onPress = (s: string) => console.log('onPress:', s)

emitter.on('click', onClick)
emitter.on('press', onPress)

emitter.emit('click', '第一次 click')
emitter.emit('press', '第一次 press')

emitter.once('click', (s: string) => console.log('once click:', s))
emitter.emit('click', '第二次 click') // onClick + once 各执行一次
emitter.emit('click', '第三次 click') // 只剩 onClick

emitter.off('press', onPress)
emitter.emit('press', '第二次 press') // 无输出