var letterCombinations = function(digits) {
    const res = [];
    function backtrack(start, path) {
        if(path.length === digits.length) {
            res.push(path);
            return;
        }
        let leftStr = '';
        let length = 0;
        if (digits.charAt(start) < '7') {
            leftStr = String.fromCharCode('a'.charCodeAt(0) + (digits.charAt(start) - '2') * 3);
            length = 3;
        } else if (digits.charAt(start) === '7') {
            leftStr = 'p';
            length = 4;
        } else if (digits.charAt(start) === '8') {
            leftStr = 't';
            length = 3;
        } else {
            leftStr = 'w';
            length = 4;
        }
        console.log('11111', leftStr, length);
        for(let i = 0; i < length; i++) {
            path = path + String.fromCharCode(leftStr.charCodeAt(0) + i);
            backtrack(start + 1, path);
            path = path.slice(0, -1);
        }
    }
    backtrack(0, '');
    return res;
};

const res = letterCombinations('23');
console.log(res);