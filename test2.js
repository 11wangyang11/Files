/**
回文判断
 */
var judge = function(str) {
    if(!str.length){
        return false;
    }
    let res = true;
    for(let i = 0;i<str.length/2;i++){
        if(str[i] !== str[str.length-i-1]){
            res = false;
            break;
        }
    }
    return res;
}
var partition = function(s) {
    const res = [];
    function backtrack(path, index) {
        if(index === s.length) {
            res.push([...path]);
            return;
        }
        for(let i = index; i<s.length; i++) {
            // i-index满足回文，继续判断下一个
            const str = s.slice(index, i+1);
            if(judge(str)){
                path.push(str);
                backtrack(path, i+1);
                path.pop();
            }
        }
    }
    backtrack([], 0);
    return res;
};
const s = 'aab';
const res = partition(s);
console.log(res);