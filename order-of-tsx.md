个人认为，按照下面顺序结构写组件，会比较好理解和不容易出错

从上到下为依次为  Props , Data , Computed , Watchers , Hooks , Methods , JSXMethods , Render

其中 Hooks 的顺序尽量按照 Vue 生命周期钩子函数的调用顺序排列

Computed 和 Methods 则应按照其引用关系排列，被引用的计算属性或者方法，应放在引用到该计算属性或方法的元素前面

```tsx
// card.tsx
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

// 类型定义 => Types
type Color = "blue" | "red";

// 全局变量 => Global
const color2opposite = new Map<Color, Color>([
  ["blue", "red"],
  ["red", "blue"]
]);

@Component
export class Card extends Vue {
  // 组件参数 => Props
  @Prop()
  public title: string | undefined;

  // 组件属性 => Data
  public color: Color = "blue";

  // 计算属性 => Computed
  public get oppositeColor(): Color {
    return color2opposite.get(this.color);
  }

  // 监听函数 => Watchers
  @Watch("title")
  public wTitle(title: string) {
    this.color = title.length > 10 ? "red" : "blue";
  }

  // 钩子函数 => Hooks
  public created() {
    this.wTitle(this.title);
  }

  // 组件方法 => Methods
  public logTitle() {
    console.log(this.title);
  }

  // 函数组件 => JSXMethods #返回组件的方法
  public LogButton(onClick: Function) {
    return <button onClick={onClick}>Click</button>;
  }

  // 渲染函数 => Render
  public render() {
    const { title, color, oppositeColor, logTitle, LogButton } = this;
    return (
      <div>
        <h3 style={{ color }}>{title}</h3>
        <div style={{ margin: "10px 0px", color: oppositeColor }}>Nothing to Tell</div>
        {LogButton(logTitle)}
      </div>
    );
  }
}
```
![](https://upload-images.jianshu.io/upload_images/26051212-4e29f26c8692b486.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


PS:
1. 暂未找到更好的函数组件的使用方式，现在这种实现怪异但可用

