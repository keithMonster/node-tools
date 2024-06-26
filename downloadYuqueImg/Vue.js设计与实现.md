# 一、框架设计概览
## 1.权衡的艺术
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1652405856714-3e5f4644-ac55-41cb-a8e0-4e86d03f9690.jpeg)
声明式的更新性能损 = 找出差异的性能损耗 + 直接修改的性能损耗
虚拟DOM用于找出最小差异
运行时+编译时
## 2.框架设计的核心要素
## 3.Vue.js 的设计思路
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1652749629604-749c2b94-4cd6-4d20-89e2-7e02e6445b1f.jpeg)

# 二、响应系统
## 4.响应系统的作用与实现
![](https://cdn.nlark.com/yuque/0/2024/jpeg/301746/1711452720342-76583f0a-0553-4ad5-8c77-399b0c7e07fd.jpeg)
## 5.非原始值的响应式方案
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1653355716765-ff420921-92ab-4e0f-adbe-fa7871f12440.jpeg)
## 6.原始值的响应式方案
就是加了个包裹层，然后多了个toRef，就是设置get()操作时返回value
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1653356320051-e6b3c82e-bf9f-48d5-a0a0-efac5c9cf06d.jpeg)
# 三、渲染器
## 7.渲染器的设计
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1653442762847-e858fefe-59b4-45c0-a118-3bcc938d384a.jpeg)
## 8.挂载与更新
渲染器核心功能：挂载与更新
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1653961095195-3af62a37-f51a-4456-962c-a14aa134ef48.jpeg)
## 9.简单Diff算法
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1654564556383-ef5c3c0f-1d9d-4aa3-8225-6ebb149dc4d7.jpeg)
## 10.双端Diff算法(vue2)
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1654479097689-af7c08ed-4b85-49a6-acb8-b109fde92919.jpeg)
## 11.快速Diff算法(vue3)
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1654565347856-6e2f0644-f25b-410a-9546-b6358cfe7913.jpeg)

# 四、组件化
## 12.组件的实现原理
mountComponent
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1655084331189-cd3cc422-e1d0-49ae-93e4-3bf20747dad3.jpeg)
## 13.异步组件与函数式组件
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1655170743871-dd01bfa8-ba0d-4805-b301-03d600ce7807.jpeg)

## 14.内建组件和模块
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1655774592984-a479255f-12cb-4654-9a13-5ce1abd1bad5.jpeg)
# 五、编译器
## 15.编译器核心技术概览
a语言-> b语言 	源代码-> 目标代码区
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1656379756923-00df2ce6-0642-4558-aa1e-ba5bdb0847f4.jpeg)
模板编译
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1655948058337-572c4243-189f-4d43-9fef-a41cb015f374.jpeg)
解析器的状态机
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1656035500486-b37a454c-ddb7-4aff-af55-122d28bf549b.jpeg)
## 16.解析器
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1656465796772-8dd59cde-e0dc-40b1-ac65-7b798262fc5a.jpeg)
## 17.编译优化
尽可能区分动态内容与静态内容，针对不同内容采用不同的优化策略
只遍历可能变化的树
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1656553457987-ff6e8267-bdad-4baf-99ac-42faa6952c86.jpeg)
## 
# 六、服务端渲染
## 18.同构渲染
![](https://cdn.nlark.com/yuque/0/2022/jpeg/301746/1656640009735-a5d0ac00-6478-42cd-b5d0-9ba45e9f156e.jpeg)

