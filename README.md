# jquery.easy-select.js
a simple jQuery-based &lt;select> control

# 基本用法
``` javascript
$(selector).easySelect(options);
```

# options(配置项)
``` javascript
{
    // 提示文字
    placeholder: "请选择",
    // 对象数组
    data: [],
    // 模拟<option>标签的value属性
    // data[i]的某个key值
    // 生成模拟标签后, 会将该key对应的值保存到data-value属性上
    valueField: '',
    // data[i]的某个key值
    // 生成模拟标签后, 会将该key对应的值保存到data-text属性上
    // 同时也是在界面上显示的值
    textField: '',
    // 默认选项, 对应data的索引
    // 默认值为-1
    item: -1,
    // 可新增项时显示的提示文字
    // 当且仅当 typeof addItemCallback === 'function' 时生效
    addItemTips: '新增',
    // 点击'新增'后执行的函数
    // 该函数必须返回一个如下的对象
    // {result: true/false, data: {}}
    addItemCallback: false,
    // 可移除选项
    removeItemCallback: false
}
```
