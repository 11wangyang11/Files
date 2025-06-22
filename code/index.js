// Array.prototype.myReduce = function(callback, initialValue) {
//     const arr = this; // 获取调用方arr，this指向的就是调用者arr
//     const arrLength = arr.length;

//     if (arrLength === 0 && initialValue === undefined) {
//         throw TypeError('Reduce of empty array with no initial value');
//     }
//     const typeCallback = typeof callback
//     if (typeCallback !== 'function'){
//         throw new TypeError(typeCallback + ' ' + callback + 'is not function') 
//     }

//     initialValue = initialValue !== undefined ? initialValue : arr[0]
//     let i = initialValue !== undefined ? 0 : 1
//     while(i<arrLength) {
//         initialValue = callback(initialValue, JSON.parse(JSON.stringify(arr[i])), i, arr)
//         i++
//     }
//     return initialValue;
// }

Promise.myAll = function (promises) {
    const result = []
    const size = promises.length || promises.size // 只支持常用的实现length/size的可迭代对象
    let t = 0
    if (size === 0) {
        return resolve([])
    }

    return new Promise((resolve, reject) => {
        let index = 0
        for (const item of promises) { // 可迭代对象可以使用for of 遍历
            const currentIndex = index // // 保存当前索引（闭包捕获）
            index ++
            Promise.resolve(item).then(data => { // 使用Promise.resolve也可以处理非promise值
                result[currentIndex] = data
                if (++ t === size) { // Promise.all的resolve执行时机
                    resolve(result)
                }
            }, reject) // 第一个返回reject，直接操作Promise.all的reject
        }
    })
}

const arr = [1,Promise.resolve(2), Promise.reject('failed2')];
const res = Promise.myAll(arr).then(data => {
    console.log(data)
}, (err) => {
    console.log(err)
})
console.log(res)