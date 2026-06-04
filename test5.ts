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

const res = inOrder(root)
console.log(res)

class BST {
    private root: RootNode | null
    constructor() {
        this.root = null
    }

    // 插入
    insert(val) {
        if (this.root === null) {
            this.root = new RootNode(val)
        } else {
            let cur = this.root
            while(root.val > val) {
                if (root.left) {
                    cur = root.left
                } else {
                    root.left = new RootNode(val)
                }
            }
            while(root.val < val) {
                if (root.right) {
                    cur = root.right
                } else {
                    root.right = new RootNode(val)
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
    delete(val) {
        const deleteTraverse = (node, val) => {
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
    search(val) {
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
class AVLTree {
    private root: AVLNode | null

    constructor() {
        this.root = null
    }

    private getHeight(node: AVLNode | null): number {
        return node?.height ?? 0
    }

    private updateHeight(node: AVLNode): void {
        node.height =
            1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
    }

    /** 平衡因子 = 左高 - 右高，AVL 要求 ∈ [-1, 1] */
    private getBalance(node: AVLNode): number {
        return this.getHeight(node.left) - this.getHeight(node.right)
    }

    private rotateRight(y: AVLNode): AVLNode {
        const x = y.left!
        const t2 = x.right
        x.right = y
        y.left = t2
        this.updateHeight(y)
        this.updateHeight(x)
        return x
    }

    private rotateLeft(x: AVLNode): AVLNode {
        const y = x.right!
        const t2 = y.left
        y.left = x
        x.right = t2
        this.updateHeight(x)
        this.updateHeight(y)
        return y
    }

    private balance(node: AVLNode): AVLNode {
        this.updateHeight(node)
        const bf = this.getBalance(node)

        // 左重
        if (bf > 1) {
            if (this.getBalance(node.left!) < 0) {
                node.left = this.rotateLeft(node.left!)
            }
            return this.rotateRight(node)
        }

        // 右重
        if (bf < -1) {
            if (this.getBalance(node.right!) > 0) {
                node.right = this.rotateRight(node.right!)
            }
            return this.rotateLeft(node)
        }

        return node
    }

    private insertNode(node: AVLNode | null, val: number): AVLNode {
        if (!node) {
            return new AVLNode(val)
        }
        if (val < node.val) {
            node.left = this.insertNode(node.left, val)
        } else if (val > node.val) {
            node.right = this.insertNode(node.right, val)
        }
        return this.balance(node)
    }

    insert(val: number): void {
        this.root = this.insertNode(this.root, val)
    }

    getMax(node: AVLNode | null = this.root): AVLNode | null {
        if (!node) return null
        while (node.right) {
            node = node.right
        }
        return node
    }

    getMin(node: AVLNode | null = this.root): AVLNode | null {
        if (!node) return null
        while (node.left) {
            node = node.left
        }
        return node
    }

    private deleteNode(node: AVLNode | null, val: number): AVLNode | null {
        if (!node) return null

        if (val < node.val) {
            node.left = this.deleteNode(node.left, val)
        } else if (val > node.val) {
            node.right = this.deleteNode(node.right, val)
        } else {
            if (!node.left) return node.right
            if (!node.right) return node.left
            const minRight = this.getMin(node.right)!
            node.val = minRight.val
            node.right = this.deleteNode(node.right, minRight.val)
        }

        if (!node) return null
        return this.balance(node)
    }

    delete(val: number): void {
        this.root = this.deleteNode(this.root, val)
    }

    search(val: number): boolean {
        let cur: AVLNode | null = this.root
        while (cur) {
            if (cur.val === val) return true
            cur = val < cur.val ? cur.left : cur.right
        }
        return false
    }
}