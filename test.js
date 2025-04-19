class ListNode {
    constructor(val, next) {
      this.val = (val === undefined) ? 0 : val;
      this.next = (next === undefined) ? null : next;
    }
}

const node3 = new ListNode(3);
const node2 = new ListNode(2, node3);
const node1 = new ListNode(1, node2);

let head = new ListNode(4);
head.next = new ListNode(2);
head.next.next = new ListNode(1);
head.next.next.next = new ListNode(3);

class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right.left = new TreeNode(6);
root.right.right = new TreeNode(7);
/**
 *          1
 *       2     3
 *     4  5   6  7
 */
// [1] 1
// [3][2]  2
// [3][5][4] 4-5
// [3]
// [7][6]    3
//           6-7

/**
 * 前序遍历： 1-2-3-4-5-6-7-8
 */

function leverOrder(root) {
    if(!root) {
        return [];
    }
    let queue = [root];
    let result = [];
    while(queue.length) {
        const length = queue.length;
        for(let i=0;i<length;i++) {
            const node = queue.shift();
            // let level = []; // 也可以每层放进一个数组中
            // level.push(node.val);
            result.push(node.val);
            if(node.left) {
                queue.push(node.left);
            }
            if(node.right){
                queue.push(node.right);
            }
        }
    }
    return result;
}
const res = leverOrder(root);

console.log(res);
