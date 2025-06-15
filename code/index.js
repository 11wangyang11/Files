Array.prototype.myReduce = function(callback, initialValue) {
    const arr = this; // 获取调用方arr，this指向的就是调用者arr
    const arrLength = arr.length;

    if (arrLength === 0 && initialValue === undefined) {
        throw TypeError('Reduce of empty array with no initial value');
    }
    const typeCallback = typeof callback
    if (typeCallback !== 'function'){
        throw new TypeError(typeCallback + ' ' + callback + 'is not function') 
    }

    initialValue = initialValue !== undefined ? initialValue : arr[0]
    let i = initialValue !== undefined ? 0 : 1
    while(i<arrLength) {
        initialValue = callback(initialValue, JSON.parse(JSON.stringify(arr[i])), i, arr)
        i++
    }
    return initialValue;
}

const arr = [1,2,3,4];
const res = arr.myReduce(function(prev, item, index, array) {
    return prev + item
}, 10)
console.log(res)