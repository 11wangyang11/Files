```json
{
  "semi": true,  // 是否在语句末尾添加分号
  "trailingComma": "all",  // 对象、数组等多行结构的尾随逗号
  "singleQuote": true, // 是否使用单引号替代双引号
  "printWidth": 80, // 每行的最大字符数，超过此长度会换行
  "tabWidth": 2, // 缩进使用的空格数
  "bracketSpacing": true, // 对象字面量中花括号内的空格，{foo: bar}和{ foo: bar }
  "arrowParens": "avoid", // 箭头函数参数的括号，(x) => x和x => x
  "endOfLine": "lf" // 行结束符
}
```

代码风格如下：
```js
import { useState, useEffect } from 'react';
import { longFunctionName } from './utils';

const Component = ({ prop1, prop2, prop3 }) => {
  const [state, setState] = useState({
    name: 'John',
    age: 30,
    address: '123 Main St',
  });

  useEffect(() => {
    // 当printWidth超过80字符时会自动换行
    const result = longFunctionName(prop1, prop2, prop3, state.name, state.age);
    
    setState(prev => ({
      ...prev,
      result,
    }));
  }, [prop1, prop2, prop3]);

  return <div className="component">{state.name}</div>;
};

export default Component;
```