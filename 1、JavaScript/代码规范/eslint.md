```js
module.exports = {
  env: {
    browser: true, // 启用浏览器全局变量 (window, document等)
    es2021: true, // 启用 ES2021 语法特性
    node: true, // 启用 Node.js 全局变量 (process, __dirname等)
  },
  extends: [
    'eslint:recommended', // ESLint 官方推荐规则
    'plugin:@typescript-eslint/recommended', // TypeScript ESLint 推荐规则
    'prettier' // 关闭与 Prettier 冲突的规则
  ],
  parser: '@typescript-eslint/parser', // 专门解析 TypeScript 的解析器
  // 配置解析器的行为
  parserOptions: {
    ecmaVersion: 12, // 使用 ECMAScript 2021 语法
    sourceType: 'module', // 使用 ES 模块 (import/export)
  },
  // 插件 - 扩展 ESLint 功能
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error', // 将 Prettier 格式问题报为错误
    '@typescript-eslint/no-unused-vars': 'error', // 未使用变量报错
    '@typescript-eslint/explicit-function-return-type': 'off', // 关闭函数必须显式返回类型
    'prefer-const': 'warn', // 建议使用 const 而不是 let
    'no-var': 'error' // 禁止使用 var，使用 let 或 const
  },
};
```

**注意**
1、extends 的执行顺序：'prettier' 必须在最后，以确保它能正确覆盖前面配置中的冲突规则；