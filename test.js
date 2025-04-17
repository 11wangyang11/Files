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

// 2314502
// 210

// s = "3[a]2[bc]"
// aaabcbc
// s = "3[a2[c]]"
// accaccacc

function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // 交换相邻元素
        }
      }
    }
    return arr;
  }

console.log(res);

