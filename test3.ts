const arr = [1,2,4]
// arr.forEach((item, index, arr) => {
//     // arr.push(5)
//     console.log(item, index, arr)
// })
// console.log(arr)

const multiplier = {
    num: 2,
    apply(value) {
        return value * this.num
    }
}
// const result = arr.map(multiplier.apply, multiplier)
// console.log(result)

// arr.forEach(function (item) {
//     console.log(item, item * this.num)
// }.bind(multiplier))

Array.prototype.myForEach = function(callback, thisArgs) {
    const arr = this
    if (arr.length === 0) {
        return
    }
    for (let i =0; i < arr.length; i++) {
        callback.apply(thisArgs, [arr[i], i, arr])
    }
}

Array.prototype.myMap = function(callback, thisArgs) {
    const arr = this
    const len = arr.length
    if (len === 0) {
        return []
    }
    const result = new Array(len)
    for (let i=0;i<len;i++) {
        const res = callback.apply(thisArgs, [arr[i], i, arr])
        result[i] = res
    }
    return result
}

Array.prototype.myFiler = function(callback,thisArgs) {
    const arr = this
    const len = arr.length
    if (len === 0) {
        return []
    }
    const result = new Array()
    for (let i=0;i<len;i++) {
        const item = JSON.parse(JSON.stringify(arr[i])) // 深copy
        const res = callback.apply(thisArgs, [item, i, arr])
        if (res) {
            result.push(item)
        }
    }
    return result
}

Array.prototype.myReduce = function(callback, initialValue) {
    const arr = this
    const len = arr.length
    if (len === 0) {
        return []
    }
    const hasInitial = arguments.length >= 2
    let start = 0
    if (hasInitial) {
        // 传了初值，从 index 0 开始
    } else {
        initialValue = arr[0]
        start = 1 // 没传初值，arr[0] 已是 accumulator，从 index 1 开始
    }
    for (let i = start; i < len; i++) {
        initialValue = callback(initialValue, arr[i], i, arr)
    }
    return initialValue
}

Array.prototype.myFlat = function() {
    const arr = this
    const len = arr.length
    if (len === 0) {
        return []
    }
    return arr.reduce((res, cur) => {
        return res.concat(Array.isArray(cur) ? cur.myFlat() : cur)
    }, [])
}



const res = arr.myReduce(function (pre, cur, index, arr) {
    return pre + cur
})

console.log(res)