import * as md5 from "md5-js";
import * as CSS from "csstype";
import _ from "lodash";

export interface Styled {
  [key: string]: Styled | CSS.Properties;
}

export default class CssInJs {
  private static prefix = "css-in-js";
  private static style = (() => {
    const style = document.createElement("style");
    document.head.appendChild(style);
    style[CssInJs.prefix] = true;
    return style;
  })();

  /**
   * 根据选择器和样式生成 css 内容
   */
  private static style2css = (selector: string, props: CSS.Properties) => {
    const cssProps = Object.keys(props).map(key => `${_.kebabCase(key)}:${props[key]}`);
    return [`${selector} {`, ...cssProps, "}"].join("\n");
  };

  /**
   * 随机生成一个CSS类名
   * @todo 去重
   */
  private static randomClassName = () => {
    const hash = md5(String(Math.random())).slice(-6);
    return `${CssInJs.prefix}-${hash}`;
  };

  /**
   * 新增样式代码
   * @todo 修改HTML或者新增DOM中选择消耗较小的那个（降低新增样式的成本）
   */
  private static appendStyle = (style: string) => {
    CssInJs.style.innerHTML += style;
  };

  /** 递归处理 Styled 对象，生存样式 */
  private static _styled = (selector: string, styled: Styled): string => {
    /** 样式属性 */
    const cssProps: CSS.Properties = {};
    /** 子元素 */
    const subSelector: string[] = [];

    /** 分离子元素和样式属性 */
    Object.keys(styled).forEach(key => {
      if (_.isObject(styled[key])) {
        subSelector.push(key);
      } else {
        cssProps[key] = styled[key];
      }
    });

    const style: string = CssInJs.style2css(selector, cssProps);
    const styles: string[] = subSelector.map(sub => CssInJs._styled(`${selector} ${sub}`, styled[sub] as Styled));

    return [style, ...styles].join("\n");
  };

  public static styled = (styled: Styled, className = CssInJs.randomClassName()) => {
    const css: string = CssInJs._styled(`.${className}`, styled);
    CssInJs.appendStyle(css);

    return className;
  };
}

export const styled = CssInJs.styled;
