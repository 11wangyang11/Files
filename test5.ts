class RootNode {
    val:number
    left: RootNode | null
    right: RootNode | null
    constructor(val:number,left=null,right=null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
/**
 *            1
 *       2         3
 *    4    5     6    7
 */

const root = new RootNode(1)
root.left = new RootNode(2)
root.right = new RootNode(3)
root.left.left = new RootNode(4)
root.left.right = new RootNode(5)
root.right.left = new RootNode(6)
root.right.right = new RootNode(7)

function maxDepth(root: RootNode | null): number {
    if (!root) { return 0}
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

function minDepth(root: RootNode | null) {
    if (!root) { 
        return 0
    }
    if (!root.left) {
        return minDepth(root.right) +1
    }
    if (!root.right) {
        return minDepth(root.left) + 1
    }
    return 1 + Math.min(minDepth(root.left), minDepth(root.right))
}

/**
 * 平衡二叉树定义： 每个节点高度差不超过1（注意，不是全局叶子深度差，仅仅是节点高度差）
 * Math.max(leftH, rightH) + 1表示节点的高度，不需要判断Math.min之类的进行比较。
 */
function isBalance(root: RootNode | null) {
    function height(root: RootNode | null) {
        if (!root) {
            return 0
        }
        const leftH = height(root.left)
        const rightH = height(root.right)
        if (leftH === -1 || rightH === -1) {
            return -1
        }
        return Math.abs(leftH - rightH) > 1 ? -1 : Math.max(leftH, rightH) + 1
    }
    return height(root) !== -1
}

/**
 * 二叉树最大路径和
 */
function maxPathSum(root: RootNode | null) {
    let max = -Infinity
    function dfs(node: RootNode | null) {
        if (!node) return 0
        const leftMax = Math.max(dfs(node.left), 0)
        const rightMax = Math.max(dfs(node.right), 0)
        const curMax = node.val + leftMax + rightMax
        max = Math.max(max, curMax)
        return node.val + Math.max(leftMax,rightMax)
    }
   dfs(root)
   return max
}

/**
 * 从前序遍历与中序遍历构建二叉树
 *          1
 *      2        3
 *    4  5     6   7
 * preorder [1,2,4,5,3,6,7] 根左右
 * inorder [4,2,5,1,6,3,7] 左根右
 */
function buildTree(preorder: Array<number>, inorder: Array<number>) {
    if (!preorder.length) return null
    function dfs(preRootIndex: number, inLeft: number, inRight: number) {
        if (inLeft > inRight) return null
        const rootVal = preorder[preRootIndex]
        let inorderIndex = inLeft
        for (let i=inLeft;i<=inRight;i++) {
            if (inorder[i] === rootVal) {
                inorderIndex = i
                break
            }
        }
        const node = new RootNode(inorder[inorderIndex])
        node.left = dfs(preRootIndex+1, inLeft, inorderIndex-1)
        node.right = dfs(preRootIndex+inorderIndex-inLeft+1, inorderIndex+1, inRight)
        return node
    }
    return dfs(0, 0, preorder.length-1) 
}

const preorder = [1,2,4,5,3,6,7] 
const inorder = [4,2,5,1,6,3,7]
const result = buildTree(preorder, inorder)
console.log(result)

/**
 * 二叉树搜索树公共祖先
 */
function nearest(root: RootNode | null, p: RootNode, q: RootNode) {
    if (!root) return null
    let node: RootNode | null = root
    while(node) {
        if (node.val > p.val && node.val > q.val) {
            node = node.right
        } else if (node.val < p.val && node.val < q.val) {
            node = node.left
        } else {
            return node
        }
    }
    return null
}
/**
 * 二叉树最近公共祖先
 */

function nearest2(root: RootNode | null, p: RootNode, q: RootNode) {
    function dfs(root: RootNode | null) {
        if (!root) return null
        if (p === root || q === root) return root
        const left = dfs(root.left)
        const right = dfs(root.right)
        if (left && right) return root
        return left ?? right
    }
    return dfs(root)
}


/**
 * 二叉树的序列化和反序列化
 */
function serial(root: RootNode | null) {
    if (!root) return '#'
    return root.val + ',' + serial(root.left) + ',' + serial(root.right)
}
function unSerial(str: string) {
    const nodeList = str.split(',')
    function buildNode() {
        const nodeVal = nodeList.shift()
        if(nodeVal === '#') return null
        const node = new RootNode(Number(nodeVal))
        node.left = buildNode()
        node.right = buildNode()
        return node
    }
    return buildNode()
}


// 前/中/后序
function preOrder_1(root) {
    const result: number[] = []
    function traverse(node) {
        if (!node) return
        result.push(node.val)
        traverse(node.left)
        traverse(node.right)
    }
    traverse(root)
    return result
}

// 层序使用队列；前序用栈
function layer(root) {
    const result: number[] = []
    const stack = [root]
    while(stack.length) {
        const node = stack.shift()
        result.push(node.val)
        if (node.left) {
            stack.push(node.left)
        }
        if (node.right) {
            stack.push(node.right)
        }
    }
    return result
}

function preOrder_2(root) {
    const result: number[] = []
    const stack = [root]
    while(stack.length) {
        const node = stack.pop()
        result.push(node.val)
        if (node.right) {
            stack.push(node.right)
        }
        if (node.left) {
            stack.push(node.left)
        }
    }
    return result
}

function inOrder(root) {
    const result: number[] = []
    const stack: RootNode[] = []
    let cur = root
    while(stack.length || cur) {
        while(cur) {
            stack.push(cur)
            cur = cur.left
        }
        const node = stack.pop() as RootNode
        result.push(node.val)
        cur = node.right
    }
    return result
}


/** 二叉搜索树 */
class BST {
    private root: RootNode | null
    constructor() {
        this.root = null
    }

    // 插入
    insert(val: number) {
        if (this.root === null) {
            this.root = new RootNode(val)
        } else {
            let cur = this.root
            while(true) {
                if (cur.val > val) {
                    if (cur.left) {
                        cur = cur.left
                    } else {
                        cur.left = new RootNode(val)
                        return
                    }
                } else if (cur.val < val) {
                    if (cur.right) {
                        cur = cur.right
                    } else {
                        cur.right = new RootNode(val)
                        return
                    }
                } else {
                    return; // 值已存在，不做插入
                }
            }
        }
    }
    // 最大值节点
    getMax(node = this.root) {
        if (!node){
            return null
        }
        while(node.right) {
            node = node.right
        }
        return node
    }
    // 最小值节点
    getMin(node = this.root) {
        if (!node){
            return null
        }
        while(node.left) {
            node = node.left
        }
        return node
    }
    // 删除
    delete(val: number) {
        const deleteTraverse = (node: RootNode | null, val: number) => {
            if (!node) {
                return null
            }
            if (node.val > val) {
                node.left = deleteTraverse(node.left, val)
                return node
            }
            if (node.val < val) {
                node.right = deleteTraverse(node.right, val)
                return node
            }
            // node.val = val
            if (!node.left) return node.right
            if (!node.right) return node.left
            const minRightNode = this.getMin(node.right) as RootNode
            node.val = minRightNode?.val
            node.right = deleteTraverse(node.right, minRightNode.val)
            return node
        }
        this.root = deleteTraverse(this.root, val)
    }
    // 查询
    search(val: number) {
        let cur = this.root
        if (!cur) {
            return false
        }
        while(cur) {
            if (cur.val === val) {
                return true
            }
            cur = val < cur.val ? cur.left : cur.right
        }
        return false
    }
}

class AVLNode {
    val: number
    left: AVLNode | null
    right: AVLNode | null
    height: number
    constructor(val: number) {
        this.val = val
        this.left = null
        this.right = null
        this.height = 1
    }
}

// 平衡二叉搜索树（AVL）
/**
 * AVL 树节点（假设已定义）
 * class AVLNode {
 *     val: number;
 *     left: AVLNode | null;
 *     right: AVLNode | null;
 *     height: number;      // 节点高度（叶子节点为1）
 *     constructor(val: number) { ... }
 * }
 */

class AVLTree {
    private root: AVLNode | null;

    constructor() {
        this.root = null;
    }

    // 获取节点高度，空节点高度为0
    private getHeight(node: AVLNode | null): number {
        return node?.height ?? 0;
    }

    // 更新节点高度（基于左右子树的高度）
    private updateHeight(node: AVLNode): void {
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    /**
     * 计算平衡因子
     * 平衡因子 = 左子树高度 - 右子树高度
     * AVL 要求平衡因子 ∈ [-1, 1]
     */
    private getBalance(node: AVLNode): number {
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    /**
     * 右旋操作（处理 LL 失衡）
     *      y                    x
     *     / \                  / \
     *    x   T3    ---->     T1   y
     *   / \                      / \
     *  T1 T2                    T2 T3
     * 返回新的子树根节点 x
     */
    private rotateRight(y: AVLNode): AVLNode {
        const x = y.left!;          // x 必存在（因为失衡时左子树更高）
        const t2 = x.right;         // 暂存 x 的右子树
        x.right = y;                // 右旋：x 成为新根，y 成为 x 的右孩子
        y.left = t2;                // t2 挂到 y 的左孩子
        this.updateHeight(y);       // 先更新 y 的高度（y 现在是孩子）
        this.updateHeight(x);       // 再更新 x 的高度
        return x;                   // 返回新根
    }

    /**
     * 左旋操作（处理 RR 失衡）
     *      x                        y
     *     / \                      / \
     *    T1  y        ---->       x   T3
     *       / \                  / \
     *      T2 T3                T1 T2
     * 返回新的子树根节点 y
     */
    private rotateLeft(x: AVLNode): AVLNode {
        const y = x.right!;         // y 必存在（因右子树更高）
        const t2 = y.left;          // 暂存 y 的左子树
        y.left = x;                 // 左旋：y 成为新根，x 成为 y 的左孩子
        x.right = t2;               // t2 挂到 x 的右孩子
        this.updateHeight(x);       // 先更新 x 的高度
        this.updateHeight(y);       // 再更新 y 的高度
        return y;
    }

    /**
     * 平衡调整（核心）
     * 1. 更新当前节点高度
     * 2. 计算平衡因子
     * 3. 根据四种失衡情况执行相应旋转
     * 返回平衡后的子树根节点
     */
    private balance(node: AVLNode): AVLNode {
        this.updateHeight(node);
        const bf = this.getBalance(node);

        // 左重（左子树比右子树高 2 以上）
        if (bf > 1) {
            // 左右（LR）情况：左孩子的平衡因子 < 0 表示左孩子的右子树更重
            if (this.getBalance(node.left!) < 0) {
                node.left = this.rotateLeft(node.left!); // 先左旋左孩子
            }
            // 左左（LL）情况：直接右旋当前节点
            return this.rotateRight(node);
        }

        // 右重（右子树比左子树高 2 以上）
        if (bf < -1) {
            // 右左（RL）情况：右孩子的平衡因子 > 0 表示右孩子的左子树更重
            if (this.getBalance(node.right!) > 0) {
                node.right = this.rotateRight(node.right!); // 先右旋右孩子
            }
            // 右右（RR）情况：直接左旋当前节点
            return this.rotateLeft(node);
        }

        // 已平衡，无需旋转
        return node;
    }

    // 递归插入辅助函数
    private insertNode(node: AVLNode | null, val: number): AVLNode {
        if (!node) {
            return new AVLNode(val);        // 创建新节点（高度默认为1，需在构造函数中设置）
        }
        if (val < node.val) {
            node.left = this.insertNode(node.left, val);
        } else if (val > node.val) {
            node.right = this.insertNode(node.right, val);
        }
        // 若 val === node.val，则忽略重复插入（可根据需要改为覆盖或累加）
        return this.balance(node);          // 回溯时平衡调整
    }

    // 公开插入方法
    insert(val: number): void {
        this.root = this.insertNode(this.root, val);
    }

    // 获取最大值节点（从指定节点或根开始）
    getMax(node: AVLNode | null = this.root): AVLNode | null {
        if (!node) return null;
        while (node.right) node = node.right;
        return node;
    }

    // 获取最小值节点（从指定节点或根开始）
    getMin(node: AVLNode | null = this.root): AVLNode | null {
        if (!node) return null;
        while (node.left) node = node.left;
        return node;
    }

    // 递归删除辅助函数
    private deleteNode(node: AVLNode | null, val: number): AVLNode | null {
        if (!node) return null;

        if (val < node.val) {
            node.left = this.deleteNode(node.left, val);
        } else if (val > node.val) {
            node.right = this.deleteNode(node.right, val);
        } else {
            // 找到要删除的节点
            // 情况1 & 2：只有一个孩子或没有孩子
            if (!node.left) return node.right;   // 左空 → 返回右孩子（可能为null）
            if (!node.right) return node.left;   // 右空 → 返回左孩子

            // 情况3：有两个孩子
            // 找到右子树中的最小节点（中序后继）
            const minRight = this.getMin(node.right)!;
            node.val = minRight.val;               // 用后继值覆盖当前节点
            // 递归删除右子树中的那个后继节点（它一定是叶子或只有右孩子）
            node.right = this.deleteNode(node.right, minRight.val);
        }

        // 删除完成后，如果当前节点不为空，进行平衡调整
        // （注意：node 可能因只有一个孩子而直接返回了孩子，不会执行到这里）
        if (!node) return null;
        return this.balance(node);
    }

    // 公开删除方法
    delete(val: number): void {
        this.root = this.deleteNode(this.root, val);
    }

    // 查找值是否存在
    search(val: number): boolean {
        let cur = this.root;
        while (cur) {
            if (cur.val === val) return true;
            cur = val < cur.val ? cur.left : cur.right;
        }
        return false;
    }
}