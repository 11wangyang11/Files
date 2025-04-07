class ListNode {
    constructor(val, next) {
      this.val = (val === undefined) ? 0 : val;
      this.next = (next === undefined) ? null : next;
    }
}

const node3 = new ListNode(3);
const node2 = new ListNode(2, node3);
const node1 = new ListNode(1, node2);

let head = new ListNode(5);
head.next = new ListNode(3);
head.next.next = new ListNode(9);

539
123

function addTwoList(h1, h2) {
    let head = new ListNode(0);
    let cur = head;
    let carry = 0;
    while(h1 || h2) {
        let val1 = h1 ? h1.val : 0;
        let val2 = h2 ? h2.val : 0;
        let sum = (val1 + val2 + carry);
        carry = Math.floor(sum / 10); // 取整
        cur.next = new ListNode(sum % 10);
        cur = cur.next;
        h1 = h1.next;
        h2 = h2.next;
    }
    if (carry) {
        cur.next = new ListNode(carry);
    }
    return head.next;
}

const res = addTwoList(node1, head);

console.log(res);

