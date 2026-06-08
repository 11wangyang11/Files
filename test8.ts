// 1. `Pick`（Easy）
//题目：实现 `MyPick<T, K>`，从 T 中选取 K 属性。
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P]
}

// type Eg = MyPick<{'a': 1, 'b': 2}, 'a'>; // {a: 1}

// 2. `Readonly`（Easy）
//题目：实现 `MyReadonly<T>`，将所有属性设为只读。
type MyReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? MyReadonly<T[P]> : T[P]
}

// 3. `TupleToObject`（Easy）
//题目：将元组转换为对象，键/值为元组元素。

type TupleToObject<T extends readonly (string | number | symbol)[]> = {
    [P in T[number]]: P
}

const tuple = ['a', 2, 3] as const
type Eg = TupleToObject<typeof tuple>

// 4. `First of Array`（Easy）
//题目：获取数组第一个元素类型。
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never

// 5. `Length of Tuple`（Easy）
//题目：获取元组长度（不使用 `.length`）。
type TupleLen<T extends (string | number | symbol)[]> = T['length']

// 6. `Exclude`（Medium）
//题目：实现 `MyExclude<T, U>`，从联合类型 T 中排除 U 中的成员。
type MyExclude<T, U> = T extends U ? never : T

// 7. `ReturnType`（Medium）
//题目：获取函数返回类型。


// 8. `Omit`（Medium）
//题目：实现 `MyOmit<T, K>`，从 T 中排除 K 属性。


// 9. `DeepReadonly`（Medium）
//题目：深度只读（我们刚才讲解的）。

// 注意：上面用 Record<string, unknown> 比 object 更精确（排除函数等）


// 10. `TupleToUnion`（Medium）
//题目：将元组转换为联合类型。

