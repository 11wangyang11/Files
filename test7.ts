// 全排列不含重复数字
function Permute_1(nums: number[]) {
    const result: number[][] = []
    function backtrack(path: number[], used: boolean[]) {
        if (path.length === nums.length) {
            result.push([...path])
            return
        }
        for(let i=0;i<nums.length;i++) {
            if (used[i]) continue;
            used[i]=true;
            path.push(nums[i])
            backtrack(path, used)
            path.pop()
            used[i]=false
        }
    }
    backtrack([], new Array(nums.length).fill(false))
    return result
}

// 全排列含重复数字
function Permute(nums: number[]) {
    // 先排序，让重复数字在一起（保证全排列去重的方式是：重复数字必须“按顺序”取）
    nums.sort() // 1、排序
    const result: number[][] = []
    function backtrack(path: number[], used: boolean[]) {
        if (path.length === nums.length) {
            result.push([...path])
            return
        }
        for(let i=0;i<nums.length;i++) {
            if (used[i]) continue;
            if (i > 0 && nums[i - 1] === nums[i] && !used[i - 1]) continue // 2、剪枝
            used[i]=true;
            path.push(nums[i])
            backtrack(path, used)
            path.pop()
            used[i]=false
        }
    }
    backtrack([], new Array(nums.length).fill(false))
    return result
}

// 组合
function combine(nums: number[], k: number) {
    const result: number[][] = []
    function backtrack(path: number[], index: number) {
        if (path.length === k) {
            result.push([...path])
            return
        }
        // 剩余可选个数 < 还需选的个数，整枝返回
        if (nums.length - index < k - path.length) return
        for (let i = index; i < nums.length; i++) {
            path.push(nums[i])
            backtrack(path, i + 1)
            path.pop()
        }
    }
    backtrack([], 0)
    return result
}

// 子集
function subSets(nums: number[]) {
    const result: number[][] = []
    function backtrack(path: number[], index: number) {
        result.push([...path])
        for (let i = index; i < nums.length; i++) {
            path.push(nums[i])
            backtrack(path, i+1)
            path.pop()
        }
    }
    backtrack([], 0)
    return result
}

// 

const res = subSets([1,2,3])
console.log(res)
 
// 1 2 3
/**
 * 1 2 3
 * 
 */