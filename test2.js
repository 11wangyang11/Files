var findMin = function(nums) {
    let start=0,end = nums.length-1;
    while(start<=end) {
        const mid = Math.floor((start+end)/2);
        // 最小值在中间
        if(nums[start] > nums[end]) {
            console.log('111', nums[mid], nums[start], nums[end])
            if(nums[mid] >= nums[start]) { // mid在最小值(旋转位置)的左边，
                start = mid+1;
            } else if (mid >0 && nums[mid] > nums[mid-1]) { // mid在最小值右边
                end = mid-1;
            } else {
                return nums[mid]; // mid就是最小值
            }
        } else {
            return nums[start];
        }
    }
};
nums = [3,1,2]
const res = findMin(nums);
console.log(res);