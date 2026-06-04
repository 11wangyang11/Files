class ListNode {
    val: number
    next: ListNode | null
    constructor(val = 0, next: ListNode | null  = null) {
        this.val = val
        this.next = next
    }
}
//  1-2-3-4
 const head = new ListNode(1)
 head.next = new ListNode(2)
 head.next.next = new ListNode(3)
 head.next.next.next = new ListNode(4)

 //  1-2-3-4
 // 反转链表
 function reverse(head) {
    let pre = null
    let cur = head
    while(cur) {
        let next = cur.next
        cur.next = pre
        pre = cur
        cur = next
    }
    return pre
 }

 // 删除节点
 function deleteNode(head, val) {
    let newHead = new ListNode(0,head)
    let node = newHead
    while(node.next) {
        if(node.next.val === val) {
            node.next = node.next.next
        } else {
            node = node.next
        }
    }
    return newHead.next
 }
 // 检测是否有环
 function hasCycle(head) {
    if(!head) {
        return false
    }
    let slow = head
    let fast = head.next
    while(fast && fast.next) {
        if (slow === fast) {
            return true
        }
        slow = slow.next
        fast = fast.next.next
    }
 }

 // 合并有序列表
 function mergeList(head1, head2) {
    if (!head1) {
        return head2
    }
    if (!head2) {
        return head1
    }
    let newHead = new ListNode(0)
    let cur = newHead
    while(head1 && head2) {
        if (head1.val < head2.val) {
            cur.next = head1
            head1 = head1.next
        } else {
            cur.next = head2
            head2 = head2.next
        }
        cur = cur.next
    }
    cur.next = head1 ?? head2

    return newHead.next
 }

 // 两数相加
 function sumList(head1, head2) {
    if (!head1) {
        return head2
    }
    if( !head2) {
        return head1
    }
    let head = new ListNode(0)
    let cur = head
    let carry = 0
    while(head1 || head2 || carry) {
        const sum = (head1?.val ?? 0) + (head2?.val ?? 0) + carry
        carry = Math.floor(sum / 10)
        cur.val = Math.floor(sum % 10)
        cur.next = new ListNode(0)
        cur = cur.next
        head1 = head1?.next ?? null
        head2 = head2?.next ?? null
    }
    return head
 }

 // k个一组反转链表
 // p-1-2-3-4-5-6
 // p-3-2-1, 4-5-6
 // 
function reverseKGroup(head, k) {
    // 检查是否有 k 个节点
    const check = (node) => {
        let count = 0;
        while (node && count < k) {
            count++;
            node = node.next;
        }
        return count === k;
    };
 
    // 反转 k 个节点
    const reverse = (node) => {
        let prev = null;
        let curr = node;
        for (let i = 0; i < k; i++) {
            const nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return { newHead: prev, nextGroup: curr };
    };
 
    // 创建哨兵节点
    const dummy = new ListNode(0);
    dummy.next = head;
    let prevGroup = dummy;
 
    while (check(prevGroup.next)) {
        const groupFirst = prevGroup.next;
        const { newHead, nextGroup } = reverse(groupFirst);
 
        // 连接：前一组的尾 -> 当前组的新头
        prevGroup.next = newHead;
        // 当前组的第一个节点现在指向下一组
        groupFirst.next = nextGroup;
 
        // 移动到下一组
        prevGroup = groupFirst;
    }
 
    return dummy.next;
}

 let node = deleteNode(head, 3)
 while(node) {
    console.log(node.val)
    node = node.next
 }

