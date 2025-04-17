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

function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
      let current = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > current) {
        arr[j + 1] = arr[j]; // 向后移动元素
        j--;
        console.log('11', arr, i, j)
      }
      console.log('22', arr, i, j)
      arr[j + 1] = current; // 插入正确位置
    }
    return arr;
  }

const res = insertionSort([3,1,4,0]);
console.log(res);

