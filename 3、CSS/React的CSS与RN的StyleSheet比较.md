css多种样式写法，以及各自的优缺点，比如：
1、css用module.css还是.css，各自的优缺点。
2、css与RN的样式表不同，是静态的，面对不同场景的样式差异，是通过一个标签多个className还是类似RN那种通过style传入更加合适。
3、动态布局方面，react常直接获取元素并修改其样式，而RN好像（待调研）只能onlayout修改传入的style样式。直接修改好像可以实现无感知的动态布局（目前react上确实看不到样式变动过程，而RN经常会有）。
4、classname命名，RN样式表用法单一，且类似于css的.module.css，命名不容易冲突。而css使用非常多样化，比如子标签的classname是直接在父标签基础上&-xx，还是可以简写（项目中多种写法都有）。还有除了classname以外的其他写法为什么没有被推崇。
5、全局样式，比如暗黑模式。目前RN都是通过传入provider传入，usecontext触发。如果在css上我们怎么用？用相同方式传style吗
6其他