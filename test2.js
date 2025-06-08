var topKFrequent = function(nums, k) {
    const countMap = new Map();
    // 构建一个出现次数的哈希表
    for(const num of nums) {
        const cur = countMap.get(num);
        countMap.set(num, (cur || 0)+1);
    }
    console.log('000', countMap)
    let minHeap = [], index = 0;
    // 找出哈希表第k大的元素
    for(const [key, value] of countMap) {
        if (index < k) {
            minHeap.push({key, value});
        } else {
            if (index === k){
                // 构建长度为k的小顶堆(包含元素和频率，以频率作为判断依据)
                for(let i = Math.floor((k-1)/2); i>=0;i--){
                    buildHeap(minHeap, k, i);
                }
            }
            // 遍历剩余元素，存储频率前k的元素
            if(minHeap[0].value < value) {
                minHeap[0] = {key, value};
                buildHeap(minHeap, k, 0); 
            }
        }
        index++;
        console.log('111', minHeap)
    }
    // 输出前k高的所有元素
    let res = [];
    for(const {key, value} of minHeap) {
        res.push(key);
    }
    return res;
};

function buildHeap(nums, n, i) {
    let min = i;
    let left = i*2+1;
    let right = i*2+2;
    // 找出左右节点的最小值
    if(left<n && nums[left].value < nums[min].value) min = left;
    if(right<n && nums[right].value < nums[min].value) min = right;
    if(min !==i) {
        [nums[i], nums[min]] = [nums[min], nums[i]];
        buildHeap(nums, n, min); // 递归到最底层，处理由交换引起的下层结构的变化
    }
}
nums = [1,1,1,2,2,3], 
res = topKFrequent(nums, 2);
console.log(res);