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

// 电话号码
function phoneLetter(digits: string) {
    const phoneMap = {
        '2': 'abc',
        '3': 'def',
        '4': 'ghi',
        '5': 'jkl',
        '6': 'mno',
        '7': 'pqrs',
        '8': 'tuv',
        '9': 'wxyz'
    };
    let res: string[] = []
    function backtrack(start: number, path: string) {
        if (path.length === digits.length) {
            res.push(path)
            return
        }

        const currentDigit = digits[start]
        const letters = phoneMap[currentDigit]
        for (const letter of letters) {
            backtrack(start+1, path+letter)
        }
    }
    backtrack(0, '')
    return res
}

// 组合总数
function sumCombination(candidates: number[], target:number) {
    const result: number[][] = []

    // 先排序，便于剪枝（如果当前数已经大于剩余目标，后面更大数不用尝试）
    candidates.sort((a, b) => a - b);

    function backtrack(path: number[], index: number, remain: number) {
        if (remain === 0) {
            result.push([...path])
            return
        }
        for(let i=index;i<candidates.length;i++) {
            if (candidates[i] > remain) break
            path.push(candidates[i])
            backtrack(path,i, remain-candidates[i] )
            path.pop()
        }
    }
    backtrack([], 0, target)
    return result
}

// 括号生成
function solveSombination(n: number) {
    const result: string[] = []
    function backtrack(path: string, leftCount: number, rightCount: number) {
        if (leftCount === rightCount && rightCount  === n) {
            result.push(path)
            return
        }
        if (leftCount < n) {
            backtrack(path + '(', leftCount+1, rightCount)
        }
        if (leftCount > rightCount) {
            backtrack(path + ')', leftCount, rightCount+1)
        }
    }
    backtrack('', 0, 0)
    return result
}

// 单词搜索
function searchWord(board: string[][], word: string) {
    function backtrack(i: number,j: number, path: string, used: boolean[][]) {
        if (path === word) {
            return true
        }
        // 只检查上下左右四个方向（非九宫格）
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const [dx, dy] of directions) {
            const nx = i + dx
            const ny = j + dy
            if (nx < 0 || ny < 0 || nx >= board.length || ny >= board[0].length) {
                continue
            }
            if (used[nx][ny]) continue
            if (board[nx][ny] === word[path.length]) {
                used[nx][ny] = true;
                if (backtrack(nx, ny, path+board[nx][ny], used)) {
                    return true
                }
                used[nx][ny] = false;
            }
        }
    }

    for (let i=0;i<board.length;i++) {
        for (let j=0;j<board[0].length;j++) {
            if (board[i][j] === word[0]) {
                const used = Array(board.length).fill(false).map(item => {
                    return  Array(board[0].length).fill(false)
                })
                used[i][j]=true
                if (backtrack(i,j,board[i][j], used)) {
                    return true
                }
            }
        }
    }
    return false
}

// 分割回文串 aaab
function combination(str: string) {
    const result: string[][] = []
    function judge(subStr: string) {
        if (!subStr.length) {
            return false
        }
        for(let i=0;i<=subStr.length/2;i++) {
            if (subStr[i] !== subStr[subStr.length-1-i]) {
                return false
            }
        }
        return true
    }
    function backtrack(index:number, path: string[]) {
        if (index === str.length) {
            result.push([...path])
            return
        }
        for (let i=index;i<str.length;i++) {
            const current = str.slice(index, i+1)
            if (judge(current)) {
                path.push(current)
                backtrack(i+1, path)
                path.pop()
            }
        }
    }
    backtrack(0, [])
    return result
}

const res = phoneLetter('23')
console.log(res)
 
// 1 2 3
/**
 * 1 2 3
 * 
 */