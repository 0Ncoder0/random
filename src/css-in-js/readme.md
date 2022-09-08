# CSS in JS

1. 生成随机 CSS 类名
2. 解析传入的 Styled 对象，生成 CSS 代码
3. 创建一个 style 标签，保存上一步生成的 CSS 代码，插入到 head 中
4. 返回 CSS 类名

ps: 支持伪类及子元素。事实上我们并不知道你的 Styled 对象中是否包含了子元素或伪类，我们只是将其自然的拼接到选择器中。


## 示例
### TS 源码
```js
const className = styled({
  display: "flex",
  alignItems: "center",
  span: {
    color: "blue"
  },
  ":hover": {
    color: "red"
  },
  ".prefix": {
    display: "inline-block",
    height: "12px",
    width: "12px",
    borderRadius: "50%",
    marginRight: "12px",
    backgroundColor: "green"
  }
});
```
### 生成的 CSS 代码
```html
<style css-in-js>
  .css-in-js-c21964 {
    display:flex;
    align-items:center;
  }
  .css-in-js-c21964 span {
    color:blue;
  }
  .css-in-js-c21964 :hover {
    color:red;
  }
  .css-in-js-c21964 .prefix {
    display:inline-block;
    height:12px;
    width:12px;
    border-radius:50%;
    margin-right:12px;
    background-color:green;
  }
</style>
```
