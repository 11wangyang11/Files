// 冒泡
function sort_1(arr) {
    const len = arr.length
    if (!len) {
        return []
    }
    let sortedIndex = len - 1
    while(sortedIndex > 0) {
        for(let j=0;j<sortedIndex;j++) {
            if(arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
            }
        }
        sortedIndex--
    }
    return arr
}

// 插入排序
function sort_2(arr){
    const len = arr.length
    if(!len || len < 2){
        return arr
    }
    for(let i =1;i<len;i++) {
        let current = arr[i]
        let j = i -1
        for(;j>=0;j--) {
            if (arr[j] > current) {
                arr[j+1] = arr[j]
            } else {
                break
            }
        }
        arr[j+1] = current
    }
    return arr
}

// 选择排序
function sort(arr) {
    
}



const arr = [3,4,6,1,2,6,5]
const res = sort(arr)
console.log(res)